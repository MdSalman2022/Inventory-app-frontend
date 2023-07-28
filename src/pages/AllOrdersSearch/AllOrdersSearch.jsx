import { StateContext } from "@/contexts/StateProvider/StateProvider";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { GrDeliver } from "react-icons/gr";
import { RiArrowGoBackLine } from "react-icons/ri";
import { TbFileInvoice } from "react-icons/tb";
import { useLocation, useParams } from "react-router-dom";

const AllOrdersSearch = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get("search");
  const { searchOrder, setSearchOrder } = useContext(StateContext);

  const { userInfo, selectedOrders, setSelectedOrders } =
    useContext(StateContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});
  console.log(isEditModalOpen);
  console.log(selectedOrder);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSelectedOrders([]);
  }, []);

  console.log("search orders", searchOrder);

  return (
    <div>
      <p>Search result for: {searchParam}</p>

      <div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead className="bg-primary text-white">
              <tr>
                <td className="w-5">
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    onClick={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(searchOrder);
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                    checked={selectedOrders?.length === searchOrder?.length}
                    className="checkbox border border-white"
                  />
                </td>
                <th className="w-10">#</th>
                <th className="w-10">Invoice</th>
                <th className="w-96">Name</th>
                <th className="w-96">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {searchOrder?.map((order, index) => (
                <tr key={index}>
                  <td className="w-5">
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      checked={selectedOrders.includes(order)}
                      onClick={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders([...selectedOrders, order]);
                        } else {
                          setSelectedOrders(
                            selectedOrders.filter(
                              (selectedOrder) => selectedOrder._id !== order._id
                            )
                          );
                        }
                      }}
                      className="checkbox border border-black"
                    />
                  </td>
                  <td className="w-10">{index + 1}</td>
                  <td>
                    <span
                      onClick={() => {
                        setIsModalOpen(!isModalOpen);
                        setSelectedOrder(order);
                      }}
                      className="cursor-pointer p-1 text-2xl text-success"
                    >
                      <TbFileInvoice />
                    </span>
                  </td>
                  <td className="flex w-96 flex-col gap-1">
                    <div className="flex items-center space-x-3">
                      {/* <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src={order?.image || avatarIcon}
                            alt="image"
                            className="rounded-full border-2 border-primary p-1"
                          />
                        </div>
                      </div> */}
                      <div>
                        <div className="font-bold">{order.name}</div>
                        <div className="text-sm opacity-50">
                          {order.address}
                        </div>
                        {order?.courierStatus === "sent" && (
                          <div className="text-sm opacity-50">
                            ConsignmentID:{" "}
                            {order.courierInfo?.consignment?.consignment_id}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsEditModalOpen(!isEditModalOpen);
                        }}
                        className="cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-neutral"
                      >
                        <AiOutlineEdit />
                      </span>
                      <span
                        onClick={() => {
                          handleOrderStatus(order._id, "completed");
                        }}
                        className="tooltip cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-info"
                        data-tip="Complete"
                      >
                        <FaCheck className="text-lg" />
                      </span>
                      {(!order?.courierStatus ||
                        order?.courierStatus === "returned") && (
                        <span
                          onClick={() => {
                            sendToCourier(order);
                          }}
                          className="tooltip cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-info"
                          data-tip={`Send to ${order?.courier} `}
                        >
                          <GrDeliver className="text-lg" />
                        </span>
                      )}
                      <span
                        onClick={() => {
                          handleOrderStatus(order._id, "processing");
                        }}
                        className="tooltip cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-error"
                        data-tip="Back to Processing"
                      >
                        <RiArrowGoBackLine className="text-lg" />
                      </span>
                      <span
                        onClick={() => {
                          handleOrderStatus(order._id, "cancelled");
                        }}
                        className="tooltip cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-error"
                        data-tip="Cancel Order"
                      >
                        <FcCancel className="text-lg" />
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
                  <td className="w-96">
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
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllOrdersSearch;
