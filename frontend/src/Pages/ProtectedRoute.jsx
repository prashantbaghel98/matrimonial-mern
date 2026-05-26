import React, {
  useContext
} from "react";

import {
  Navigate
} from "react-router-dom";

import {
  AuthContext
} from "../context/AuthContext";

const ProtectedRoute = ({
  children
}) => {

  const {
    isAuthenticated,
    authLoading
  } = useContext(AuthContext);

  // ======================================================
  // LOADING
  // ======================================================

  if (authLoading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      </div>

    );

  }

  // ======================================================
  // NOT LOGIN
  // ======================================================

  if (!isAuthenticated) {

    return <Navigate to="/login" />;

  }

  return children;

};

export default ProtectedRoute;