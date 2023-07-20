import React, { useContext } from "react";
import { StateContext } from "@/contexts/StateProvider/StateProvider";
import { toast } from "react-hot-toast";
import ModalBox from "../shared/Modals/ModalBox";

const AddSupplier = ({ isAddModalOpen, setIsAddModalOpen, refetch }) => {
  const { userInfo, storesRefetch } = useContext(StateContext);
  //   console.log(userInfo);

  const handleAddStore = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const phone = form.phone.value;
    const address = form.address.value;
    let status = form.status.checked;

    const supplier = {
      name,
      phone,
      address,
      sellerId: userInfo?._id,
      status,
    };

    fetch(`${import.meta.env.VITE_SERVER_URL}/supplier/create-supplier`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(supplier),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data?.result) {
          toast.success("Store added successfully");
          form.reset();
          setIsAddModalOpen(false);
          refetch();
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
        <div className="w-80 bg-white md:w-96">
          <p className="border-b p-5 font-bold">Store Information</p>
          <div className="p-5">
            <form onSubmit={handleAddStore} className="flex flex-col gap-5">
              <label>
                <p>Supplier Name</p>
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

              <div className="form-control w-52">
                <label className="label cursor-pointer">
                  <span className="label-text text-xl font-bold">Status</span>
                  <input
                    type="checkbox"
                    className="toggle-primary toggle"
                    name="status"
                  />
                </label>
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

export default AddSupplier;
