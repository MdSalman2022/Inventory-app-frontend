import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import EditUserModal from "../../components/Main/Users/EditUserModal";
import { AiOutlineEdit } from "react-icons/ai";
import { StateContext } from "../../contexts/StateProvider/StateProvider";
import { toast } from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import DeleteStoreModal from "@/components/Main/Store/AddStore/DeleteStoreModal";
import AddStoreModal from "@/components/Main/Store/AddStore/AddStoreModal";
import EditStoreModal from "@/components/Main/Store/AddStore/EditStoreModal";

const Store = () => {
  const { userInfo, stores, storesRefetch } = useContext(StateContext);
  console.log(userInfo);

  console.log("stores", stores);

  const [selectedStore, setSelectedStore] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const formatTimestamp = (timestamp) => {
    // i want the time stamp to output in this format
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  console.log(isEditModalOpen);

  return (
    <div className="w-screen space-y-3 p-3 md:w-full md:space-y-4 md:p-0">
      <AddStoreModal
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
      />
      {stores.length < 1 && (
        <div className="flex w-full justify-between">
          <p className="text-xl font-bold">Stores</p>
          <button
            onClick={() => setIsAddModalOpen(!isAddModalOpen)}
            className="btn-primary btn-outline btn"
          >
            Add Store
          </button>
        </div>
      )}
      <hr />

      <div className="space-y-5">
        <EditStoreModal
          setIsEditModalOpen={setIsEditModalOpen}
          isEditModalOpen={isEditModalOpen}
          selectedStore={selectedStore}
          refetch={storesRefetch}
        />
        <DeleteStoreModal
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          selectedStore={selectedStore}
          refetch={storesRefetch}
        />

        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <p>Show</p>
            <select name="page" id="page" className="input-bordered input p-2">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        {stores?.length > 0 ? (
          <div className="h-[70vh] overflow-x-auto rounded-lg bg-white">
            <table className="table rounded-lg bg-white">
              {/* head */}
              <thead>
                <tr>
                  <th className="w-5 bg-primary text-white"></th>
                  <th className="bg-primary text-white">Store</th>
                  <th className="bg-primary text-white">Phone</th>
                  <th className="bg-primary text-white">Address</th>
                  <th className="bg-primary text-white">Status</th>
                  <th className="bg-primary text-white">Time</th>
                  <th className="bg-primary text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {stores?.map((user, index) => (
                  <tr key={index}>
                    <th className="w-5">{index + 1}</th>

                    <td>{user?.name}</td>
                    <td>{user?.phone}</td>
                    <td>{user?.address}</td>
                    <td>
                      {user?.status ? (
                        <button className="badge badge-success">Active</button>
                      ) : (
                        <button className="badge badge-error">Inactive</button>
                      )}
                    </td>
                    <td>{formatTimestamp(user?.timestamp)}</td>
                    <td>
                      <div className="dropdown-left dropdown">
                        <label tabIndex={0} className="btn m-1">
                          <BsThreeDots size={18} />
                        </label>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu rounded-box z-[1] w-40 bg-base-100  shadow"
                        >
                          <li>
                            <button
                              className="btn-ghost btn flex h-5 flex-col items-center justify-center text-xs"
                              onClick={() => {
                                const isAdmin = userInfo?.role === "Admin";
                                const isItYou =
                                  userInfo?.authUid === user?.authUid;
                                if (isAdmin && !isItYou) {
                                  setIsDeleteModalOpen(!isDeleteModalOpen);
                                  setSelectedStore(user);
                                } else if (isItYou) {
                                  toast.error("You can't delete yourself");
                                } else {
                                  toast.error(
                                    "You are not authorized to edit user"
                                  );
                                }
                              }}
                            >
                              Delete
                            </button>
                          </li>
                          <li>
                            <button
                              className="btn-ghost btn flex h-5 flex-col items-center justify-center text-xs"
                              onClick={() => {
                                const isAdmin = userInfo?.role === "Admin";
                                if (isAdmin) {
                                  setSelectedStore(user);
                                  setIsEditModalOpen(!isEditModalOpen);
                                } else {
                                  toast.error(
                                    "You are not authorized to edit user"
                                  );
                                }
                              }}
                            >
                              Edit
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* <tfoot className="bg-white">
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
            </tfoot> */}
            </table>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center">
            <p className="text-2xl font-bold">No Stores Yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
