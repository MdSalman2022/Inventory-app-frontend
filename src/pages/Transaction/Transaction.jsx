import React, { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbCurrencyTaka } from "react-icons/tb";
import { useQuery } from "react-query";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import InvoiceGenerator from "../../components/Main/shared/InvoiceGenerator/InvoiceGenerator";

const Transaction = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery("orders", async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/get-orders/completed`,
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
    <div className="space-y-5">
      <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <InvoiceGenerator order={selectedOrder} />
      </ModalBox>
      <div className="flex justify-between">
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
        <select className="select-primary select w-full max-w-xs">
          <option disabled selected>
            Filter by Courier
          </option>
          <option value="All">All</option>
          <option value="Pathao">Pathao</option>
          <option value="RedX">RedX</option>
          <option value="Steadfast">Steadfast</option>
          <option value="Pidex">Pidex</option>
          <option value="eCourier">eCourier</option>
          <option value="PaperFly">PaperFly</option>
          <option value="Sundarban">Sundarban</option>
          <option value="SA Paribahan">SA Paribahan</option>
          <option value="Store Pickup">Store Pickup</option>
        </select>
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
          <p>entries</p>
        </div>
        <div className="flex items-center gap-2">
          <p>Search</p>
          <input type="text" className="input-bordered input" />
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl">
        <table className="table">
          {/* head */}
          <thead className="rounded-lg bg-primary text-white">
            <tr>
              <th className="w-5"></th>
              <th className="w-5">#</th>
              <th>Date</th>
              <th>Info</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {orders?.map((order, index) => (
              <tr key={index}>
                <th>
                  <span className="bg-white">
                    <RiDeleteBin6Line className="rounded-full border border-primary p-2 text-4xl text-red-500" />
                  </span>
                </th>
                <th>{index + 1}</th>
                <td>{formatStockDate(order.timestamp)} </td>
                <td>
                  <div className="flex flex-col">
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
  );
};

export default Transaction;
