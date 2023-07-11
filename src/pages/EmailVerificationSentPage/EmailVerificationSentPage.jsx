import { sendEmailVerification } from "firebase/auth";
import React, { useContext } from "react";
import { MdInfoOutline } from "react-icons/md";
import { AuthContext } from "../../contexts/AuthProvider/AuthProvider";
import { toast } from "react-hot-toast";

const EmailVerificationSentPage = () => {
  const { user } = useContext(AuthContext);
  const handleSendVerification = () => {
    sendEmailVerification(user)
      .then(() => {
        toast.success("Verification email sent");
      })
      .catch((error) => {
        console.log("Error sending verification email:", error);
      });
  };
  return (
    <div>
      <div className="flex h-screen w-screen flex-col items-center justify-center overflow-auto bg-primary md:mx-0  ">
        <div className="flex items-center rounded-md bg-blue-100 p-4 text-blue-800">
          <div className="mr-4">
            <MdInfoOutline size={24} />
          </div>
          <div>
            <p className="font-semibold">Email Verification Required</p>
            <p>Please verify your email to access all features.</p>
            <button
              className="text-xs font-bold"
              onClick={() => handleSendVerification()}
            >
              Send Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationSentPage;
