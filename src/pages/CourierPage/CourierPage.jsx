import React, { useContext, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { RiArrowGoBackLine, RiDeleteBin6Line } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import InvoiceGenerator from "../../components/Main/shared/InvoiceGenerator/InvoiceGenerator";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import { useQuery } from "react-query";
import { TbFileInvoice } from "react-icons/tb";
import { toast } from "react-hot-toast";
import avatarIcon from "../../assets/shared/avatar.png";
import { StateContext } from "@/contexts/StateProvider/StateProvider";
import SingleInvoiceGenerator from "@/components/Main/shared/InvoiceGenerator/SingleInvoiceGenerator";
import { BsThreeDots } from "react-icons/bs";
const CourierPage = () => {
  const { userInfo, selectedOrders, setSelectedOrders } =
    useContext(StateContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { name } = useParams();

  useEffect(() => {
    setSelectedOrders([]);
  }, []);

  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(["orders", userInfo, name], async () => {
    // Fetch data based on the updated name
    const response = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/order/get-orders?courier=${name}&sellerId=${
        userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
      }&filter=ready&courierStatus=sent`,
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

  const allOrdersInvoice = orders?.map((order) => order.orderId);
  console.log("all orders invoice ", allOrdersInvoice);

  const [ordersStatus, setOrdersStatus] = useState([]);

  const fetchCouriers = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/courier/get-couriers?sellerId=${
        userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
      }`
    );
    const data = await res.json();
    return data.couriers;
  };

  const { data: couriers } = useQuery("couriers", fetchCouriers);

  //find the courier info with regex
  const steadFastCourier = couriers?.find((courier) =>
    /steadfast/i.test(courier.name)
  );

  console.log("steadfast ", steadFastCourier);

  const fetchOrderStatusByInvoice = async (orderId) => {
    const response = await fetch(
      `${import.meta.env.VITE_STEADFAST_BASE_URL}/status_by_invoice/${orderId}`,
      {
        method: "GET",
        headers: {
          "Api-Key": steadFastCourier?.api,
          "Secret-Key": steadFastCourier?.secret,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch order with orderId: ${orderId}`);
    }

    return response.json();
  };

  const { data = [], isLoading: isStatusLoading } = useQuery(
    ["ordersStatus", orders],
    async () => {
      // Create an array of promises for each orderId in allOrdersInvoice
      const fetchPromises = allOrdersInvoice.map((orderId) =>
        fetchOrderStatusByInvoice(orderId)
      );

      // Wait for all the promises to resolve using Promise.all()
      try {
        const responseData = await Promise.all(fetchPromises);
        console.log("All order statuses: ", responseData);
        setOrdersStatus(responseData);
        // Do something with the responseData here
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    }
  );

  console.log("order status ", ordersStatus);

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

  const handleOrderStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/order/edit-order-info?id=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderStatus: status,
            courierStatus: "returned",
            courierInfo: {},
          }),
        }
      );

      if (response.ok) {
        const resultFromDB = await response.json();
        console.log("order info", resultFromDB);
        refetch();
      } else {
        throw new Error("Failed to save courier data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save courier data");
    }
  };

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-GB");
    return formattedDate;
  }

  console.log(selectedOrder);

  return (
    <div className="w-screen space-y-3 p-3 md:w-full">
      <div className="mt-3 flex flex-col items-start justify-between border-b md:flex-row">
        <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <div>
            <SingleInvoiceGenerator order={selectedOrder} />
          </div>
        </ModalBox>
        <div>
          <p className="text-xl font-semibold">{name} Ready Orders</p>
          <p>Total Parcels: {orders?.length || 0.0}</p>
          <p>Total Sales: ৳{SumOfTotalPrice || 0.0}</p>
          <p>Total DC: ৳{SumOfTotalDC || 0.0}</p>
          <p>Total COD: ৳{SumOfTotalCOD || 0.0}</p>
          <p>Total Advance: ৳{SumOfTotalAdvance || 0.0}</p>
        </div>
        <div className="mt-3 flex w-full flex-col gap-3 md:mt-0 md:w-auto md:flex-row md:gap-5">
          {selectedOrders?.length > 0 && (
            <Link to="/invoice-generator">
              <button className="btn-primary btn-outline btn">
                Print Selected
              </button>
            </Link>
          )}
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
        <div className="my-2 flex items-center gap-2">
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
      <div>
        <div className="overflow-x-auto">
          <table className="table-pin-rows table-pin-cols table ">
            {/* head */}
            <thead className="">
              <tr>
                <td className="w-5 bg-primary text-white">
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    onClick={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(orders);
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                    checked={selectedOrders?.length === orders?.length}
                    className="checkbox border border-white"
                  />
                </td>
                <th className="w-10 bg-primary text-white">#</th>
                <th className="w-10 bg-primary text-white">Invoice</th>
                <th className="w-96 bg-primary text-white">Name</th>
                <th className="w-10 bg-primary text-white">Status</th>
                <th className="w-96 bg-primary text-white">Price</th>
                <th className="w-96 bg-primary text-white">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {orders?.map((order, index) => (
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
                      <p className="text-sm text-blue-500">
                        {formatDate(order?.timestamp)}
                      </p>
                      <p className="cursor text-xs text-blue-500">
                        Created By {userInfo?.username} ({userInfo?.role})
                      </p>
                    </span>
                  </td>
                  <td className="flex flex-col gap-1">
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
                        <div className="text-sm opacity-50">{order?.phone}</div>
                        <div className="text-sm opacity-50">
                          {order?.address}
                        </div>
                        <div className="text-sm opacity-50">
                          {order?.district}
                        </div>
                        <div className="text-sm opacity-50">
                          ConsignmentId:{" "}
                          {order.courierInfo?.consignment?.consignment_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {isStatusLoading
                      ? "...Loading"
                      : ordersStatus[index]?.delivery_status}
                  </td>
                  <td>
                    <div className="flex w-32 flex-col">
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
                  <td>
                    <div className="dropdown-left dropdown">
                      <label tabIndex={0} className="btn-sm btn m-1">
                        <BsThreeDots size={18} />
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu rounded-box z-[1] w-40 gap-1  bg-base-100 shadow"
                      >
                        <li
                          onClick={() => {
                            setIsModalOpen(!isModalOpen);
                            setSelectedOrder(order);
                          }}
                          className="flex w-full cursor-pointer justify-center rounded-lg bg-green-100  "
                        >
                          <span className="flex cursor-pointer justify-center">
                            <TbFileInvoice className="text-xl text-success " />
                          </span>
                        </li>
                        <li
                          onClick={() => {
                            handleOrderStatus(order._id, "processing");
                          }}
                          className="flex w-full cursor-pointer justify-center rounded-lg  bg-yellow-100 "
                        >
                          <div
                            className="tooltip flex cursor-pointer justify-center"
                            data-tip="Complete"
                          >
                            <RiArrowGoBackLine className="text-lg text-success " />
                          </div>
                        </li>
                        <li
                          onClick={() => {
                            setIsDeleteModalOpen(true);
                            setSelectedOrder(order);
                          }}
                          className="flex w-full cursor-pointer justify-center rounded-lg bg-red-100"
                        >
                          <div
                            className="tooltip flex cursor-pointer justify-center"
                            data-tip={`Send to ${order?.courier} `}
                          >
                            <RiDeleteBin6Line className="text-xl text-success " />
                          </div>
                        </li>
                      </ul>
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

export default CourierPage;
