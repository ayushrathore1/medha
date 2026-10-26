/**
 * Frontend Test Setup
 * Configures React Testing Library and mocks
 */

import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
global.IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
global.ResizeObserver = MockResizeObserver;

// Mock scrollTo
window.scrollTo = vi.fn();

// Mock import.meta.env
vi.stubGlobal('import.meta', {
  env: {
    VITE_BACKEND_URL: 'http://localhost:5000',
    MODE: 'test',
    DEV: false,
    PROD: false,
  },
});

// Console error/warn suppression for expected React warnings
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    // Suppress React act() warnings in tests
    if (args[0]?.includes?.('act(')) return;
    // Suppress ReactDOM.render deprecation in tests
    if (args[0]?.includes?.('ReactDOM.render')) return;
    originalError.call(console, ...args);
  };
  
  console.warn = (...args) => {
    // Suppress specific warnings
    if (args[0]?.includes?.('componentWillReceiveProps')) return;
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
