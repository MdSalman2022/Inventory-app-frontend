import React, { useContext } from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import { StateContext } from "@/contexts/StateProvider/StateProvider";

const AddUserModal = ({ isAddModalOpen, setIsAddModalOpen, refetch }) => {
  const { userInfo } = useContext(StateContext);

  const handleAddUser = (event) => {
    event.preventDefault();
    const form = event.target;
    const username = form.name.value;
    const email = form.email.value;
    const role = form.role.value;
    const password = form.password.value;
    const status = form.status.check;
    const user = {
      username,
      email,
      password,
      status,
      role,
    };
    console.log("Add user modal", user);
    updateUser(user);
  };
  const updateUser = (user) => {
    console.log(user);
    fetch(
      `${import.meta.env.VITE_SERVER_URL}/employee/create-employee?sellerId=${
        userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
      }`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(user),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toast.success(`${user.name} is updated successfully`);
          refetch();
          setIsAddModalOpen(false);
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  return (
    <div>
      <ModalBox isModalOpen={isAddModalOpen} setIsModalOpen={setIsAddModalOpen}>
        <div className="w-80 bg-white md:w-96">
          <div className="border-b p-5 font-bold">
            <p>Add Employee</p>
          </div>
          <form
            onSubmit={handleAddUser}
            className="flex flex-col justify-center p-5"
          >
            <div className="flex flex-col items-center justify-center gap-5">
              <label className="w-full space-y-2">
                <p className="font-semibold">Username</p>
                <input
                  className="input-bordered input w-full"
                  type="text"
                  name="name"
                  placeholder="Username"
                />
              </label>
              <label className="w-full space-y-2">
                <p className="font-semibold">Email</p>
                <input
                  className="input-bordered input w-full"
                  type="text"
                  name="email"
                  placeholder="Email"
                />
              </label>
              <label className="w-full space-y-2">
                <p className="font-semibold">Password</p>
                <input
                  className="input-bordered input w-full"
                  type="password"
                  name="password"
                  placeholder="********"
                />
              </label>
              <label className="w-full space-y-2">
                <p className="font-semibold">Role</p>
                <select
                  name="role"
                  className="select-bordered select select-sm w-full max-w-xs"
                >
                  <option>Admin</option>
                  <option>Moderator</option>
                </select>
              </label>
              <div className="form-control w-full ">
                <label className="label cursor-pointer">
                  <span className="label-text font-bold">Status</span>
                  <input
                    type="checkbox"
                    className="toggle-primary toggle"
                    name="status"
                  />
                </label>
              </div>
            </div>
          </form>
        </div>
      </ModalBox>
    </div>
  );
};

export default AddUserModal;
