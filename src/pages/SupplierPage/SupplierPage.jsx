import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import EditUserModal from "../../components/Main/Users/EditUserModal";
import { AiOutlineEdit } from "react-icons/ai";
import { StateContext } from "../../contexts/StateProvider/StateProvider";
import { toast } from "react-hot-toast";
import DeleteUserModal from "../../components/Main/Users/DeleteUserModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import AddSupplier from "@/components/Main/Supplier/AddSupplier";
import EditSupplier from "@/components/Main/Supplier/EditSupplier";
import DeleteSupplier from "@/components/Main/Supplier/DeleteSupplier";

const SupplierPage = () => {
  const { userInfo, suppliers, refetchSuppliers } = useContext(StateContext);
  console.log(userInfo);

  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const formatTimestamp = (timestamp) => {
    // i want the time stamp to output in this format
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex w-full items-center justify-between">
        <p>Suppliers</p>
        <button
          onClick={() => setIsAddModalOpen(!isAddModalOpen)}
          className="btn-primary btn"
        >
          Add Supplier
        </button>
      </div>
      <hr />

      <div className="space-y-5">
        <AddSupplier
          setIsAddModalOpen={setIsAddModalOpen}
          isAddModalOpen={isAddModalOpen}
          refetch={refetchSuppliers}
        />
        <EditSupplier
          setIsEditModalOpen={setIsEditModalOpen}
          isEditModalOpen={isEditModalOpen}
          selectedSupplier={selectedSupplier}
          refetch={refetchSuppliers}
        />
        <DeleteSupplier
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          selectedSupplier={selectedSupplier}
          refetch={refetchSuppliers}
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

        <div className="h-full bg-white">
          <table className="table h-full bg-white ">
            <thead>
              <tr>
                <th className="w-5"></th>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {suppliers?.map((supplier, index) => (
                <tr key={index}>
                  <th className="w-5">{index + 1}</th>

                  <td>{supplier?.name}</td>
                  <td>{supplier?.phone}</td>
                  <td>{supplier?.address}</td>
                  <td>
                    {supplier?.status ? (
                      <button className="badge badge-success"></button>
                    ) : (
                      <button className="badge badge-error"></button>
                    )}
                  </td>
                  <td>{formatTimestamp(supplier?.timestamp)}</td>
                  <td></td>
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
                              if (isAdmin) {
                                setIsDeleteModalOpen(!isDeleteModalOpen);
                                setSelectedSupplier(supplier);
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
                                setSelectedSupplier(supplier);
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
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplierPage;
