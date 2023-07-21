import { StateContext } from "@/contexts/StateProvider/StateProvider";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
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

const SellerProfile = () => {
  const { userInfo } = useContext(StateContext);
  const { id } = useParams();

  const {
    data: seller,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery("seller", async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/user/get-seller?id=${id}`,
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

    return response.json().then((data) => data.user);
  });

  const { data: products } = useQuery(["products", userInfo], async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/product/get-products?sellerId=${id}`,
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
    return response.json().then((data) => {
      return data.products;
    });
  });

  const {
    data: stores,
    isLoading: storesIsLoading,
    isError: storesIsError,
    error: storesError,
    refetch: storesRefetch,
  } = useQuery(["stores", userInfo], async () => {
    const response = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/store/get-stores-by-owner-id?id=${id}`,
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
    return response.json().then((data) => data?.stores);
  });

  const {
    data: suppliers,
    isLoading: suppliersIsLoading,
    isError: suppliersIsError,
    error: suppliersError,
    refetch: refetchSuppliers,
  } = useQuery(["suppliers", userInfo], async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/supplier/get-supplier?sellerId=${id}`,
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
    return response.json().then((data) => data?.suppliers);
  });

  const { data: employees } = useQuery(["users", userInfo], async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/user/get-employees?sellerId=${id}`,
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
    return response.json().then((data) => data?.users);
  });

  const { data: orders } = useQuery(["orders", userInfo], async () => {
    const response = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/order/get-orders?sellerId=${id}&filter=all`,
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
    return response.json().then((data) => data?.orders);
  });

  console.log("orders ", orders);

  const processingOrders = orders?.filter(
    (order) => order?.orderStatus === "processing"
  );
  const readyOrders = orders?.filter((order) => order?.orderStatus === "ready");
  const completedOrders = orders?.filter(
    (order) => order?.orderStatus === "completed"
  );
  const returnedOrders = orders?.filter(
    (order) => order?.orderStatus === "returned"
  );
  const cancelledOrders = orders?.filter(
    (order) => order?.orderStatus === "cancelled"
  );

  return (
    <div>
      <div className="grid grid-cols-4 gap-5">
        <div>
          <div className="flex flex-col items-start gap-2 text-center">
            <p className="">
              <span className="font-semibold">Name:</span> {seller?.username}
            </p>
            <p>
              {" "}
              <span className="font-semibold">Email:</span> {seller?.email}
            </p>
            <p>
              {" "}
              <span className="font-semibold">Number of Stores: </span>
              {stores?.length}{" "}
            </p>
            <p>
              <span className="font-semibold">Number of Products: </span>
              {products?.length}{" "}
            </p>
            <p>
              <span className="font-semibold">Number of Suppliers: </span>
              {suppliers?.length}
            </p>
            <p>
              <span className="font-semibold">Number of Employees: </span>
              {employees?.length}
            </p>
            <p>
              {" "}
              <span className="font-semibold">Number of Orders: </span>
              {orders?.length}
            </p>
          </div>
        </div>
        <div className="col-span-3">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="w-full rounded-t-lg border bg-base-100 p-3 text-start">
                Processing Orders: {processingOrders?.length}
              </AccordionTrigger>
              <AccordionContent className="w-full border p-3 text-start">
                {processingOrders?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {processingOrders?.map((order, index) => (
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
                Ready Orders: {readyOrders?.length}
              </AccordionTrigger>
              <AccordionContent className="w-full border p-3 text-start">
                {readyOrders?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {readyOrders?.map((order, index) => (
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
                Completed Orders: {completedOrders?.length}
              </AccordionTrigger>
              <AccordionContent className="w-full border p-3 text-start">
                {completedOrders?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedOrders?.map((order, index) => (
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
                Returned Orders: {returnedOrders?.length}
              </AccordionTrigger>
              <AccordionContent className="w-full border p-3 text-start">
                {returnedOrders?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {returnedOrders?.map((order, index) => (
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

export default SellerProfile;
