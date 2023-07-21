import React from "react";
import { MdInfoOutline } from "react-icons/md";

const AccountDisabledPage = () => {
  return (
    <div>
      <div className="flex h-screen w-screen flex-col items-center justify-center overflow-auto bg-primary md:mx-0  ">
        <div className="flex items-center rounded-md bg-blue-100 p-4 text-blue-800">
          <div className="mr-4">
            <MdInfoOutline size={24} />
          </div>
          <div>
            <p className="font-semibold">Account Disabled</p>
            <p>You are no longer an Employee of this store</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDisabledPage;
