import React, { useEffect, useState } from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import avatarIcon from "../../../assets/shared/avatar.png";

const DeleteProductModal = ({
  setIsDeleteModalOpen,
  isDeleteModalOpen,
  selectedProduct,
  refetch,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(isDeleteModalOpen);
  }, [isDeleteModalOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      setIsDeleteModalOpen(isModalOpen);
    }
  }, [isModalOpen]);

  const handleDeleteProduct = (id) => {
    fetch(
      `${import.meta.env.VITE_SERVER_URL}/product/delete-product?id=${id}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        toast.success("Customer deleted successfully");
        refetch();
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div>
        <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <div className="bg-base-100">
            <p className="w-full p-3 text-xl font-semibold shadow">
              Delete Product
            </p>
            <div className="flex w-full flex-col gap-10 bg-white p-5">
              <p className="text-2xl">
                Are you sure you want to delete this customer?
              </p>
              <div className="flex justify-center gap-5">
                <img
                  className="h-10 w-10"
                  src={selectedProduct?.image || avatarIcon}
                  alt=""
                />
                <p className="text-2xl">{selectedProduct?.name}</p>
              </div>
              <div className="flex justify-between">
                <button className="btn-error btn-outline btn">Cancel</button>
                <button
                  onClick={() => handleDeleteProduct(selectedProduct?._id)}
                  className="btn-error btn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </ModalBox>
      </div>
    </div>
  );
};

export default DeleteProductModal;
