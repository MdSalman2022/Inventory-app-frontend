import React, { useState } from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { toast } from "react-hot-toast";

const EditCourierModal = ({
  isEditCourierModalOpen,
  setIsEditCourierModalOpen,
  selectedCourier,
  refetch,
}) => {
  const handleCourierSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const chargeInDhaka = form.chargeInDhaka.value;
    const chargeOutsideDhaka = form.chargeOutsideDhaka.value;
    const status = form.status.checked;

    const courier = {
      name,
      chargeInDhaka,
      chargeOutsideDhaka,
      status,
    };

    console.log(courier);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/courier/edit-courier-info?id=${
          selectedCourier?._id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courier),
        }
      );

      const data = await res.json();
      console.log(data);
      if (data.success) {
        refetch();
        setIsEditCourierModalOpen(false);
        toast.success("Courier updated successfully");
      }

      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <ModalBox
        isModalOpen={isEditCourierModalOpen}
        setIsModalOpen={setIsEditCourierModalOpen}
      >
        <div className="space-y-5 p-5">
          <p>Courier Information</p>
          <form onSubmit={handleCourierSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="name"
              className="input-bordered input"
              placeholder="Name"
              defaultValue={selectedCourier?.name}
            />
            <input
              type="number"
              name="chargeInDhaka"
              className="input-bordered input"
              placeholder="Price in Dhaka"
              defaultValue={selectedCourier?.chargeInDhaka}
            />
            <input
              type="number"
              name="chargeOutsideDhaka"
              className="input-bordered input"
              placeholder="Price outside Dhaka"
              defaultValue={selectedCourier?.chargeOutsideDhaka}
            />
            <div className="form-control w-52">
              <label className="label cursor-pointer">
                <span className="label-text">Status</span>
                <input
                  type="checkbox"
                  className="toggle-primary toggle"
                  name="status"
                  defaultChecked={selectedCourier?.status}
                />
              </label>
            </div>

            <div className="flex w-full items-center justify-between">
              <button className="btn-error btn">Cancel</button>
              <button type="submit" className="btn-primary btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </ModalBox>
    </div>
  );
};

export default EditCourierModal;
