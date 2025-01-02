import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Initializing AuthContext");
    const token = localStorage.getItem("token");

    if (token) {
      authService
        .validateToken(token)
        .then((response) => {
          if (response?.user) {
            setUser(response.user);
          } else {
            console.error("Token validation response missing 'user'");
            localStorage.clear();
          }
        })
        .catch((err) => {
          console.error("Token validation failed:", err);
          setUser(null);
          localStorage.clear();
        })
        .finally(() => {
          setLoading(false);
          console.log("AuthContext loading complete");
        });
    } else {
      setLoading(false);
      console.log("No token found, setting loading to false");
    }
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      if (!response.data.user.user_type) {
        throw new Error("User role is missing");
      }
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.user_type);
      setUser(response.data.user);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: authService.isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
