import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useState, useEffect, useContext } from "react";
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
import { Link, useParams } from "react-router-dom";
import OrdersTable from "../SellerProfile/OrdersTable";
import { StateContext } from "@/contexts/StateProvider/StateProvider";

const CustomerProfile = () => {
  const { id } = useParams();
  const { userInfo, selectedOrders, setSelectedOrders } =
    useContext(StateContext);

  // const [selectedOrders, setSelectedOrders] = useState([]);
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

  const ordersCategory = [
    "All",
    "Processing Orders",
    "Ready Orders",
    "Completed Orders",
    "Returned Orders",
  ];

  console.log("orders", orders);

  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    if (selectedCategory === "All") {
      setSelectedOrders(orders?.orders);
    } else if (selectedCategory === "Processing Orders") {
      setSelectedOrders(orders.processing);
    } else if (selectedCategory === "Ready Orders") {
      setSelectedOrders(orders?.ready);
    } else if (selectedCategory === "Completed Orders") {
      setSelectedOrders(orders.completed);
    } else if (selectedCategory === "Returned Orders") {
      setSelectedOrders(orders?.returned);
    } else if (selectedCategory === "Cancelled Orders") {
      setSelectedOrders(orders?.cancelled);
    }
  }, [selectedCategory, userInfo, orders]);

  const handleExportClick = () => {
    const selectedOrdersIds = selectedOrders.map((order) => order._id);
    console.log("selectedOrdersIds", selectedOrdersIds);

    fetch(
      `${import.meta.env.VITE_SERVER_URL}/order/order-export?sellerId=${
        userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
      }&orderIds=${selectedOrdersIds}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
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

  return (
    <div className="mt-5 w-screen space-y-3 p-3 md:w-full md:space-y-4 md:p-0">
      <div className="relative flex flex-col items-center gap-2 rounded-lg bg-gray-200 p-5 text-center">
        <div className="right-5 top-5 flex gap-3 md:absolute">
          {selectedOrders?.length > 0 && (
            <Link to="/invoice-generator">
              <button className="btn-primary btn-outline btn w-full md:w-52">
                Print Selected
              </button>
            </Link>
          )}
          <button
            onClick={() => handleExportClick()}
            className="btn-primary btn"
          >
            Download
          </button>
        </div>
        <div className="flex w-full flex-col items-center">
          <p className="text-xl">
            <span className="font-semibold">Store Name:</span>{" "}
            {customer?.customer_details?.name}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Phone:</span>{" "}
            {customer?.customer_details?.phone}
          </p>
          <div>
            <span className="font-semibold">Location:</span>{" "}
            {customer?.customer_details?.location}
          </div>
          <div>
            <span className="font-semibold">Address:</span>{" "}
            {customer?.customer_details?.address}
          </div>
          <div className="">
            <span className="font-semibold">Total Purchase:</span>{" "}
            {customer?.purchase?.total}
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-5 md:flex-row">
          {ordersCategory?.map((category, index) => (
            <span
              onClick={() => setSelectedCategory(category)}
              className={`w-full rounded-lg px-3 py-2 font-semibold transition-all duration-300 hover:bg-gray-400 ${
                category === selectedCategory ? "bg-gray-400" : "bg-gray-300 "
              }
                      cursor-pointer
                      `}
              key={index}
            >
              {category}
            </span>
          ))}
        </div>
        <div className="w-full">
          {
            <OrdersTable
              orders={
                selectedCategory === "Processing Orders"
                  ? orders?.processing
                  : selectedCategory === "Ready Orders"
                  ? orders?.ready
                  : selectedCategory === "Completed Orders"
                  ? orders?.completed
                  : selectedCategory === "Returned Orders"
                  ? orders?.returned
                  : orders?.orders
              }
              setSelectedOrders={setSelectedOrders}
              selectedOrders={selectedOrders}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
