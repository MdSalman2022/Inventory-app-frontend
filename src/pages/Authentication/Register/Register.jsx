import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthProvider/AuthProvider";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";

const Register = () => {
  const { createUser, updateUser, providerLogin } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location?.state?.from.pathname || "/";

  const handleSignUp = (e) => {
    e.preventDefault();

    const form = e.target;
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;

    createUser(email, password)
      .then((result) => {
        const user = result.user;
        const userInfo = { displayName: username };
        user.emailVerified && toast.success("Successfully Registered");
        const authUid = user.uid;
        updateUser(userInfo)
          .then(() => {
            sendEmailVerification(user)
              .then(() => {
                toast.success("Verification email sent");
              })
              .catch((error) => {
                console.log("Error sending verification email:", error);
              });

            toast.success(`Welcome ${user.displayName}`);
            saveUser(user.displayName, user.email, authUid);
            navigate(from, { replace: true });
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        console.log(error);
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
            <p>Username</p>
            <input
              type="text"
              name="username"
              placeholder="Rahat Osman"
              className="input-bordered input w-80 md:w-96"
            />
          </label>
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
          <button className="btn-primary btn">Register</button>
          <p>
            Already Registered ?{" "}
            <Link to="/login" className="text-info">
              Log In
            </Link>{" "}
            from here
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
