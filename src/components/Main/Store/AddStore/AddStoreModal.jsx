import React, { useContext } from "react";
import ModalBox from "../../shared/Modals/ModalBox";
import { StateContext } from "@/contexts/StateProvider/StateProvider";
import { toast } from "react-hot-toast";

const AddStoreModal = ({ isAddModalOpen, setIsAddModalOpen }) => {
  const { userInfo } = useContext(StateContext);
  //   console.log(userInfo);

  const handleAddStore = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const phone = form.phone.value;
    const address = form.address.value;
    const district = form.district.value;
    const area = form.area.value;
    const zip = form.zip.value;
    let status = form.status.checked;

    const store = {
      name,
      phone,
      address,
      district,
      ownerId: userInfo?._id,
      ownerInfo: userInfo,
      area,
      zip,
      status,
    };

    fetch(`${import.meta.env.VITE_SERVER_URL}/store/create-store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(store),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data?.store) {
          toast.success("Store added successfully");
          form.reset();
          setIsAddModalOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to add store");
      });
    console.log(`store`, store);
  };

  return (
    <div>
      <ModalBox isModalOpen={isAddModalOpen} setIsModalOpen={setIsAddModalOpen}>
        <div className="bg-white">
          <p className="border-b p-5 font-bold">Store Information</p>
          <div className="p-5">
            <form onSubmit={handleAddStore} className="flex flex-col gap-5">
              <label>
                <p>Store Name</p>
                <input
                  type="text"
                  className="input-bordered input w-full"
                  name="name"
                />
              </label>
              <label>
                <p>Phone</p>
                <input
                  type="text"
                  className="input-bordered input w-full"
                  name="phone"
                />
              </label>
              <label>
                <p>Address</p>
                <input
                  type="text"
                  className="input-bordered input w-full"
                  name="address"
                />
              </label>
              <div className="flex gap-5">
                <label className="w-1/2">
                  <p>District</p>
                  <input
                    type="text"
                    className="input-bordered input"
                    name="district"
                  />
                </label>
                <label className="w-1/2">
                  <p>Area</p>
                  <input
                    type="text"
                    className="input-bordered input"
                    name="area"
                  />
                </label>
              </div>
              <div className="flex">
                <label className="w-1/2">
                  <p>ZIP</p>
                  <input
                    type="text"
                    className="input-bordered input"
                    name="zip"
                  />
                </label>
                <div className="form-control w-1/2 justify-center">
                  <label className="label cursor-pointer">
                    <span className="label-text font-bold">Status</span>
                    <input
                      type="checkbox"
                      className="toggle-success toggle"
                      name="status"
                    />
                  </label>
                </div>
              </div>
              <div className="flex justify-between gap-5">
                <button type="button" className="btn-error btn-outline btn">
                  Cancel
                </button>
                <button type="submit" className="btn-primary btn">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </ModalBox>
    </div>
  );
};

export default AddStoreModal;
