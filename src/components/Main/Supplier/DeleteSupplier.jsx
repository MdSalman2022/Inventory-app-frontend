import React from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { toast } from "react-hot-toast";

const DeleteSupplier = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedSupplier,
  refetch,
}) => {
  const handleDeleteSupplier = () => {
    fetch(
      `${import.meta.env.VITE_SERVER_URL}/supplier/delete-supplier?id=${
        selectedSupplier?._id
      }`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data?.result) {
          toast.success("Supplier Deleted successfully");
          setIsDeleteModalOpen(!isDeleteModalOpen);
          refetch();
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to add supplier");
      });
  };

  return (
    <div>
      <ModalBox
        isModalOpen={isDeleteModalOpen}
        setIsModalOpen={setIsDeleteModalOpen}
      >
        <div className="w-80 bg-white md:w-full">
          <p className="border-b p-5 font-bold">Supplier Delete</p>
          <div className="space-y-5 p-5">
            <div className="text-center">
              <p className="md:text-2xl">
                Are you sure you want to delete this supplier?
              </p>
              <p className="font-bold">
                Supplier Name: {selectedSupplier?.name}
              </p>
            </div>

            <div className="flex justify-between">
              <button type="button" className="btn-error btn-outline btn">
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSupplier()}
                type="submit"
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

export default DeleteSupplier;
