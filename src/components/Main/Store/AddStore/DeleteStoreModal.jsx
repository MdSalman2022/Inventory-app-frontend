import React from "react";
import ModalBox from "../../shared/Modals/ModalBox";
import { toast } from "react-hot-toast";

const DeleteStoreModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedStore,
  refetch,
}) => {
  const handleDeleteStore = (id) => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/store/delete-store?id=${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        toast.success("Store deleted successfully");
        refetch();
        setIsDeleteModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <ModalBox
        isModalOpen={isDeleteModalOpen}
        setIsModalOpen={setIsDeleteModalOpen}
      >
        <div className="flex flex-col items-center space-y-5 bg-white p-5">
          <div className="flex flex-col items-center space-y-5 px-5 text-xl font-bold">
            <p>Are you sure you want to delete this store?</p>
            <p>Store name: {selectedStore?.name}</p>
            <div className="flex w-full justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn-error btn-outline btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={() => handleDeleteStore(selectedStore?._id)}
                className="btn-error btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </ModalBox>
    </div>
  );
};

export default DeleteStoreModal;
