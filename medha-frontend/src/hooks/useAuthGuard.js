import { useContext, useCallback } from 'react';
import { AuthContext } from '../AuthContext';
import { useAuthModal } from '../context/AuthModalContext';

/**
 * useAuthGuard - Hook for protecting premium features
 * Provides utilities to check auth status and prompt authentication
 * 
 * @returns {Object} Auth guard utilities
 * - isAuthenticated: boolean - whether user is logged in
 * - user: object | null - current user data
 * - requireAuth: (callback, featureName?) => void - wraps actions that need auth
 * - showAuthPrompt: (featureName?) => void - directly shows auth modal
 * 
 * @example
 * const { isAuthenticated, requireAuth } = useAuthGuard();
 * 
 * const handleOpenSolution = () => {
 *   requireAuth(() => {
 *     window.open(solutionUrl, '_blank');
 *   }, 'AI Solutions');
 * };
 */
const useAuthGuard = () => {
  const { user } = useContext(AuthContext);
  const { showAuthModal } = useAuthModal();

  const isAuthenticated = !!user;

  /**
   * Wraps an action that requires authentication
   * If not authenticated, shows the auth modal instead of executing the action
   */
  const requireAuth = useCallback((callback, featureName = 'this feature') => {
    if (isAuthenticated) {
      callback();
    } else {
      showAuthModal(featureName);
    }
  }, [isAuthenticated, showAuthModal]);

  /**
   * Directly shows the auth prompt modal
   */
  const showAuthPrompt = useCallback((featureName = 'this feature') => {
    showAuthModal(featureName);
  }, [showAuthModal]);

  return {
    isAuthenticated,
    user,
    requireAuth,
    showAuthPrompt,
  };
};

export default useAuthGuard;
