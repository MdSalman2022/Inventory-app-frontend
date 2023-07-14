import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import EditUserModal from "../../components/Main/Users/EditUserModal";
import { AiOutlineEdit } from "react-icons/ai";
import { StateContext } from "../../contexts/StateProvider/StateProvider";
import { toast } from "react-hot-toast";
import DeleteUserModal from "../../components/Main/Users/DeleteUserModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";

const Users = () => {
  const { userInfo } = useContext(StateContext);
  console.log(userInfo);
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery("customers", async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/user/get-users`,
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
  const [selectedUser, setSelectedUser] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const formatTimestamp = (timestamp) => {
    // i want the time stamp to output in this format
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="space-y-5">
      <p>Users</p>
      <hr />

      <div className="space-y-5">
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

        <div className="h-full overflow-x-auto bg-white">
          <table className="table h-full bg-white">
            {/* head */}
            <thead>
              <tr>
                <th className="w-5"></th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
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
