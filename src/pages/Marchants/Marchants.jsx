import AddUserModal from "@/components/Main/Users/AddUserModal";
import DeleteUserModal from "@/components/Main/Users/DeleteUserModal";
import EditUserModal from "@/components/Main/Users/EditUserModal";
import { StateContext } from "@/contexts/StateProvider/StateProvider";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { BsThreeDots } from "react-icons/bs";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

const Marchants = () => {
  const { userInfo } = useContext(StateContext);
  console.log(userInfo);
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(["users", userInfo], async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/user/get-sellers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch customers");
    }
    return response.json().then((data) => data?.users);
  });

  console.log("all users for this seller", users);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const formatTimestamp = (timestamp) => {
    // i want the time stamp to output in this format
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  const handleUpdateStatus = async (user, status) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/update-status?id=${user?._id}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ status: status }),
        }
      );
      const data = await response.json();
      console.log("data ", data);
      if (data?.success === true) {
        console.log("edit user", data);
        toast.success(`Successfully ${status ? "Activated" : "Deactivated"}`);
        refetch();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen space-y-3 p-3 md:w-full md:space-y-4 ">
      <div className="flex justify-between">
        <p className="text-xl font-bold">Marchants</p>
        {/* <button
          onClick={() => setIsAddModalOpen(!isAddModalOpen)}
          className="primary-btn btn"
        >
          Add User
        </button> */}
      </div>
      <hr />

      <div className="space-y-5">
        <AddUserModal
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
          refetch={refetch}
        />
        <EditUserModal
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          selectedUser={selectedUser}
          refetch={refetch}
        />
        <DeleteUserModal
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          selectedUser={selectedUser}
          refetch={refetch}
        />

        <div className="flex flex-col items-start justify-between border-b px-3 md:flex-row">
          <div className="flex items-center gap-2">
            <p>Show</p>
            <select
              name="page"
              id="page"
              className="input-bordered input my-2 p-2 "
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <form
            // onSubmit={SearchOrderById}
            className="hidden items-center gap-2 md:flex"
          >
            <p>Search</p>
            <input
              type="text"
              name="orderId"
              placeholder="Order Id"
              className="input-bordered input"
            />
          </form>
        </div>

        <div className="h-[70vh] overflow-auto bg-white">
          <table className="table-pin-rows table bg-white">
            {/* head */}
            <thead>
              <tr className="text-white">
                <th className="w-5 bg-primary"></th>
                <th className="bg-primary">Name</th>
                <th className="bg-primary">Email</th>
                <th className="bg-primary">Role</th>
                <th className="bg-primary">Status</th>
                <th className="bg-primary">Verified</th>
                <th className="bg-primary">Last Login</th>
                <th className="bg-primary">Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, index) => (
                <tr key={index}>
                  <th className="w-5">{index + 1}</th>

                  <td>
                    <Link
                      to={`seller/profile/${user?._id}`}
                      className="text-blue-600"
                    >
                      {user?.username}
                    </Link>
                  </td>
                  <td>{user?.email}</td>
                  <td>
                    <button className="badge badge-success">
                      {user?.role}
                    </button>
                  </td>
                  <td>
                    <div className="form-control w-full">
                      <label className="label cursor-pointer">
                        <input
                          type="checkbox"
                          className="toggle-success toggle"
                          name="status"
                          onChange={(e) => {
                            const isAdmin = userInfo?.role === "Admin";
                            if (isAdmin) {
                              handleUpdateStatus(user, e.target.checked);
                            } else {
                              toast.error(
                                "You are not authorized to edit user"
                              );
                            }
                          }}
                          checked={user?.status}
                        />
                      </label>
                    </div>
                  </td>
                  <td>
                    {user?.verified ? (
                      <button className="badge badge-success"></button>
                    ) : (
                      <button className="badge badge-error"></button>
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
                                setSelectedUser(user);
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
                                setSelectedUser(user);
                                setIsModalOpen(!isModalOpen);
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
      </div>
    </div>
  );
};

export default Marchants;
