"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type ErrorContextType = {
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  clearErrorMessage: () => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [errorMessage, setErrorMessageState] = useState('');

  const setErrorMessage = (message: string) => {
    setErrorMessageState(message);
  };

  const clearErrorMessage = () => {
    setErrorMessageState('');
  };

  return (
    <ErrorContext.Provider value={{ errorMessage, setErrorMessage, clearErrorMessage }}>
      {children}
    </ErrorContext.Provider>
  );
}; 