import { useState, useEffect } from "react";

interface User {
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se há usuário logado no localStorage
    const loggedIn = localStorage.getItem("tribo_logged_in") === "true";
    const email = localStorage.getItem("tribo_user_email");

    if (loggedIn && email) {
      setUser({ email });
    }

    setIsLoading(false);
  }, []);

  const login = (email: string) => {
    localStorage.setItem("tribo_logged_in", "true");
    localStorage.setItem("tribo_user_email", email);
    setUser({ email });
  };

  const logout = () => {
    localStorage.removeItem("tribo_logged_in");
    localStorage.removeItem("tribo_user_email");
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
};
