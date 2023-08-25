import { StateContext } from "@/contexts/StateProvider/StateProvider";
import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import profile from "../../assets/profile.webp";
import OrdersTable from "./OrdersTable";

const SellerProfile = () => {
  const { userInfo } = useContext(StateContext);
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedOrders, setSelectedOrders] = useState([]);

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

  // console.log("orders ", orders);

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

  console.log("stores", stores);
  console.log("orders", orders);
  console.log("seller", seller);

  const ordersByStore = stores?.map((store) => {
    return orders?.filter((order) => order?.storeId === store?.storeId);
  });

  const productsByStore = stores?.map((store) => {
    return products?.filter((product) => product?.storeId === store?.storeId);
  });

  console.log("prd", products);
  console.log("products by store", productsByStore);

  console.log("ordersByStore", ordersByStore);

  const ordersCategory = [
    "All",
    "Processing Orders",
    "Ready Orders",
    "Completed Orders",
    "Returned Orders",
  ];

  useEffect(() => {
    if (selectedCategory === "All") {
      setSelectedOrders(orders);
    } else if (selectedCategory === "Processing Orders") {
      setSelectedOrders(processingOrders);
    } else if (selectedCategory === "Ready Orders") {
      setSelectedOrders(readyOrders);
    } else if (selectedCategory === "Completed Orders") {
      setSelectedOrders(completedOrders);
    } else if (selectedCategory === "Returned Orders") {
      setSelectedOrders(returnedOrders);
    } else if (selectedCategory === "Cancelled Orders") {
      setSelectedOrders(cancelledOrders);
    }
  }, [selectedCategory, userInfo, orders]);

  console.log("selected ", selectedOrders);

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
    <div>
      <div className="w-screen p-3 md:w-full md:space-y-4 md:py-5">
        {/* <div>
          <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-5 text-center shadow-lg">
            <img
              className="h-32 w-32 rounded-full object-contain"
              src={profile}
              alt=""
            />
            <p className="">
              <span className="font-semibold">Name:</span> {seller?.username}
            </p>
            <p>
              {" "}
              <span className="font-semibold">Email:</span> {seller?.email}
            </p>
            <div className="grid w-60 grid-cols-2">
              <p className="text-start">
                {" "}
                <span className="font-semibold">Stores: </span>
                {stores?.length}{" "}
              </p>
              <p className="text-start">
                <span className="font-semibold">Products: </span>
                {products?.length}{" "}
              </p>
              <p className="text-start">
                <span className="font-semibold">Suppliers: </span>
                {suppliers?.length}
              </p>
              <p className="text-start">
                <span className="font-semibold">Employees: </span>
                {employees?.length}
              </p>
              <p className="text-start">
                {" "}
                <span className="font-semibold">Orders: </span>
                {orders?.length}
              </p>
            </div>
          </div>
        </div> */}
        <div className="col-span-3 w-full rounded-lg">
          <div className="flex flex-col gap-5">
            {stores?.length === 0 && (
              <div className="relative flex flex-col items-center gap-2 rounded-lg bg-gray-200 p-5 text-center">
                <button
                  onClick={() => handleExportClick()}
                  className="btn-primary btn absolute right-5 top-5"
                >
                  Download
                </button>
                <div className="flex w-full flex-col items-center">
                  <p className="text-xl">
                    <span className="font-semibold">Store Name:</span>{" "}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Email:</span>{" "}
                    {seller?.email}
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <p>Number Of Products: 0</p>
                  <p>Number Of Orders: 0</p>
                </div>
                <div className="flex w-full items-center justify-between gap-5">
                  {ordersCategory?.map((category, index) => (
                    <span
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full rounded-lg px-3 py-2 font-semibold transition-all duration-300 hover:bg-gray-400 ${
                        category === selectedCategory
                          ? "bg-gray-400"
                          : "bg-gray-300 "
                      }
                      cursor-pointer
                      `}
                      key={index}
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <div className="w-full">No Orders</div>
              </div>
            )}
            {stores?.map((store, index) => {
              const ordersForCurrentStore = selectedOrders?.filter(
                (order) => order?.storeId === store?.storeId
              );
              return (
                <div
                  className="relative flex flex-col items-center gap-2 rounded-lg bg-gray-200 p-5 text-center"
                  key={index}
                >
                  <button
                    onClick={() => handleExportClick()}
                    className="btn-primary btn absolute right-5 top-5"
                  >
                    Download
                  </button>
                  <div className="flex w-full flex-col items-center">
                    <p className="text-xl">
                      <span className="font-semibold">Store Name:</span>{" "}
                      {store?.name}
                    </p>
                    <p className="text-lg">
                      <span className="font-semibold">Email:</span>{" "}
                      {seller?.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-5">
                    <p>
                      Number Of Products: {productsByStore[index]?.length || 0}
                    </p>
                    <p>Number Of Orders: {ordersByStore[index]?.length || 0}</p>
                  </div>
                  <div className="flex w-full items-center justify-between gap-5">
                    {ordersCategory?.map((category, index) => (
                      <span
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full rounded-lg px-3 py-2 font-semibold transition-all duration-300 hover:bg-gray-400 ${
                          category === selectedCategory
                            ? "bg-gray-400"
                            : "bg-gray-300 "
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
                    {<OrdersTable orders={ordersForCurrentStore} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
