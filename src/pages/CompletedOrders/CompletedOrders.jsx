import React, { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineShoppingCart } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import EditCustomerModal from "../../components/Main/Customers/EditCustomerModal";
import avatarIcon from "../../assets/shared/avatar.png";
import DeleteCustomerModal from "../../components/Main/Customers/DeleteCustomerModal";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { RiArrowGoBackLine } from "react-icons/ri";

import { FaCheck } from "react-icons/fa";
import { TbFileInvoice } from "react-icons/tb";
import InvoiceGenerator from "../../components/Main/shared/InvoiceGenerator/InvoiceGenerator";

const CompletedOrders = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});

  console.log(isEditModalOpen);
  console.log(selectedOrder);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery("orders", async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/order/get-orders?filter=completed`,
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
    return response.json().then((data) => data.orders);
  });

  console.log(orders);

  const handleExportClick = () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/order-export`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement("a");
        link.href = url;
        link.download = "exported_data.csv";

        // Append the link to the document body
        document.body.appendChild(link);

        // Simulate a click on the link to trigger the download
        link.click();

        // Remove the link from the document body
        document.body.removeChild(link);

        // Release the temporary URL
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error exporting data:", error);
        // Handle error appropriately
      });
  };

  const handleOrderStatus = (id, status) => {
    fetch(
      `${import.meta.env.VITE_SERVER_URL}/order/edit-order-status?id=${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderStatus: status,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        refetch();
        toast.success("Order status updated successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to update order status");
      });
  };

  console.log(isModalOpen);

  return (
    <div className="space-y-4">
      <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <InvoiceGenerator order={selectedOrder} />
      </ModalBox>
      <div className="flex items-start justify-between border-b py-3">
        <div>
          <p className="text-xl font-semibold">Completed Orders</p>
          <p>Total Parcels: 1</p>
          <p>Total Sales: ৳0.00</p>
          <p>Total DC: ৳0.00</p>
          <p>Total COD: ৳0.00</p>
          <p>Total Advance: ৳0.00</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="btn-primary btn-outline btn">
            Advance Search
          </button>
          <Link
            to="/orders-processing/import-csv"
            className="btn-primary btn-outline btn"
          >
            Create Bulk Order
          </Link>
          <button
            onClick={handleExportClick}
            className="btn-primary btn-outline btn"
          >
            Export Orders
          </button>
          {/* Open the modal using ID.showModal() method */}

          {/* The button to open modal */}
        </div>
      </div>
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
          <input type="text" className="input-bordered input" />
        </div>
      </div>

      <div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead className="bg-primary text-white">
              <tr>
                <th>#</th>
                <th>Invoice</th>
                <th>Name</th>
                {/* <th>Prods/Pics</th> */}
                <th>Price</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {orders?.map((order, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {" "}
                    <span
                      onClick={() => {
                        setIsModalOpen(!isModalOpen);
                        setSelectedOrder(order);
                      }}
                      className="p-1 text-2xl text-success"
                    >
                      <TbFileInvoice />
                    </span>
                  </td>
                  <td className="flex flex-col gap-1">
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src={order?.image || avatarIcon}
                            alt="image"
                            className="rounded-full border-2 border-primary p-1"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{order.name}</div>
                        <div className="text-sm opacity-50">
                          {order.address}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        onClick={() => {
                          setIsModalOpen(!isModalOpen);
                          setSelectedOrder(order);
                        }}
                        className="p-1 text-2xl text-success"
                      >
                        <TbFileInvoice />
                      </span>
                      <span
                        onClick={() => {
                          handleOrderStatus(order._id, "returned");
                        }}
                        className="tooltip rounded-full border border-gray-500 p-1 text-2xl text-error"
                        data-tip="Order Return"
                      >
                        <RiArrowGoBackLine className="text-lg" />
                      </span>
                    </div>
                  </td>
                  {/* <td>
                    <div className="avatar-group -space-x-6">
                      {order.products?.map((product) => (
                        <div key={product._id} className="avatar">
                          <div className="w-12">
                            <img src={product?.image} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </td> */}
                  <td>
                    <div className="flex flex-col">
                      <p className="badge badge-info">
                        {order?.courier}: {order?.deliveryCharge}
                      </p>
                      <p>Quantity: {order?.quantity}</p>
                      <p className="">Price: {order?.total} Tk</p>
                      <p className="">Discount: {order?.discount} Tk</p>
                      <p className="">
                        Total Bill:{" "}
                        {parseInt(order?.total) +
                          parseInt(order?.deliveryCharge) -
                          order?.discount}
                        Tk
                      </p>
                      <p className="">Advance: {order?.advance} Tk</p>
                      <p className="">COD: {order?.cash} Tk</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-white">
              <tr>
                <th>Showing 1 to 2 of 2 entries</th>
                <th></th>
                <th></th>
                {/* <th></th> */}
                <th className="flex justify-end">
                  <div className="join">
                    <button className="join-item btn">Previous</button>
                    <button className="btn-primary join-item btn">1</button>
                    <button className="join-item btn ">Next</button>
                  </div>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompletedOrders;
