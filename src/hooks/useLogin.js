import { useState } from 'react';

export function useLogin() {
  const [adminName, setAdminName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = async (onSuccess) => {
    setIsLoading(true);
    setLoginError("");
    
    try {
      const response = await fetch("http://localhost:4000/admin");
      
      if (!response.ok) {
        throw new Error("failed to fetch admin credentials");
      }
      
      const data = await response.json();
      
      // Compare input with stored credentials
      if (data.username === adminName && data.password === adminPassword) {
        setAdminName("");
        setAdminPassword("");
        onSuccess();
      } else {
        setLoginError("Invalid username or password");
      }
    } catch (error) {
      setLoginError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    adminName,
    setAdminName,
    adminPassword,
    setAdminPassword,
    loginError,
    isLoading,
    login,
  };
}
