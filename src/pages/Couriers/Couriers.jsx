import React, { useEffect, useState, useContext } from "react";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import { AiOutlineEdit } from "react-icons/ai";
import EditCourierModal from "../../components/Main/Couriers/EditCourierModal";
import { useQuery } from "react-query";
import { toast } from "react-hot-toast";
import { StateContext } from "@/contexts/StateProvider/StateProvider";

const Couriers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditCourierModalOpen, setIsEditCourierModalOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState({});
  const { userInfo } = useContext(StateContext);

  const fetchCouriers = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/courier/get-couriers?sellerId=${
        userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
      }`
    );
    const data = await res.json();
    return data.couriers;
  };

  const { data: couriers, refetch } = useQuery(
    ["couriers", userInfo],
    fetchCouriers
  );

  console.log(couriers);

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
      sellerId: userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId,
    };

    console.log(courier);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/courier/create-courier`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courier),
        }
      );

      const data = await res.json();
      if (data.success) {
        refetch();
        toast.success("Courier added successfully");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-5">
      <EditCourierModal
        isEditCourierModalOpen={isEditCourierModalOpen}
        setIsEditCourierModalOpen={setIsEditCourierModalOpen}
        selectedCourier={selectedCourier}
        refetch={refetch}
      ></EditCourierModal>
      <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <div className="space-y-5 p-5">
          <p>Courier Information</p>
          <form onSubmit={handleCourierSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="name"
              className="input-bordered input"
              placeholder="Name"
            />
            <input
              type="number"
              name="chargeInDhaka"
              className="input-bordered input"
              placeholder="Price in Dhaka"
            />
            <input
              type="number"
              name="chargeOutsideDhaka"
              className="input-bordered input"
              placeholder="Price outside Dhaka"
            />
            <div className="form-control w-52">
              <label className="label cursor-pointer">
                <span className="label-text">Status</span>
                <input
                  type="checkbox"
                  className="toggle-primary toggle"
                  name="status"
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
      <div className="flex justify-between">
        <p className="text-xl font-bold">Couriers</p>
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="btn-primary btn"
        >
          Add Courier
        </button>
      </div>
      <hr />

      <div className="space-y-5">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <p>Show</p>
            <select name="page" id="page" className="input-bordered input p-2">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <p>entries</p>
          </div>
          <div className="flex items-center gap-2">
            <p>Search</p>
            <form>
              <input
                name="search-key"
                type="text"
                className="input-bordered input"
              />
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table bg-white">
            {/* head */}
            <thead>
              <tr>
                <th className="w-5">Edit</th>
                <th className="w-5"></th>
                <th>Name</th>
                <th>Charge in Dhaka</th>
                <th>Charge Outside Dhaka</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {couriers?.map((courier, index) => (
                <tr key={courier._id}>
                  <td className="w-5">
                    <AiOutlineEdit
                      onClick={() => {
                        setIsEditCourierModalOpen(!isEditCourierModalOpen);
                        setSelectedCourier(courier);
                      }}
                      className="cursor-pointer rounded-full border border-black p-1 text-3xl"
                    />
                  </td>
                  <td className="w-5">{index + 1}</td>
                  <td>{courier.name}</td>
                  <td>{courier.chargeInDhaka}</td>
                  <td>{courier.chargeOutsideDhaka}</td>
                  <td>
                    {courier.status ? (
                      <button className="badge badge-success">Active</button>
                    ) : (
                      <button className="badge badge-error">Inactive</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-white">
              <tr>
                <th>Showing 1 to 2 of 2 entries</th>
                <th></th>
                <th></th>
                <th className="flex justify-end">
                  <div className="join">
                    <button className="join-item btn">Previous</button>
                    <button className="btn-primary join-item btn">1</button>
                    <button className="join-item btn ">Next</button>
                  </div>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Couriers;
