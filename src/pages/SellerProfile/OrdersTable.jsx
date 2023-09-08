import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const OrdersTable = ({ orders, selectedOrders, setSelectedOrders }) => {
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${hours % 12 || 12}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`;

    return (
      <div>
        <p>
          {month} {day}, {year}
        </p>
        <p>{formattedTime}</p>
      </div>
    );
  }

  console.log("orders table ", orders);
  return (
    <div>
      <div className="max-h-[600px] overflow-x-auto">
        <table className="table-pin-rows table-sm table">
          <thead>
            <tr className="bg-primary text-white">
              <th>
                <label>
                  <input type="checkbox" className="checkbox" checked={false} />
                </label>
              </th>
              <th>#</th>
              <th>Order Id</th>
              <th>Date</th>
              <th>Product</th>
              <th>Price</th>
              <th>Customer Name</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {orders?.length > 0 &&
              orders?.map((order, index) => (
                <tr key={index} className="odd:bg-gray-100">
                  <th>
                    <label>
                      <input
                        type="checkbox"
                        defaultChecked={false}
                        checked={selectedOrders?.includes(order)}
                        onClick={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders([...selectedOrders, order]);
                          } else {
                            setSelectedOrders(
                              selectedOrders?.filter(
                                (selectedOrder) =>
                                  selectedOrder._id !== order._id
                              )
                            );
                          }
                        }}
                        className="checkbox border border-black"
                      />
                      {/* <input type="checkbox" className="checkbox" /> */}
                    </label>
                  </th>
                  <th> {index + 1}</th>
                  <td>{order?.orderId}</td>
                  <td> {formatTimestamp(order?.timestamp)}</td>
                  <td>
                    {" "}
                    {order?.products?.map((product, index) => {
                      return (
                        <p className="truncate text-left text-xs" key={index}>
                          {product?.name}
                        </p>
                      );
                    })}
                  </td>
                  <td>{order?.total}</td>
                  <td>{order?.name}</td>
                  <td>{order?.phone}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {orders?.length < 1 && (
          <div className="flex w-full items-center justify-center">
            <p className="text-2xl text-gray-400">No Orders</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTable;
