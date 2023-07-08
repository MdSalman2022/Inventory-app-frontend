import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { RiArrowGoBackLine, RiDeleteBin6Line } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import InvoiceGenerator from "../../components/Main/shared/InvoiceGenerator/InvoiceGenerator";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import { useQuery } from "react-query";
import { TbFileInvoice } from "react-icons/tb";
import { toast } from "react-hot-toast";
import avatarIcon from "../../assets/shared/avatar.png";

const CourierPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});

  console.log(selectedOrder);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { name } = useParams();

  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(["orders", name], async () => {
    // Fetch data based on the updated name
    const response = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/order/get-orders?courier=${name}&filter=ready`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    return response.json().then((data) => data.orders);
  });

  console.log("orders for courier ", orders, name);

  const SumOfTotalPrice = orders?.reduce((acc, order) => acc + order.total, 0);

  const SumOfTotalDC = orders?.reduce(
    (acc, order) => acc + order.deliveryCharge,
    0
  );

  const SumOfTotalAdvance = orders?.reduce(
    (acc, order) => acc + order.advance,
    0
  );

  const SumOfTotalCOD = orders?.reduce((acc, order) => acc + order.cash, 0);

  console.log(orders);
  const handleExportClick = () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/order/order-export`, {
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
        link.download = "exported_orders.csv";

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

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-GB");
    return formattedDate;
  }

  console.log(selectedOrder);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between border-b py-3">
        <div>
          <p className="text-xl font-semibold">{name} Ready Orders</p>
          <p>Total Parcels: {orders?.length || 0.0}</p>
          <p>Total Sales: ৳{SumOfTotalPrice || 0.0}</p>
          <p>Total DC: ৳{SumOfTotalDC || 0.0}</p>
          <p>Total COD: ৳{SumOfTotalCOD || 0.0}</p>
          <p>Total Advance: ৳{SumOfTotalAdvance || 0.0}</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="btn-primary btn-outline btn">
            Advance Search
          </button>
          <Link to="import-csv" className="btn-primary btn-outline btn">
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
                <th>Prods/Pics</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {orders?.map((order, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <span
                      onClick={() => {
                        setIsModalOpen(!isModalOpen);
                        setSelectedOrder(order);
                      }}
                      className="p-1 text-2xl text-success"
                    >
                      <ModalBox
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                      >
                        <InvoiceGenerator order={selectedOrder} />
                      </ModalBox>
                      <p className="text-sm text-blue-500">
                        {formatDate(order?.timestamp)}
                      </p>
                      <p className="text-xs text-blue-500">Created By Admin</p>
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
                        <div className="text-sm opacity-50">{order?.phone}</div>
                        <div className="text-sm opacity-50">
                          {order?.address}
                        </div>
                        <div className="text-sm opacity-50">
                          {order?.district}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        onClick={() => {
                          setIsModalOpen(!isModalOpen);
                          setSelectedOrder(order);
                        }}
                        className="rounded-full border border-gray-500 p-1 text-2xl text-success"
                      >
                        <TbFileInvoice />
                      </span>
                      <span
                        onClick={() => {
                          handleOrderStatus(order._id, "processing");
                        }}
                        className="tooltip rounded-full border border-gray-500 p-1 text-2xl text-error"
                        data-tip="Back to Processing"
                      >
                        <RiArrowGoBackLine className="text-lg" />
                      </span>
                      <div
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setSelectedOrder(order);
                        }}
                        className="tooltip rounded-full border border-error p-1 text-2xl text-error"
                        data-tip="Delete order"
                      >
                        <RiDeleteBin6Line />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="avatar-group -space-x-6">
                      {order?.products?.map((product) => (
                        <div key={product._id} className="avatar">
                          <div className="w-12">
                            <img src={product?.image} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <p className="badge badge-info">
                        {order?.courier}: {order?.deliveryCharge}
                      </p>
                      <p>Quantity: {order?.quantity}</p>
                      <p className="">Price: {order?.total}</p>
                      <p className="">
                        Total Bill:{" "}
                        {parseInt(order?.total) +
                          parseInt(order?.deliveryCharge)}
                      </p>
                      <p className="">Advance: {order?.advance}</p>
                      <p className="">COD: {order?.cash}</p>
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
                <th></th>
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

export default CourierPage;
