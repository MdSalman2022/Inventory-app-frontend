import React from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { toast } from "react-hot-toast";

const DeleteUserModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedUser,
  refetch,
}) => {
  const handleDeleteCustomer = (id) => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/user/delete-user?id=${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        toast.success("User deleted successfully");
        refetch();
        setIsDeleteModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ModalBox
      isModalOpen={isDeleteModalOpen}
      setIsModalOpen={setIsDeleteModalOpen}
    >
      <div className="space-y-5 bg-white p-8">
        <div className="text-semibold flex flex-col items-center text-2xl">
          <p className="">Are you sure to delete this user?</p>
          <p className="font-bold">Username: {selectedUser?.username}</p>
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="btn-error btn-outline btn"
          >
            No
          </button>
          <button
            onClick={() => {
              setIsDeleteModalOpen(false);
              handleDeleteCustomer(selectedUser?._id);
            }}
            className="btn-success btn"
          >
            Yes
          </button>
        </div>
      </div>
    </ModalBox>
  );
};

export default DeleteUserModal;
