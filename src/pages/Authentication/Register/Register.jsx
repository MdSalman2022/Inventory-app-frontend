import React, { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthProvider/AuthProvider";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";

const Register = () => {
  const { createUser, updateUser, providerLogin, logOut } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [isEmployee, setIsEmployee] = useState(false);

  const from = location?.state?.from.pathname || "/";

  const handleSignUp = (e) => {
    e.preventDefault();

    const form = e.target;
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    const sellerId = form?.sellerId?.value;

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
                logOut();
                navigate("/login", { replace: true });
                isEmployee
                  ? saveEmployee(username, email, authUid, sellerId)
                  : saveUser(user.displayName, user.email, authUid);
              })
              .catch((error) => {
                console.log("Error sending verification email:", error);
              });
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveEmployee = (name, email, authUid, sellerId) => {
    const user = {
      username: name,
      email: email,
      authUid: authUid,
      sellerId: sellerId,
    };
    fetch(`${import.meta.env.VITE_SERVER_URL}/user/create-employee`, {
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
        <div className="w-80 md:w-96">
          <div className="grid grid-cols-2 justify-center">
            <div
              onClick={() => setIsEmployee(false)}
              className={`btn-info btn ${
                isEmployee ? "btn-outline" : ""
              } w-full rounded-b-none rounded-r-none`}
            >
              Marchant
            </div>
            <div
              onClick={() => setIsEmployee(true)}
              className={`btn-info btn  ${
                isEmployee ? "" : "btn-outline"
              }  w-full rounded-b-none rounded-l-none text-white`}
            >
              Employee
            </div>
          </div>

          {isEmployee ? (
            <form
              onSubmit={handleSignUp}
              className="flex flex-col gap-5 rounded-lg rounded-t-none bg-white p-5"
            >
              <label>
                <p>Username</p>
                <input
                  type="text"
                  name="username"
                  placeholder="Rahat Osman"
                  className="input-bordered input w-full"
                />
              </label>
              <label>
                <p>Email</p>
                <input
                  type="text"
                  name="email"
                  placeholder="example@gmail.com"
                  className="input-bordered input w-full"
                />
              </label>
              <label>
                <p>Password</p>
                <input
                  type="password"
                  name="password"
                  placeholder="********"
                  className="input-bordered input w-full"
                />
              </label>
              <label>
                <p>Marchant Id</p>
                <input
                  type="text"
                  name="sellerId"
                  placeholder="Marchant Id"
                  className="input-bordered input w-full"
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
          ) : (
            <form
              onSubmit={handleSignUp}
              className="flex flex-col gap-5 rounded-lg rounded-t-none bg-white p-5"
            >
              <label>
                <p>Username</p>
                <input
                  type="text"
                  name="username"
                  placeholder="Rahat Osman"
                  className="input-bordered input w-full"
                />
              </label>
              <label>
                <p>Email</p>
                <input
                  type="text"
                  name="email"
                  placeholder="example@gmail.com"
                  className="input-bordered input w-full"
                />
              </label>
              <label>
                <p>Password</p>
                <input
                  type="password"
                  name="password"
                  placeholder="********"
                  className="input-bordered input w-full"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
