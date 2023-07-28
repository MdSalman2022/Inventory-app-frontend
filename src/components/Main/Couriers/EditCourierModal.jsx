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
    const api = form.api.value;
    const secret = form.secret.value;
    const chargeInDhaka = form.chargeInDhaka.value;
    const chargeOutsideDhaka = form.chargeOutsideDhaka.value;
    const status = form.status.checked;

    const courier = {
      name,
      api,
      secret,
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
        <div className="w-96 space-y-5 p-5">
          <p>Courier Information</p>
          <form onSubmit={handleCourierSubmit} className="flex flex-col gap-3">
            <label htmlFor="" className="space-y-1">
              <p>Courier Name</p>
              <input
                type="text"
                name="name"
                className="input-bordered input w-full"
                placeholder="Name"
                defaultValue={selectedCourier?.name}
              />
            </label>
            <label htmlFor="" className="space-y-1">
              <p>Api-Key</p>
              <input
                type="text"
                name="api"
                className="input-bordered input w-full"
                placeholder="Api Key"
                defaultValue={selectedCourier?.api}
              />
            </label>
            <label htmlFor="" className="space-y-1">
              <p>Secret-Key</p>
              <input
                type="text"
                name="secret"
                className="input-bordered input w-full"
                placeholder="Secret key"
                defaultValue={selectedCourier?.secret}
              />
            </label>
            <label htmlFor="" className="space-y-1">
              <p>Charge In Dhaka</p>
              <input
                type="number"
                name="chargeInDhaka"
                className="input-bordered input w-full"
                placeholder="Price in Dhaka"
                defaultValue={selectedCourier?.chargeInDhaka}
              />
            </label>
            <label htmlFor="" className="space-y-1">
              <p>Charge Outside Dhaka</p>
              <input
                type="number"
                name="chargeOutsideDhaka"
                className="input-bordered input w-full"
                placeholder="Price outside Dhaka"
                defaultValue={selectedCourier?.chargeOutsideDhaka}
              />
            </label>
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
