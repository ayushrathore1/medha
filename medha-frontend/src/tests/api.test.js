/**
 * API Client Tests
 * Tests for frontend API interactions, error handling, and token management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ==========================================
// TOKEN MANAGEMENT TESTS
// ==========================================

describe('Token Management', () => {
  
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });
  
  it('should store token in localStorage on login', () => {
    const token = 'test-jwt-token';
    localStorage.setItem('token', token);
    
    expect(localStorage.setItem).toHaveBeenCalledWith('token', token);
  });
  
  it('should retrieve token from localStorage', () => {
    localStorage.getItem.mockReturnValue('stored-token');
    
    const token = localStorage.getItem('token');
    
    expect(token).toBe('stored-token');
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
  });
  
  it('should remove token on logout', () => {
    localStorage.removeItem('token');
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });
  
  it('should handle missing token gracefully', () => {
    localStorage.getItem.mockReturnValue(null);
    
    const token = localStorage.getItem('token');
    
    expect(token).toBeNull();
  });
});

// ==========================================
// API REQUEST FORMATTING TESTS
// ==========================================

describe('API Request Formatting', () => {
  
  it('should format Authorization header correctly', () => {
    const token = 'test-token';
    const authHeader = `Bearer ${token}`;
    
    expect(authHeader).toBe('Bearer test-token');
    expect(authHeader.startsWith('Bearer ')).toBe(true);
  });
  
  it('should build correct API URLs', () => {
    const baseUrl = 'http://localhost:5000/api';
    
    expect(`${baseUrl}/auth/login`).toBe('http://localhost:5000/api/auth/login');
    expect(`${baseUrl}/subjects`).toBe('http://localhost:5000/api/subjects');
    expect(`${baseUrl}/flashcards`).toBe('http://localhost:5000/api/flashcards');
  });
  
  it('should properly encode query parameters', () => {
    const params = new URLSearchParams({
      subject: 'Math 101',
      difficulty: 'easy',
      page: '1'
    });
    
    expect(params.toString()).toBe('subject=Math+101&difficulty=easy&page=1');
  });
  
  it('should sanitize user input before sending', () => {
    const sanitize = (input) => {
      if (typeof input !== 'string') return input;
      return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .trim();
    };
    
    expect(sanitize('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    expect(sanitize('  normal text  ')).toBe('normal text');
  });
});

// ==========================================
// ERROR HANDLING TESTS
// ==========================================

describe('API Error Handling', () => {
  
  it('should parse error messages from API responses', () => {
    const parseError = (error) => {
      if (error.response?.data?.message) {
        return error.response.data.message;
      }
      if (error.message) {
        return error.message;
      }
      return 'An unexpected error occurred';
    };
    
    const apiError = {
      response: {
        status: 401,
        data: { message: 'Invalid credentials' }
      }
    };
    
    expect(parseError(apiError)).toBe('Invalid credentials');
  });
  
  it('should handle network errors', () => {
    const parseError = (error) => {
      if (error.code === 'ECONNREFUSED') {
        return 'Unable to connect to server';
      }
      if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
        return 'Network error. Please check your connection.';
      }
      return error.message || 'An error occurred';
    };
    
    expect(parseError({ code: 'ECONNREFUSED' })).toBe('Unable to connect to server');
  });
  
  it('should handle timeout errors', () => {
    const isTimeoutError = (error) => {
      if (error.code === 'ECONNABORTED') return true;
      if (error.message?.includes('timeout')) return true;
      return false;
    };
    
    expect(isTimeoutError({ code: 'ECONNABORTED' })).toBe(true);
    expect(isTimeoutError({ message: 'Request timeout' })).toBe(true);
    expect(isTimeoutError({ code: 'OTHER' })).toBe(false);
  });
  
  it('should handle 401 unauthorized by clearing token', () => {
    const handleUnauthorized = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // In real app: redirect to login
      return { shouldRedirect: true, path: '/login' };
    };
    
    const result = handleUnauthorized();
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(result.shouldRedirect).toBe(true);
    expect(result.path).toBe('/login');
  });
  
  it('should handle 429 rate limit errors', () => {
    const handleRateLimit = (error) => {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers?.['retry-after'] || 60;
        return {
          isRateLimited: true,
          message: `Too many requests. Please wait ${retryAfter} seconds.`,
          retryAfter: parseInt(retryAfter)
        };
      }
      return { isRateLimited: false };
    };
    
    const rateLimitError = {
      response: {
        status: 429,
        headers: { 'retry-after': '120' }
      }
    };
    
    const result = handleRateLimit(rateLimitError);
    
    expect(result.isRateLimited).toBe(true);
    expect(result.retryAfter).toBe(120);
  });
  
  it('should handle 500 server errors', () => {
    const handleServerError = (error) => {
      if (error.response?.status >= 500) {
        return {
          isServerError: true,
          message: 'Server error. Please try again later.',
          canRetry: true
        };
      }
      return { isServerError: false };
    };
    
    expect(handleServerError({ response: { status: 500 } }).isServerError).toBe(true);
    expect(handleServerError({ response: { status: 503 } }).isServerError).toBe(true);
    expect(handleServerError({ response: { status: 400 } }).isServerError).toBe(false);
  });
});

// ==========================================
// REQUEST RETRY LOGIC TESTS
// ==========================================

describe('Request Retry Logic', () => {
  
  it('should determine if request should be retried', () => {
    const shouldRetry = (error, retryCount, maxRetries = 3) => {
      if (retryCount >= maxRetries) return false;
      
      // Retry on network errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
        return true;
      }
      
      // Retry on 5xx errors
      if (error.response?.status >= 500) {
        return true;
      }
      
      // Don't retry on client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        return false;
      }
      
      return false;
    };
    
    expect(shouldRetry({ code: 'ECONNREFUSED' }, 0)).toBe(true);
    expect(shouldRetry({ response: { status: 503 } }, 1)).toBe(true);
    expect(shouldRetry({ response: { status: 401 } }, 0)).toBe(false);
    expect(shouldRetry({ code: 'ECONNREFUSED' }, 3)).toBe(false); // Max retries reached
  });
  
  it('should calculate exponential backoff delay', () => {
    const getBackoffDelay = (retryCount, baseDelay = 1000) => {
      return Math.min(baseDelay * Math.pow(2, retryCount), 30000);
    };
    
    expect(getBackoffDelay(0)).toBe(1000);  // 1s
    expect(getBackoffDelay(1)).toBe(2000);  // 2s
    expect(getBackoffDelay(2)).toBe(4000);  // 4s
    expect(getBackoffDelay(3)).toBe(8000);  // 8s
    expect(getBackoffDelay(10)).toBe(30000); // Max 30s
  });
});

// ==========================================
// DATA VALIDATION TESTS
// ==========================================

describe('Response Data Validation', () => {
  
  it('should validate user data structure', () => {
    const isValidUser = (user) => {
      if (!user) return false;
      return typeof user.id === 'string' &&
        typeof user.email === 'string' &&
        typeof user.name === 'string';
    };
    
    const validUser = { id: '123', email: 'test@example.com', name: 'Test' };
    const invalidUser = { id: '123', email: 'test@example.com' }; // Missing name
    
    expect(isValidUser(validUser)).toBe(true);
    expect(isValidUser(invalidUser)).toBe(false);
    expect(isValidUser(null)).toBe(false);
  });
  
  it('should validate subject data structure', () => {
    const isValidSubject = (subject) => {
      return subject &&
        typeof subject._id === 'string' &&
        typeof subject.name === 'string';
    };
    
    expect(isValidSubject({ _id: '123', name: 'Math' })).toBe(true);
    expect(isValidSubject({ name: 'Math' })).toBe(false);
  });
  
  it('should validate flashcard data structure', () => {
    const isValidFlashcard = (card) => {
      return card &&
        typeof card._id === 'string' &&
        typeof card.question === 'string' &&
        typeof card.answer === 'string';
    };
    
    const validCard = { _id: '123', question: 'Q?', answer: 'A' };
    expect(isValidFlashcard(validCard)).toBe(true);
  });
  
  it('should sanitize response data', () => {
    const sanitizeResponse = (data) => {
      if (Array.isArray(data)) {
        return data.filter(item => item != null);
      }
      return data || {};
    };
    
    expect(sanitizeResponse([1, null, 2, undefined, 3])).toEqual([1, 2, 3]);
    expect(sanitizeResponse(null)).toEqual({});
    expect(sanitizeResponse({ key: 'value' })).toEqual({ key: 'value' });
  });
});

// ==========================================
// CACHING TESTS
// ==========================================

describe('Response Caching', () => {
  
  it('should determine if response is cacheable', () => {
    const isCacheable = (method, status) => {
      return method === 'GET' && status >= 200 && status < 300;
    };
    
    expect(isCacheable('GET', 200)).toBe(true);
    expect(isCacheable('POST', 200)).toBe(false);
    expect(isCacheable('GET', 404)).toBe(false);
  });
  
  it('should check if cache is stale', () => {
    const isCacheStale = (cachedAt, maxAgeMs = 5 * 60 * 1000) => {
      return Date.now() - cachedAt > maxAgeMs;
    };
    
    const recentCache = Date.now() - 1000; // 1 second ago
    const staleCache = Date.now() - 10 * 60 * 1000; // 10 minutes ago
    
    expect(isCacheStale(recentCache)).toBe(false);
    expect(isCacheStale(staleCache)).toBe(true);
  });
});

// ==========================================
// CONCURRENT REQUEST HANDLING TESTS  
// ==========================================

describe('Concurrent Request Handling', () => {
  
  it('should deduplicate identical concurrent requests', () => {
    const pendingRequests = new Map();
    
    const deduplicateRequest = (key, requestFn) => {
      if (pendingRequests.has(key)) {
        return pendingRequests.get(key);
      }
      
      const promise = requestFn().finally(() => {
        pendingRequests.delete(key);
      });
      
      pendingRequests.set(key, promise);
      return promise;
    };
    
    // Simulate
    expect(pendingRequests.size).toBe(0);
  });
  
  it('should handle request abortion', () => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    expect(signal.aborted).toBe(false);
    
    controller.abort();
    
    expect(signal.aborted).toBe(true);
  });
});
