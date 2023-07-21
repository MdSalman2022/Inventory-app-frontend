import { StateContext } from "@/contexts/StateProvider/StateProvider";
import React, { useContext } from "react";
import { toast } from "react-hot-toast";
import { GoCopy } from "react-icons/go";

const Settings = () => {
  const { userInfo } = useContext(StateContext);

  const handleCopy = () => {
    // onclick will copy the _id from userinfo
    navigator.clipboard.writeText(userInfo?._id);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p>Business Information</p>
        <p
          onClick={handleCopy}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-black p-3"
        >
          <GoCopy className="text-xl" />
          Copy Your ID
        </p>
      </div>
      <hr />
      <div className="grid grid-cols-2 gap-5">
        <input
          type="text"
          className="input-bordered input"
          placeholder="Business Name"
          defaultValue={userInfo?.username}
        />
        <input
          type="text"
          className="input-bordered input"
          placeholder="Email"
          defaultValue={userInfo?.email}
        />
        <input
          type="text"
          className="input-bordered input"
          placeholder="Profit Margin(%)"
        />
        <input
          type="text"
          className="input-bordered input"
          placeholder="Phone"
        />
        <input
          type="text"
          className="input-bordered input"
          placeholder="Quantity Target"
        />
        <input
          type="text"
          className="input-bordered input"
          placeholder="Address"
        />
        <input
          type="text"
          className="input-bordered input"
          placeholder="Orders Target"
        />
        <input
          type="text"
          className="input-bordered input"
          placeholder="City"
        />
        <input
          type="text"
          className="input-bordered input"
          placeholder="Sales Target"
        />
        <input
          type="text"
          className="input-bordered input"
          placeholder="Country "
        />
        <input
          type="text"
          className="input-bordered input"
          placeholder="Profit Target"
        />
        <input
          type="file"
          className="file-input-bordered file-input w-full max-w-xs"
        />
        <button className="btn-primary btn">Save</button>
      </div>
    </div>
  );
};

export default Settings;
