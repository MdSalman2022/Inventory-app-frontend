import React, { useContext, useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbCurrencyTaka } from "react-icons/tb";
import { useQuery } from "react-query";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import InvoiceGenerator from "../../components/Main/shared/InvoiceGenerator/InvoiceGenerator";
import { StateContext } from "@/contexts/StateProvider/StateProvider";

const Transaction = () => {
  const { userInfo } = useContext(StateContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(["orders", userInfo], async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/order/get-orders?sellerId=${
        userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
      }&filter=completed`,
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

  function formatStockDate(isoTimestamp) {
    const date = new Date(isoTimestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });

    return formattedDate;
  }

  const total = orders?.reduce((acc, order) => {
    return acc + parseInt(order?.total);
  }, 0);

  const totalReceived = orders?.reduce((acc, order) => {
    return acc + parseInt(order?.advance);
  }, 0);

  const [selectedOrder, setSelectedOrder] = useState({});

  const totalPending = orders?.reduce((acc, order) => {
    return acc + parseInt(order?.cash);
  }, 0);

  return (
    <div className="w-screen space-y-3 p-3 md:w-full md:space-y-4">
      <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <InvoiceGenerator order={selectedOrder} />
      </ModalBox>
      <div className="mt-3 flex justify-between">
        <div>
          <p className="flex items-center gap-2 text-xl font-bold">
            {" "}
            <FaExchangeAlt className="text-sm" /> Transactions
          </p>
          <p className="flex">
            Total:{" "}
            <span className="flex items-center justify-center font-bold">
              {" "}
              <TbCurrencyTaka className="text-xl" />
              {total}
            </span>{" "}
          </p>
          <p className="flex gap-2">
            Total Received{" "}
            <span className=" flex items-center justify-center font-bold text-blue-600">
              <TbCurrencyTaka className="text-xl" />
              {totalReceived}
            </span>{" "}
            Total Pending{" "}
            <span className="flex items-center justify-center font-bold text-error">
              <TbCurrencyTaka className="text-xl" />
              {totalPending}
            </span>
          </p>
        </div>
      </div>
      <hr />
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <p>Show</p>
          <select name="page" id="page" className="input-bordered input p-2">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <form
          // onSubmit={SearchOrderById}
          className="hidden items-center gap-2 md:flex"
        >
          <p>Search</p>
          <input
            type="text"
            name="orderId"
            placeholder="Order Id"
            className="input-bordered input"
          />
        </form>
      </div>
      <div className="overflow-x-auto rounded-xl">
        <table className="table">
          {/* head */}
          <thead className="rounded-lg bg-primary text-white">
            <tr>
              <th className="w-5">#</th>
              <th>Date</th>
              <th>Info</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {orders?.map((order, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{formatStockDate(order.timestamp)} </td>
                <td>
                  <div className="flex w-44 flex-col">
                    <p>COD pending from {order.courier}</p>
                    <p>
                      Inv#:{" "}
                      <span
                        onClick={() => {
                          setIsModalOpen(!isModalOpen);
                          setSelectedOrder(order);
                        }}
                        className="font-bold text-blue-600"
                      >
                        {order.orderId}
                      </span>
                    </p>
                    <p>Payment received: {formatStockDate(order.timestamp)} </p>
                  </div>
                </td>
                <td>
                  <span className="flex items-center">
                    <TbCurrencyTaka className="text-xl" />
                    {order.total}
                  </span>{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transaction;
