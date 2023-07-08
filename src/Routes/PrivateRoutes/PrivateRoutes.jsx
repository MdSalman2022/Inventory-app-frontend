import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider/AuthProvider";
import { MdInfoOutline } from "react-icons/md";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
      </div>
    );

  if (user) {
    if (user.emailVerified) {
      return children;
    } else {
      return (
        <div className="fixed inset-0 z-10 mx-5 flex flex-col items-center justify-center overflow-auto bg-primary md:mx-0  ">
          <div className="flex items-center rounded-md bg-blue-100 p-4 text-blue-800">
            <div className="mr-4">
              <MdInfoOutline size={24} />
            </div>
            <div>
              <p className="font-semibold">Email Verification Required</p>
              <p>Please verify your email to access all features.</p>
            </div>
          </div>
        </div>
      );
    }
  }

  return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;
