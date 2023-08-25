import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import EditUserModal from "../../components/Main/Users/EditUserModal";
import { AiOutlineEdit } from "react-icons/ai";
import { StateContext } from "../../contexts/StateProvider/StateProvider";
import { toast } from "react-hot-toast";
import DeleteUserModal from "../../components/Main/Users/DeleteUserModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import AddUserModal from "@/components/Main/Users/AddUserModal";

const Users = () => {
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
      `${import.meta.env.VITE_SERVER_URL}/user/get-employees?sellerId=${
        userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
      }`,
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

  const formatTimestamp = (timestamp) => {
    // i want the time stamp to output in this format
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    <div className="w-screen p-3 md:w-full md:space-y-4">
      <div className="flex justify-between">
        <p className="text-xl font-bold">Employees</p>
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

        <div className="h-full overflow-x-auto bg-white">
          <table className="table h-full bg-white ">
            {/* head */}
            <thead>
              <tr>
                <th className="w-5"></th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Last Login</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, index) => (
                <tr key={index}>
                  <th className="w-5">{index + 1}</th>

                  <td>{user?.username}</td>
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

export default Users;
