import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CustomerProfile = () => {
  const { id } = useParams();
  const {
    data: customer,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery("customer", async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/customer/get-customer-by-id?id=${id}`,
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

    return response.json().then((data) => data.customer);
  });
  const { data: orders } = useQuery("orders", async () => {
    const response = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/order/get-orders-by-customer?id=${id}`,
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

    return response.json().then((data) => data);
  });

  console.log("customer", customer);
  console.log("orders", orders);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(date);

    return formattedDate;
  };

  return (
    <div className="mt-5 w-screen space-y-3 p-3 md:w-full md:space-y-4 md:p-0">
      <div className="grid-cols-4 gap-5 space-y-3 md:grid">
        <div>
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="font-bold">{customer?.customer_details?.name}</p>
            <p>{customer?.customer_details?.phone}</p>
            <p className="text-xs">{customer?.customer_details?.location}</p>
            <p className="text-xs">{customer?.customer_details?.address}</p>
            <p className="text-xs">
              Total Purchase: {customer?.purchase?.total}
            </p>
            <p className="text-xs">
              Last Purchase Date:{" "}
              {/* {formatTimestamp(customer?.purchase?.last_purchase)} */}
            </p>
            <button className="btn-info btn w-full">Start Order</button>
          </div>
        </div>
        <div className="col-span-3">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="w-full rounded-t-lg border bg-base-100 p-3 text-start">
                Processing Orders: {orders?.processing?.length}
              </AccordionTrigger>
              <AccordionContent className="w-full border p-3 text-start">
                {orders?.processing?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders?.processing?.map((order, index) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell>{order?.orderId}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end">
                              <p className="badge badge-info">
                                {order?.courier}: {order?.deliveryCharge} Tk
                              </p>
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex items-center justify-center">
                    <p className="text-2xl text-gray-400">
                      No Processing Orders
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="w-full  border bg-base-100 p-3 text-start">
                Ready Orders: {orders?.ready?.length}
              </AccordionTrigger>
              <AccordionContent className="w-full border p-3 text-start">
                {orders?.ready?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders?.ready?.map((order, index) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell>{order?.orderId}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end">
                              <p className="badge badge-info">
                                {order?.courier}: {order?.deliveryCharge} Tk
                              </p>
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex items-center justify-center">
                    <p className="text-2xl text-gray-400">No Ready Orders</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="w-full  border bg-base-100 p-3 text-start">
                Completed Orders: {orders?.completed?.length}
              </AccordionTrigger>
              <AccordionContent className="w-full border p-3 text-start">
                {orders?.completed?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders?.completed?.map((order, index) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell>{order?.orderId}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end">
                              <p className="badge badge-info">
                                {order?.courier}: {order?.deliveryCharge} Tk
                              </p>
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex items-center justify-center">
                    <p className="text-2xl text-gray-400">
                      No Completed Orders
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="w-full  border bg-base-100 p-3 text-start">
                Returned Orders: {orders?.returned?.length}
              </AccordionTrigger>
              <AccordionContent className="w-full border p-3 text-start">
                {orders?.returned?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders?.returned?.map((order, index) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell>{order?.orderId}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end">
                              <p className="badge badge-info">
                                {order?.courier}: {order?.deliveryCharge} Tk
                              </p>
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex items-center justify-center">
                    <p className="text-2xl text-gray-400">No Returned Orders</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
