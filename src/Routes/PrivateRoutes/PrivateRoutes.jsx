import React, { useContext } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider/AuthProvider";
import { StateContext } from "@/contexts/StateProvider/StateProvider";

const PrivateRoute = ({ children }) => {
  const { user, loading, logOut } = useContext(AuthContext);
  const { userInfo } = useContext(StateContext);
  const location = useLocation();

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
      </div>
    );

  if (user) {
    if (user.emailVerified && userInfo?.status !== false) {
      return children;
    } else if (!user.emailVerified) {
      return (
        <Navigate
          to="/email-verification-sent"
          state={{ from: location }}
          replace
        ></Navigate>
      );
    } else if (userInfo?.status === false) {
      logOut();
      return (
        <Navigate
          to="/account-disabled"
          state={{ from: location }}
          replace
        ></Navigate>
      );
    }
  }

  return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;
