import { createContext, useEffect, useState } from "react";
import { app, analytics } from "../../Firebase/Firebase.config";

import {
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  getAuth,
  multiFactor,
  onAuthStateChanged,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-hot-toast";
import { sendToServer } from "src/components/Main/Shared/AuthModal/LoginToDb";

const auth = getAuth(app);

export const AuthContextFull = createContext();

const AuthProviderFull = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // const user = await

  // console.log('state user', user);
  // console.log(user);
  const providerLogin = (provider) => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  const updateUser = (userInfo) => {
    setLoading(true);
    console.log(userInfo);
    return updateProfile(auth.currentUser, userInfo);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // functions for otp login

  const handleMobileLogin = (phoneNumber) => {
    // e.preventDefault();
    // reVerify();
    const appVerifier = (window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha",
      {
        size: "invisible",
        callback: (response) => {
          // console.log(response);
          response
            ? console.log("recaptcha resolved")
            : console.error("recaptcha not resolved");
        },
      },
      auth
    ));

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        toast.success(`OTP sent to ${phoneNumber}`);
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Too many request from this number. Please try again later"
        );
        console.log(error);
      });
  };

  // console.log(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // console.log(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    providerLogin,
    updateUser,
    logOut,
    setLoading,
    handleMobileLogin,
  };

  return (
    <AuthContextFull.Provider value={authInfo}>
      {children}
    </AuthContextFull.Provider>
  );
};

export default AuthProviderFull;
