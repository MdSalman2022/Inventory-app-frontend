import { StateContext } from "@/contexts/StateProvider/StateProvider";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { GoCopy } from "react-icons/go";

const Settings = () => {
  const { userInfo, userRefetch } = useContext(StateContext);
  const [previewImage, setPreviewImage] = useState("");

  const handleCopy = () => {
    // onclick will copy the _id from userinfo
    navigator.clipboard.writeText(userInfo?._id);
    toast.success("Copied to clipboard");
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    console.log(imageFile);
    const image = URL.createObjectURL(imageFile);

    console.log("image ", image);
    setPreviewImage(URL.createObjectURL(imageFile));
    console.log("previewimage ", previewImage);
  };

  console.log("previewImage", previewImage);

  const updateUser = async (e) => {
    console.log("update");
    e.preventDefault();
    const imageHostKey = import.meta.env.VITE_IMGBB_KEY;

    const form = e.target;
    const username = form.username.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const address = form.address.value;
    const city = form.city.value;
    let image = form?.image?.files[0];

    if (image) {
      const formData = new FormData();
      formData.append("image", image);
      const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
      try {
        const res = await fetch(url, {
          method: "POST",
          body: formData,
        });
        const imgUpload = await res.json();
        console.log("img upload ", imgUpload);
        if (imgUpload.success) {
          image = imgUpload.data.url;
          const payload = {
            username: username || userInfo?.username,
            email: email || userInfo?.email,
            phone: phone || userInfo?.phone,
            address: address || userInfo?.address,
            city: city || userInfo?.city,
            image: image || userInfo?.image,
          };

          console.log("payload ", payload);

          try {
            const putRes = await fetch(
              `${import.meta.env.VITE_SERVER_URL}/user/edit-user?id=${
                userInfo?.authUid
              }`,
              {
                method: "PUT",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify(payload),
              }
            );
            const result = await putRes.json();
            console.log("result ", result);
            if (result.success) {
              toast.success(`${userInfo.username} is updated successfully`);
              setPreviewImage("");
              userRefetch();
            } else {
              toast.error("Something went wrong");
            }
          } catch (putErr) {
            console.log(putErr);
            toast.error("Something went wrong");
          }
        }
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong");
      }
    } else {
      const payload = {
        username: username || userInfo?.username,
        email: email || userInfo?.email,
        phone: phone || userInfo?.phone,
        address: address || userInfo?.address,
        city: city || userInfo?.city,
        image: image || userInfo?.image,
      };

      console.log("payload ", payload);

      try {
        const putRes = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/user/edit-user?id=${
            userInfo?.authUid
          }`,
          {
            method: "PUT",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        const result = await putRes.json();
        console.log("result ", result);
        if (result.success) {
          toast.success(`${userInfo.username} is updated successfully`);
          setPreviewImage("");
          userRefetch();
        } else {
          toast.error("Something went wrong");
        }
      } catch (putErr) {
        console.log(putErr);
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="space-y-5 p-5">
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
      <form onSubmit={updateUser} className="grid grid-cols-2 gap-5">
        <input
          type="text"
          className="input-bordered input"
          placeholder="Business Name"
          name="username"
          defaultValue={userInfo?.username}
        />
        <input
          type="text"
          className="input-bordered input"
          placeholder="Email"
          name="email"
          defaultValue={userInfo?.email}
        />
        {/* <input
          type="text"
          className="input-bordered input"
          placeholder="Profit Margin(%)"
        /> */}
        <input
          type="text"
          name="phone"
          className="input-bordered input"
          placeholder="Phone"
          required
        />
        {/* <input
          type="text"
          className="input-bordered input"
          placeholder="Quantity Target"
        /> */}
        <input
          type="text"
          name="address"
          className="input-bordered input"
          placeholder="Address"
          required
        />
        {/* <input
          type="text"
          className="input-bordered input"
          placeholder="Orders Target"
        /> */}
        <input
          type="text"
          name="city"
          className="input-bordered input"
          placeholder="City"
          required
        />
        {/* <input
          type="text"
          className="input-bordered input"
          placeholder="Sales Target"
        /> */}
        {/* <input
          type="text"
          className="input-bordered input"
          placeholder="Profit Target"
        /> */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-10">
            {userInfo?.image && (
              <img
                className="h-20 w-20 rounded-full"
                src={userInfo?.image}
                alt=""
              />
            )}
            {previewImage && (
              <div className="flex flex-col items-center gap-2">
                <img
                  className="h-20 w-20 rounded-full"
                  src={previewImage}
                  alt=""
                />
                <span className="badge badge-error">New</span>
              </div>
            )}
          </div>
          <input
            type="file"
            name="image"
            className="file-input-bordered file-input w-full max-w-xs"
            onChange={handleImageChange} // Add this event handler
          />
        </div>
        <button type="submit" className="btn-primary btn">
          Save
        </button>
      </form>
    </div>
  );
};

export default Settings;
