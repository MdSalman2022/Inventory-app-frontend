import React from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { toast } from "react-hot-toast";

const EditSupplier = ({
  isEditModalOpen,
  setIsEditModalOpen,
  selectedSupplier,
  refetch,
}) => {
  const handleEditStore = (e) => {
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
      status,
    };

    console.log("supplier ", supplier);

    fetch(
      `${import.meta.env.VITE_SERVER_URL}/supplier/update-supplier?id=${
        selectedSupplier?._id
      }`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supplier),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.result) {
          toast.success("Store updated successfully");
          form.reset();
          setIsEditModalOpen(false);
          refetch();
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to add store");
      });
    console.log(`store`, supplier);
  };

  return (
    <div>
      <div>
        <ModalBox
          isModalOpen={isEditModalOpen}
          setIsModalOpen={setIsEditModalOpen}
        >
          <div className="w-80 bg-white md:w-96">
            <p className="border-b p-5 font-bold">Store Information</p>
            <div className="p-5">
              <form onSubmit={handleEditStore} className="flex flex-col gap-5">
                <label>
                  <p>Supplier Name</p>
                  <input
                    type="text"
                    className="input-bordered input w-full"
                    name="name"
                    defaultValue={selectedSupplier?.name}
                  />
                </label>
                <label>
                  <p>Phone</p>
                  <input
                    type="text"
                    className="input-bordered input w-full"
                    name="phone"
                    defaultValue={selectedSupplier?.phone}
                  />
                </label>
                <label>
                  <p>Address</p>
                  <input
                    type="text"
                    className="input-bordered input w-full"
                    name="address"
                    defaultValue={selectedSupplier?.address}
                  />
                </label>

                <div className="form-control w-52">
                  <label className="label cursor-pointer">
                    <span className="label-text text-xl font-bold">Status</span>
                    <input
                      type="checkbox"
                      className="toggle-primary toggle"
                      name="status"
                      defaultChecked={selectedSupplier?.status}
                    />
                  </label>
                </div>

                <div className="flex justify-between gap-5">
                  <button type="button" className="btn-error btn-outline btn">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary btn">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalBox>
      </div>
    </div>
  );
};

export default EditSupplier;
