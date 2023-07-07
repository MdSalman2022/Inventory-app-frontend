import React, { useEffect, useState } from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import avatarIcon from "../../../assets/shared/avatar.png";

const DeleteOrderModal = ({
  setIsDeleteModalOpen,
  isDeleteModalOpen,
  selectedOrder,
  refetch,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(selectedOrder);

  useEffect(() => {
    setIsModalOpen(isDeleteModalOpen);
  }, [isDeleteModalOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      setIsDeleteModalOpen(isModalOpen);
    }
  }, [isModalOpen]);

  const handleDeleteOrder = (id) => {
    const updateProducts = {
      productIds: selectedOrder?.products.map((product) => product._id),
      availableQtyIncrements: selectedOrder?.products.map((product) =>
        parseInt(product.quantity)
      ),
    };
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/delete-order/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data);
          toast.success("Customer deleted successfully");
          fetch(`${import.meta.env.VITE_SERVER_URL}/api/put-edit-products`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateProducts),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                toast.success("Products updated successfully");
                console.log(data);
              } else {
                toast.error("Something went wrong");
              }
            })
            .catch((err) => {
              console.log(err);
            });

          refetch();
          setIsModalOpen(false);
        } else {
          toast.error("Something went wrong");
        }
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
              Delete Customer
            </p>
            <div className="flex w-full flex-col gap-10 bg-white p-5">
              <p className="text-2xl">
                Are you sure you want to delete this customer?
              </p>
              <div className="flex justify-center gap-5">
                <img
                  className="h-10 w-10"
                  src={selectedOrder?.image || avatarIcon}
                  alt=""
                />
                <p className="text-2xl">{selectedOrder?.name}</p>
              </div>
              <div className="flex justify-between">
                <button className="btn-error btn-outline btn">Cancel</button>
                <button
                  onClick={() => handleDeleteOrder(selectedOrder?._id)}
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

export default DeleteOrderModal;
