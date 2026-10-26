import React, { createContext, useContext, useState, useCallback } from 'react';
import AuthPromptModal from '../components/Common/AuthPromptModal';
import { AuthContext } from '../AuthContext';

/**
 * AuthModalContext - Global context for managing the auth prompt modal
 * Allows any component to trigger the auth modal without prop drilling
 */
const AuthModalContext = createContext();

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return context;
};

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [featureName, setFeatureName] = useState('this feature');

  const showAuthModal = useCallback((feature = 'this feature') => {
    setFeatureName(feature);
    setIsOpen(true);
  }, []);

  const hideAuthModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AuthModalContext.Provider value={{ showAuthModal, hideAuthModal, isModalOpen: isOpen }}>
      {children}
      <AuthPromptModal 
        isOpen={isOpen} 
        onClose={hideAuthModal} 
        featureName={featureName}
      />
    </AuthModalContext.Provider>
  );
};

export default AuthModalContext;
