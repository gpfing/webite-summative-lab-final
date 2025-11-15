import { createContext, useState, useEffect } from 'react';

export const LoginContext = createContext();

export function LoginProvider({ children }) {
  // initialize from localStorage so login persists across refreshes
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('isAdminLoggedIn') === 'true';
    } catch (e) {
      return false;
    }
  });

  // persist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('isAdminLoggedIn', isLoggedIn);
    } catch (e) {
      console.error('Failed to save login state to localStorage', e);
    }
  }, [isLoggedIn]);

  const setIsLoggedInWrapper = (value) => {
    setIsLoggedIn(value);
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn: setIsLoggedInWrapper }}>
      {children}
    </LoginContext.Provider>
  );
}
