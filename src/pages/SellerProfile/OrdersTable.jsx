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

const OrdersTable = ({ orders }) => {
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
    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      {orders?.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10px]">#</TableHead>
              <TableHead>Order Id</TableHead>
              <TableHead>Date</TableHead>
              <TableHead classNam="w-5">Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Customer Id</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="cursor-pointer ">
            {orders?.map((order, index) => (
              <TableRow key={order._id}>
                <TableCell className="text-left font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="text-left">{order?.orderId}</TableCell>
                <TableCell className="text-left">
                  {formatTimestamp(order?.timestamp)}
                </TableCell>
                <TableCell classNam="w-10 text-left">
                  {order?.products?.map((product, index) => {
                    return (
                      <p className="truncate text-left text-xs" key={index}>
                        {product?.name}
                      </p>
                    );
                  })}
                </TableCell>
                <TableCell className="text-left">
                  <span className="text-xl">৳</span> {order?.total}
                </TableCell>
                <TableCell className="text-left">{order?.name}</TableCell>
                <TableCell className="w-10 text-left">
                  {order?.customerId}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <p className="badge badge-info">
                      {order?.courier}: {order?.deliveryCharge} Tk
                    </p>
                    <div className="grid grid-cols-2 ">
                      <p>Quantity: {order?.quantity}</p>
                      <p className="">Price: {order?.total} Tk</p>
                      <p className="">
                        Total Bill:{" "}
                        {parseInt(order?.total) +
                          parseInt(order?.deliveryCharge)}{" "}
                        Tk
                      </p>
                      <p>Discount: {order?.discount} Tk</p>
                      <p className="">Advance: {order?.advance} Tk</p>
                      <p className="">COD: {order?.cash} Tk</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex items-center justify-center">
          <p className="text-2xl text-gray-400">No Orders</p>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
