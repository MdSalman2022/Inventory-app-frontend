import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthProvider/AuthProvider";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const { createUser, updateUser, providerLogin, signIn } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location?.state?.from.pathname || "/";

  const getUser = (user) => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/user/get-user/${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("get user", data);
        if (data.success === false) {
          toast.error("User not found");
        } else {
          const dbuser = data.user;
          console.log("user", dbuser);
          navigate(from, { replace: true });
          toast.success("Successfully Logged In");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    signIn(email, password)
      .then((result) => {
        const user = result.user;
        getUser(user);

        navigate(from, { replace: true });
        user.emailVerified && toast.success("Successfully Logged In");
      })
      .catch((error) => {
        if (error.message === "Firebase: Error (auth/user-not-found).") {
          toast.error("User not found");
        } else if (error.message === "Firebase: Error (auth/wrong-password).") {
          toast.error("Wrong Password");
        } else if (error.message === "Firebase: Error (auth/invalid-email).") {
          toast.error("Invalid Email");
        } else {
          toast.error("Something went wrong");
        }
        console.log(error.message);
      });
  };

  const saveUser = (name, email, authUid) => {
    const user = {
      username: name,
      email: email,
      authUid: authUid,
    };
    fetch(`${import.meta.env.VITE_SERVER_URL}/user/create-user`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("save user", data);
      });
  };

  return (
    <div className="fixed inset-0 z-10 mx-5 overflow-auto bg-primary md:mx-0">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <form
          onSubmit={handleSignUp}
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
              placeholder="example@gmail.com"
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
