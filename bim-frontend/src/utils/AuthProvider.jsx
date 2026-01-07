import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    loading: true,
    isAuthenticated: false,
    user: null,
    is_first_logged_in: null,
  });

  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const checkAuth = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/api/users/auth`, {
        credentials: "include",
      });

      if (response.ok) {
        const res = await response.json();
        console.log("Authenticated user:", res.user);
        setAuth({
          loading: false,
          isAuthenticated: true,
          user: res.user,
          is_first_logged_in: res.user.is_first_logged_in,
        });
      } else {
        setAuth({
          loading: false,
          isAuthenticated: false,
          user: null,
          is_first_logged_in: null,
        });
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setAuth({
        loading: false,
        isAuthenticated: false,
        user: null,
        is_first_logged_in: null,
      });
    }
  };
  useEffect(() => {
    checkAuth();
  }, [VITE_API_URL]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {auth.loading ? (
        <div className="flex justify-center items-center h-screen text-gray-500">
          Checking authentication...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
