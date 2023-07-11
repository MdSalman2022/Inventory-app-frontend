import React, { useState } from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { toast } from "react-hot-toast";

const EditUserModal = ({
  isModalOpen,
  setIsModalOpen,
  selectedUser,
  refetch,
}) => {
  const handleEditUser = (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const role = form.role.value;
    const user = {
      username: name,
      email,
      role,
    };
    console.log("edit modal", user);
    updateUser(user);
  };
  const updateUser = (user) => {
    console.log(user);
    fetch(
      `${import.meta.env.VITE_SERVER_URL}/user/edit-user?id=${
        selectedUser?.authUid
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
          setIsModalOpen(false);
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  if (selectedUser && isModalOpen)
    return (
      <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <div className="bg-white">
          <form
            onSubmit={handleEditUser}
            className="flex w-80 flex-col gap-5 p-5"
          >
            <label className="w-full space-y-2">
              <p className="font-semibold">Username</p>
              <input
                className="input-bordered input w-full"
                type="text"
                name="name"
                placeholder="Username"
                defaultValue={selectedUser?.username}
              />
            </label>
            <label className="w-full space-y-2">
              <p className="font-semibold">Email</p>
              <input
                className="input-bordered input w-full"
                type="text"
                name="email"
                placeholder="Email"
                defaultValue={selectedUser?.email}
              />
            </label>
            <label className="w-full space-y-2">
              <p className="font-semibold">Role</p>
              <select
                name="role"
                className="select-bordered select select-sm w-full max-w-xs"
                defaultValue={selectedUser?.role}
              >
                <option>Admin</option>
                <option>Moderator</option>
              </select>
            </label>

            <div className="flex w-full justify-between">
              <button
                onClick={() => setIsModalOpen(!isModalOpen)}
                type="button"
                className="btn-error btn-outline btn"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary btn">
                Update
              </button>
            </div>
          </form>
        </div>
      </ModalBox>
    );
};

export default EditUserModal;
