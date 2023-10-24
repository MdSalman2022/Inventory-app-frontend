import React, { useContext, useEffect, useState } from "react";
import { FaCheck, FaEdit, FaSearch } from "react-icons/fa";
import {
  RiArrowGoBackLine,
  RiDeleteBin4Fill,
  RiDeleteBin6Line,
} from "react-icons/ri";
import { Link, useNavigate, useParams } from "react-router-dom";
import InvoiceGenerator from "../../components/Main/shared/InvoiceGenerator/InvoiceGenerator";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import { useQuery } from "react-query";
import { TbFileInvoice } from "react-icons/tb";
import { toast } from "react-hot-toast";
import avatarIcon from "../../assets/shared/avatar.png";
import { StateContext } from "@/contexts/StateProvider/StateProvider";
import SingleInvoiceGenerator from "@/components/Main/shared/InvoiceGenerator/SingleInvoiceGenerator";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import DeleteOrderModal from "@/components/Main/Orders/DeleteOrderModal";
import { FcCancel } from "react-icons/fc";
import { GiReturnArrow } from "react-icons/gi";
import { FiCheckCircle, FiPrinter, FiTruck } from "react-icons/fi";
import { FaBagShopping } from "react-icons/fa6";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { GrDeliver } from "react-icons/gr";
import { searchOrderByIdUniFunc } from "@/utils/fetchApi";
import { Pagination } from "@/components/Main/shared/Pagination";
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

  const [currentPage, setCurrentPage] = useState(1); // Initialize with page 1
  const PAGE_SIZE = 10; // Set the page size, which should match the backend's page size

  const {
    data: { orders = [], totalPages, thisPage } = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(["orders", userInfo, name, currentPage], async () => {
    // Fetch data based on the updated name
    const response = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/order/get-orders?courier=${name}&sellerId=${
        userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
      }&filter=ready&courierStatus=sent&page=${currentPage}&limit=${PAGE_SIZE}`,
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

    const responseData = await response.json();

    console.log("responseData", responseData);

    return {
      orders: responseData.orders,
      totalPages: responseData.totalPages,
      currentPage: responseData.currentPage,
    };
  });

  console.log("orders courier", orders);

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
      const fetchPromises = allOrdersInvoice?.map((orderId) =>
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

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [searchResult, setSearchResult] = useState([]);

  const SearchOrderById = async (event) => {
    event.preventDefault();
    const form = event.target;
    const orderId = form.orderId.value;

    console.log("orderId ", orderId);

    try {
      const orders = await searchOrderByIdUniFunc(orderId, userInfo);
      console.log("order info", orders);
      toast.success("Order found successfully");
      setSearchResult(orders);
    } catch (error) {
      toast.error("Failed to find order");
    }
  };

  console.log("searchResult courier", searchResult);
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

  function getStatusColorDiv(status) {
    let backgroundColor = "";

    // Define background colors for each status
    switch (status) {
      case "pending":
        backgroundColor = "#ECB409"; // You can choose the desired color
        break;
      case "delivered_approval_pending":
      case "partial_delivered_approval_pending":
      case "cancelled_approval_pending":
      case "unknown_approval_pending":
        backgroundColor = "orange"; // Choose appropriate color
        break;

      case "delivered":
      case "partial_delivered":
        backgroundColor = "#14BF7D"; // Choose appropriate color
        break;
      case "cancelled":
        backgroundColor = "red"; // Choose appropriate color
        break;

      case "hold":
      case "unknown":
        backgroundColor = "#ccc"; // Choose appropriate color
        break;

      case "in_review":
        backgroundColor = "#14BF7D"; // Choose appropriate color
        break;
      default:
        backgroundColor = "gray"; // Default color for unknown status
        break;
    }

    return (
      <div
        className="w-fit rounded-full px-3 text-black"
        style={{ backgroundColor }}
      >
        {status === "delivered_approval_pending"
          ? "delivered approval pending"
          : status === "partial_delivered_approval_pending"
          ? "partial delivered approval pending"
          : status === "cancelled_approval_pending"
          ? "cancelled approval pending"
          : status === "unknown_approval_pending"
          ? "unknown approval pending"
          : status === "partial_delivered"
          ? "partial delivered"
          : status === "delivered"
          ? "Delivered"
          : status === "cancelled"
          ? "Cancelled"
          : status === "hold"
          ? "Hold"
          : status === "unknown"
          ? "Unknown"
          : status === "in_review"
          ? "In Review"
          : status === "pending"
          ? "Pending"
          : "unknown"}
      </div>
    );
  }

  console.log(selectedOrder);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);

    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);

    return { date: formattedDate, time: formattedTime };
  };

  console.log("selectedOrders courier", selectedOrders);

  console.log("orders",orders)

  const navigate = useNavigate();

  return (
    <div className="w-screen space-y-3 p-3 md:w-full">
      <DeleteOrderModal
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        selectedOrder={selectedOrder}
        refetch={refetch}
      />
      <div className="mt-3 flex flex-col items-start justify-between md:flex-row">
        <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <div>
            <SingleInvoiceGenerator order={selectedOrder} />
          </div>
        </ModalBox>
        <p className="text-xl font-semibold">{name} Orders</p>
        {/* <div>
          <p>Total Parcels: {orders?.length || 0.0}</p>
          <p>Total Sales: ৳{SumOfTotalPrice || 0.0}</p>
          <p>Total DC: ৳{SumOfTotalDC || 0.0}</p>
          <p>Total COD: ৳{SumOfTotalCOD || 0.0}</p>
          <p>Total Advance: ৳{SumOfTotalAdvance || 0.0}</p>
        </div> */}
        {/* <div className="mt-3 flex w-full flex-col gap-3 md:mt-0 md:w-auto md:flex-row md:gap-5">
          {selectedOrders?.length > 0 && (
            <Link to="/inventory/invoice-generator">
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
        </div> */}
      </div>
      <div className="flex md:flex-row flex-col  justify-between">
        <div className="my-2 flex items-center gap-2 md:my-0">
          <p>Show</p>
          <select name="page" id="page" className="input-bordered input p-2">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="flex md:flex-row flex-col items-start gap-3">
          <div className="flex items-center gap-5 md:gap-8 bg-[#14BF7D] p-1 px-5 text-2xl">
            <span className="tooltip" data-tip="Print Invoice">
              <FiPrinter
                onClick={() => {
                  if (selectedOrders?.length > 0) {
                    navigate("/inventory/invoice-generator");
                  } else {
                    toast.error("Please select an order");
                  }
                }}
                className={`cursor-pointer ${
                  selectedOrders?.length > 0
                    ? ""
                    : "cursor-not-allowed text-[#11111125]"
                }`}
              />
            </span>

            <button disabled className="cursor-not-allowed">
              <FaBagShopping className="text-[#11111125] " />
            </button>
            <FaEdit
              /*  onClick={() => {
                if (selectedOrders?.length === 1) {
                  setSelectedOrder(selectedOrders[0]);
                  setIsEditModalOpen(!isEditModalOpen);
                } else {
                  toast.error("Please select an order");
                }
              }} */
              className={`tooltip cursor-not-allowed ${
                selectedOrders?.length === 1
                  ? "text-[#11111125]"
                  : " text-[#11111125]"
              }`}
              data-tip="Edit Order"
            />
            <span className="tooltip" data-tip="Deliver Order">
              <FiTruck
                className={`cursor-not-allowed ${
                  selectedOrders?.length === 1
                    ? "text-[#11111125]"
                    : " text-[#11111125]"
                }`}
              />
            </span>
            <span className="tooltip" data-tip="Cancel Order">
              <IoIosCloseCircleOutline
                onClick={() => {
                  if (selectedOrders?.length === 1) {
                    handleOrderStatus(selectedOrders[0]?._id, "cancelled");
                  } else {
                    toast.error("Please select an order");
                  }
                }}
                className={` cursor-pointer ${
                  selectedOrders?.length === 1
                    ? ""
                    : " cursor-not-allowed text-[#11111125]"
                }`}
              />
            </span>

            <span className="tooltip" data-tip="Delete Order">
              <RiDeleteBin4Fill
                onClick={() => {
                  if (selectedOrders?.length === 1) {
                    setSelectedOrder(selectedOrders[0]);
                    setIsDeleteModalOpen(true);
                  } else {
                    toast.error("Please select an order");
                  }
                }}
                className={`cursor-pointer ${
                  selectedOrders?.length === 1
                    ? ""
                    : "cursor-not-allowed text-[#11111125]"
                }`}
              />
            </span>
            <span className="tooltip" data-tip="Complete Order">
              <FiCheckCircle
                onClick={() => {
                  if (selectedOrders?.length === 1) {
                    handleOrderStatus(selectedOrders[0]?._id, "completed");
                  } else {
                    toast.error("Please select an order");
                  }
                }}
                className={` ${
                  selectedOrders?.length === 1
                    ? ""
                    : " cursor-not-allowed text-[#11111125]"
                }`}
              />
            </span>
          </div>
          <form
            onSubmit={SearchOrderById}
            className="items-center gap-2 flex"
          >
            <p>Search</p>
            <input
              type="text"
              name="orderId"
              placeholder="Id / Name / Number"
              className="input-bordered input h-8 border-black"
            />
          </form>
        </div>
        <div className="my-2 flex items-center md:hidden">
          {/* <button
            className="btn-primary btn-outline btn"
            onClick={() => setIsSearchModalOpen(!isSearchModalOpen)}
          >
            <FaSearch className="text-xl" />
          </button> */}
          {isSearchModalOpen && (
            <ModalBox
              setIsModalOpen={setIsSearchModalOpen}
              isModalOpen={isSearchModalOpen}
            >
              <div className="flex h-40 w-full flex-col items-center justify-center gap-5 bg-base-100 p-5">
                <p className="text-2xl font-bold">Search Customer</p>
                <form onSubmit={SearchOrderById} className="w-full">
                  <div className="flex w-full items-center justify-between gap-3">
                    <input
                      name="orderId"
                      placeholder="Order Id"
                      type="text"
                      className="input-box h-12 w-full rounded-full border border-primary px-2"
                    />
                    <button
                      type="submit"
                      className="btn-primary btn-md btn rounded-full"
                    >
                      {" "}
                      <FaSearch />
                    </button>
                  </div>
                </form>
              </div>
            </ModalBox>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="overflow-y-scroll h-[60vh] 2xl:h-[73vh] ">
          <table className="table-pin-rows table-pin-cols table ">
            {/* head */}
            <thead className="">
              <tr>
                <td className="w-5 bg-white text-black">
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
                    className="checkbox border border-black"
                  />
                </td>
                <th className="bg-white text-black">Order ID</th>
                <th className="bg-white text-center text-black md:w-60">
                  Date
                </th>
                <th className="bg-white text-center text-black">Customer</th>
                <th className="w-40 bg-white text-center text-black">Total</th>
                {/* <th>Prods/Pics</th> */}
                <th className="w-40 bg-white text-center text-black">
                  Payment Status
                </th>
                <th className="w-40 bg-white text-center text-black">
                  Delivery Method
                </th>
                <th className="w-40 bg-white text-center text-black">
                  Courier ID
                </th>
                <th className="w-40 bg-white text-center text-black">Action</th>
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
                  <td className="w-80">#{order?.orderId}</td>
                  <td className="flex flex-col text-center font-medium ">
                    <span>{formatTimestamp(order?.timestamp).date}</span>
                    <span>{formatTimestamp(order?.timestamp).time}</span>
                  </td>
                  <td className=" font-medium">
                    <div className="flex justify-center text-center">
                      {order.name}
                    </div>
                  </td>
                  <td className="flex w-40 justify-center font-semibold">
                    {" "}
                    ৳ {order?.total - order?.discount - (order?.discountOnAll || 0)}
                  </td>
                  <td className=" text-center font-semibold">
                    {order?.paymentType}
                  </td>
                  <td className=" text-center font-semibold">
                    <div className="flex flex-col items-center gap-1">
                      <span>{order?.courier}</span>
                      {isStatusLoading
                        ? "...Loading"
                        : getStatusColorDiv(
                            ordersStatus[index]?.delivery_status
                          )}
                    </div>
                  </td>
                  <td className="">
                    <span className="flex justify-center font-bold">
                      {order?.courierInfo?.consignment?.consignment_id}
                    </span>
                  </td>

                  {/*     <td>
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
                  </td> */}

                  {/*        <td className="flex flex-col gap-1">
                    <div className="flex items-center space-x-3">
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
                  </td> */}

                  {/* <td>
                    {isStatusLoading
                      ? "...Loading"
                      : ordersStatus[index]?.delivery_status}
                  </td> */}

                  {/*  <td>
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
                  </td> */}
                  <td className="flex w-40 justify-center text-center font-semibold">
                    <div className="dropdown-left dropdown">
                      <label tabIndex={0} className="cursor-pointer">
                        <BsThreeDotsVertical size={18} />
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
                          className="tooltip flex w-full cursor-pointer justify-center rounded-lg bg-green-100"
                          data-tip="Invoice"
                        >
                          <span className="flex cursor-pointer justify-center">
                            <TbFileInvoice className="text-xl text-success " />
                          </span>
                        </li>
                        {/* <li
                          onClick={() => {
                            handleOrderStatus(order._id, "processing");
                          }}
                          className="flex w-full cursor-pointer justify-center rounded-lg  bg-yellow-100 "
                        >
                          <div
                            className="tooltip flex cursor-pointer justify-center"
                            data-tip="Back to Processing"
                          >
                            <RiArrowGoBackLine className="text-lg text-success " />
                          </div>
                        </li> */}
                        <li
                          onClick={() => {
                            handleOrderStatus(order._id, "completed");
                          }}
                          className="flex w-full cursor-pointer justify-center rounded-lg  bg-blue-100 "
                        >
                          <div
                            className="tooltip flex cursor-pointer justify-center"
                            data-tip="Complete"
                          >
                            <FaCheck className="text-lg text-success " />
                          </div>
                        </li>
                        <li
                          onClick={() => {
                            handleOrderStatus(order._id, "cancelled");
                          }}
                          className="flex w-full cursor-pointer justify-center rounded-lg bg-red-100"
                        >
                          <div
                            className="tooltip flex cursor-pointer justify-center"
                            data-tip="Cancel Order"
                          >
                            <FcCancel className="text-xl text-success " />
                          </div>
                        </li>
                        {/*          <li
                          onClick={() => {
                            handleOrderStatus(order._id, "returned");
                          }}
                          className="tooltip flex w-full cursor-pointer justify-center rounded-lg bg-green-100  "
                          data-tip="Order Return"
                        >
                          <span className="flex cursor-pointer justify-center">
                            <GiReturnArrow className="text-xl text-success " />
                          </span>
                        </li> */}
                        {/*   <li
                          onClick={() => {
                            setIsDeleteModalOpen(true);
                            setSelectedOrder(order);
                          }}
                          className="flex w-full cursor-pointer justify-center rounded-lg bg-red-100"
                        >
                          <div
                            className="tooltip flex cursor-pointer justify-center"
                            data-tip="Delete"
                          >
                            <RiDeleteBin6Line className="text-xl text-success " />
                          </div>
                        </li> */}
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages} // Calculate total pages
            onPageChange={(page) => setCurrentPage(page)} // Update currentPage
          />
        </div>
      </div>
    </div>
  );
};

export default CourierPage;
