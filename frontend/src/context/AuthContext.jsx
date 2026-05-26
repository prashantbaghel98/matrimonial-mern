import {
  createContext,
  useState,
  useEffect
} from "react";

export const AuthContext =
  createContext();

export const AuthProvider = ({
  children
}) => {

  // ======================================================
  // STATES
  // ======================================================

  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  // ======================================================
  // LOAD AUTH DATA
  // ======================================================

  useEffect(() => {

    try {

      const savedUser =
        localStorage.getItem("user");

      const savedToken =
        localStorage.getItem("token");

      if (
        savedUser &&
        savedToken
      ) {

        setUser(
          JSON.parse(savedUser)
        );

        setToken(savedToken);

      }

    } catch (error) {

      console.log(error);

      localStorage.removeItem("user");

      localStorage.removeItem("token");

    } finally {

      setAuthLoading(false);

    }

  }, []);

  // ======================================================
  // LOGIN
  // ======================================================

  const login = (data) => {

    setUser(data.user);

    setToken(data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    localStorage.setItem(
      "token",
      data.token
    );

  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const logout = () => {

    setUser(null);

    setToken(null);

    localStorage.removeItem("user");

    localStorage.removeItem("token");

  };

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value = {

    user,

    token,

    login,

    logout,

    authLoading,

    isAuthenticated: !!token,

    isAdmin:
      user?.role === "admin"

  };

  return (

    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>

  );

};