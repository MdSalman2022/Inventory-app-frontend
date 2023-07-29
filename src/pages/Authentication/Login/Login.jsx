import React, { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthProvider/AuthProvider";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import { StateContext } from "../../../contexts/StateProvider/StateProvider";
import { EditUserLog } from "@/utils/fetchApi";

const Login = () => {
  const { createUser, updateUser, providerLogin, signIn, logOut } =
    useContext(AuthContext);

  const { userInfo, userInfoIsLoading, userInfoIsFetched, userRefetch } =
    useContext(StateContext);

  console.log("userinfo from state", userInfo);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location?.state?.from.pathname || "/";

  const EditUserVerification = async (user, status) => {
    try {
      console.log("edit user", user);
      console.log("edit user status", status);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/edit-user?id=${user.uid}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ verified: status }),
        }
      );
      const data = await response.json();

      console.log("edit user data", data);
      if (data?.success === true) {
        console.log("edit user", data);
        toast.success("Successfully Verified");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("user info state", userInfo);

  const handleSendVerification = (user) => {
    sendEmailVerification(user)
      .then(() => {
        toast.success("Verification email sent");
      })
      .catch((error) => {
        console.log("Error sending verification email:", error);
      });
  };

  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/get-user?id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const result = await signIn(email, password);
      const user = result.user;

      if (user) {
        // Fetch user info using the new function
        const userInfoResponse = await fetchUserInfo(user.uid);

        console.log("firebase user ", user);
        console.log("user info response ", userInfoResponse);

        // Check if user info was fetched successfully
        if (userInfoResponse.success) {
          const userInfo = userInfoResponse.user;

          if (user.emailVerified && userInfo?.verified) {
            console.log("user info in login", userInfo);
            toast.success(`Welcome ${user.displayName}`);
            EditUserLog(userInfo?._id, "Login", "User Login");
            navigate(from, { replace: true });
          } else if (user.emailVerified && !userInfo?.verified) {
            await EditUserVerification(user, true);
            toast.success(`Welcome ${user.displayName}`);
            EditUserLog(userInfo?._id, "Login", "User Login");
            navigate(from, { replace: true });
          } else if (!user.emailVerified && !userInfo?.verified) {
            toast.error("Please verify your email");
            handleSendVerification(user);
            toast.error("Verification email sent");
            EditUserLog(
              userInfo?._id,
              "Verification",
              "Email verification sent from login"
            );
            logOut();
            navigate("/login", { replace: true });
          } else if (!user.emailVerified && userInfo?.verified) {
            toast.error("Please verify your email");
            handleSendVerification(user);
            toast.error("Verification email sent");
            EditUserLog(
              userInfo?._id,
              "Verification",
              "Email verification sent from login for email verification"
            );
            logOut();
            navigate("/login", { replace: true });
          }
        } else {
          toast.error("Please Register First");
          console.log("User info fetch failed");
        }
      }
    } catch (error) {
      if (error.message === "Firebase: Error (auth/user-not-found).") {
        toast.error("User not found");
      } else if (error.message === "Firebase: Error (auth/wrong-password).") {
        toast.error("Wrong Password");
      } else if (error.message === "Firebase: Error (auth/invalid-email).") {
        toast.error("Invalid Email");
      }
      console.log(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-10 mx-5 overflow-auto bg-primary md:mx-0">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <form
          onSubmit={handleSignIn}
          className="flex flex-col gap-5 rounded-lg bg-white p-5"
        >
          <label>
            <p>Email</p>
            <input
              type="text"
              name="email"
              placeholder="example@gmail.com"
              className="input-bordered input w-80 md:w-96"
            />
          </label>
          <label>
            <p>Password</p>
            <input
              type="password"
              name="password"
              placeholder="********"
              className="input-bordered input w-80 md:w-96"
            />
          </label>
          <button className="btn-primary btn">Login</button>
          <p>
            Not Registered Yet ?{" "}
            <Link to="/register" className="text-info">
              Sign Up
            </Link>{" "}
            from here
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
