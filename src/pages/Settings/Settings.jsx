import React from "react";

const Settings = () => {
  return (
    <div className="space-y-5">
      <p>Business Information</p>
      <hr />
      <div className="grid grid-cols-2 gap-5">
        <input
          type="text"
          className="input-bordered input"
          placeholder="Business Name"
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
