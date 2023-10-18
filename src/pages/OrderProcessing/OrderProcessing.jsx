import React, { useContext, useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineShoppingCart } from "react-icons/ai";
import {
  RiArrowGoBackLine,
  RiDeleteBin4Fill,
  RiDeleteBin6Line,
} from "react-icons/ri";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import EditCustomerModal from "../../components/Main/Customers/EditCustomerModal";
import avatarIcon from "../../assets/shared/avatar.png";
import DeleteCustomerModal from "../../components/Main/Customers/DeleteCustomerModal";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { TbFileInvoice } from "react-icons/tb";
import { FaCheck, FaSearch } from "react-icons/fa";
import DeleteOrderModal from "../../components/Main/Orders/DeleteOrderModal";
import InvoiceGenerator from "../../components/Main/shared/InvoiceGenerator/InvoiceGenerator";
import { StateContext } from "@/contexts/StateProvider/StateProvider";
import SingleInvoiceGenerator from "@/components/Main/shared/InvoiceGenerator/SingleInvoiceGenerator";
import EditOrderModal from "@/components/Main/Orders/EditOrderModal";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import { GrDeliver } from "react-icons/gr";
import { FaBagShopping } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { FiCheckCircle, FiTruck } from "react-icons/fi";
import { FiPrinter } from "react-icons/fi";
import { IoIosCloseCircleOutline } from "react-icons/io";

const OrderProcessing = () => {
  const { userInfo, selectedOrders, setSelectedOrders } =
    useContext(StateContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    setSelectedOrders([]);
  }, []);

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
      }&filter=processing`,
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
    const data = await response.json();
    const reversedOrders = data.orders.reverse(); // Reverse the order of the orders

    return reversedOrders;
  });

  console.log("orders", orders);

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

  const [newOrderId, setNewOrderId] = useState("");

  const handleOrderStatus = (order, status) => {
    if (order?.courierStatus === "returned") {
      console.log("returned order");
      fetch(`${import.meta.env.VITE_SERVER_URL}/order/get-new-orderid`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("data orderid", data.orderId);
            toast.success("New order id generated successfully");
            setNewOrderId(data.orderId);

            const payload = {
              orderId: data.orderId,
              orderStatus: "ready",
              updatedBy: userInfo?.username,
              updatedById: userInfo?._id,
              update: {
                oldOrderId: order?.orderId,
                orderId: data.orderId,
                orderStatus: "ready",
              },
            };

            console.log("payload ", payload);

            fetch(
              `${import.meta.env.VITE_SERVER_URL}/order/edit-order-info?id=${
                order._id
              }`,

              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              }
            )
              .then((res) => res.json())
              .then((data) => {
                console.log("edited info", data);
                refetch();
                toast.success("Order status updated successfully");
              })
              .catch((err) => {
                console.log(err);
                toast.error("Failed to update order status");
              });
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to update order status");
        });
    } else {
      const payload = {
        orderStatus: status,
        updatedBy: userInfo?.username,
        updatedById: userInfo?._id,
        update: {
          orderStatus: status,
        },
      };

      fetch(
        `${import.meta.env.VITE_SERVER_URL}/order/edit-order-status?id=${
          order._id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("status update ", data);
          console.log("customer id ", order?.customerId);
          updateCustomer(order?.customerId);
          refetch();
          toast.success("Order status updated successfully");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to update order status");
        });
    }
  };

  const updateCustomer = (id) => {
    console.log("update customer ");
    fetch(
      `${import.meta.env.VITE_SERVER_URL}/customer/update-order-count?id=${id}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          readyCount: 1,
        }),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          console.log("customer updated successfully");
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  console.log(selectedOrder);

  const [searchResult, setSearchResult] = useState([]);

  const SearchOrderById = async (event) => {
    event.preventDefault();
    const form = event.target;
    const orderId = form.orderId.value;

    setIsSearchModalOpen(false);

    console.log("orderId ", orderId);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/order/search-order?orderId=${orderId}&sellerId=${
          userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const resultFromDB = await response.json();
        if (resultFromDB.success) {
          console.log("order info", resultFromDB);
          toast.success("Order found successfully");
          setSearchResult(resultFromDB.orders);
        } else {
          toast.error("Failed to find order");
        }
      } else {
        toast.error("Failed to find order");
        throw new Error("Failed to find order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to find order");
    }
  };

  console.log("search result", searchResult);
  console.log("orders ", orders);

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

  const steadFastCourier = couriers?.find((courier) =>
    /steadfast/i.test(courier.name)
  );

  console.log("steadfast ", steadFastCourier);

  const sendToCourier = async (order) => {
    try {
      let recipientAddress = order.address;

      if (order.thana) {
        recipientAddress += ", " + order.thana;
      }

      if (order.district) {
        recipientAddress += ", " + order.district;
      }

      console.log("recipientAddress", recipientAddress);

      const courier_info = {
        invoice: order?.orderId,
        recipient_name: order.name,
        recipient_phone: order.phone,
        recipient_address: recipientAddress,
        cod_amount: order.cash,
        note: order.instruction,
      };

      const response = await fetch(
        `${import.meta.env.VITE_STEADFAST_BASE_URL}/create_order`,
        {
          method: "POST",
          headers: {
            "Api-Key": steadFastCourier?.api,
            "Secret-Key": steadFastCourier?.secret,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courier_info),
        }
      );
      console.log(response);
      if (response.ok) {
        const resultFromCourier = await response.json();
        console.log("courier info", resultFromCourier);
        if (resultFromCourier.status === 200) {
          console.log(order);
          toast.success("Order sent to courier successfully");
          saveToDb(order, resultFromCourier);
        } else if (resultFromCourier.status !== 200) {
          toast.error(resultFromCourier?.errors?.recipient_phone[0]);
          toast.error("Failed to send order to courier");
        }
      } else {
        toast.error("Failed to send order to courier");
        throw new Error("Failed to send order to courier");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send order to courier");
    }
  };

  const saveToDb = async (order, resultFromCourier) => {
    console.log(order, resultFromCourier);
    const payload = {
      courierStatus: "sent",
      courierInfo: resultFromCourier,
      updatedBy: userInfo?.username,
      updatedById: userInfo?._id,
      update: {
        courierStatus: "sent",
        courierInfo: resultFromCourier,
      },
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/order/edit-order-info?id=${
          order._id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const resultFromDB = await response.json();
        console.log("order info", resultFromDB);
        toast.success("Courier data saved successfully");
        refetch();
      } else {
        toast.error("Failed to save courier data");
        throw new Error("Failed to save courier data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save courier data");
    }
  };

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

  const navigate = useNavigate();

  return (
    <div className="w-screen space-y-3 p-3 md:w-full">
      <EditOrderModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        setSelectedOrder={setSelectedOrder}
        selectedOrder={selectedOrder}
        refetch={refetch}
      />
      <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <div>
          <SingleInvoiceGenerator order={selectedOrder} />
        </div>
      </ModalBox>
      <DeleteOrderModal
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        selectedOrder={selectedOrder}
        refetch={refetch}
      />
      <div className="flex flex-col items-start justify-between md:flex-row">
        {/*  <div>
          <p className="text-xl font-semibold">Order Processing</p>
          <p>Total Parcels: 0</p>
          <p>Total Sales: ৳0.00</p>
          <p>Total DC: ৳0.00</p>
          <p>Total COD: ৳0.00</p>
          <p>Total Advance: ৳0.00</p>
        </div> */}
        <div className="mt-3 flex w-full flex-col gap-3 md:mt-0 md:w-auto md:flex-row md:gap-5">
          {/* {selectedOrders?.length > 0 && (
            <Link to="/inventory/invoice-generator">
              <button className="btn-primary btn-outline btn w-full md:w-52">
                Print Selected
              </button>
            </Link>
          )}
          <button className="btn-primary btn-outline btn w-full md:w-52">
            Advance Search
          </button>
          <Link
            to="import-csv"
            className="btn-primary btn-outline btn w-full md:w-52"
          >
            Create Bulk Order
          </Link>
          <button
            onClick={handleExportClick}
            className="btn-primary btn-outline btn w-full md:w-52"
          >
            Export Orders
          </button> */}
          {/* Open the modal using ID.showModal() method */}

          {/* The button to open modal */}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="my-2 flex items-center gap-2 md:my-0">
          <p>Show</p>
          <select name="page" id="page" className="input-bordered input p-2">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-8 bg-[#14BF7D] p-1 px-5 text-2xl">
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
            <button disabled className="cursor-not-allowed">
              <FaBagShopping className="text-[#11111125] " />
            </button>
            <FaEdit
              onClick={() => {
                if (selectedOrders?.length === 1) {
                  setSelectedOrder(selectedOrders[0]);
                  setIsEditModalOpen(!isEditModalOpen);
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
            <FiTruck
              onClick={() => {
                if (selectedOrders?.length === 1) {
                  handleOrderStatus(selectedOrders[0], "ready");
                  sendToCourier(selectedOrders[0]);
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
            <IoIosCloseCircleOutline
              onClick={() => {
                if (selectedOrders?.length === 1) {
                  handleOrderStatus(selectedOrders[0], "cancelled");
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
            <FiCheckCircle
              onClick={() => {
                if (selectedOrders?.length === 1) {
                  handleOrderStatus(selectedOrders[0], "completed");
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
          </div>
          <form
            onSubmit={SearchOrderById}
            className="hidden items-center gap-2 md:flex"
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
          <button
            className="btn-primary btn-outline btn"
            onClick={() => setIsSearchModalOpen(!isSearchModalOpen)}
          >
            <FaSearch className="text-xl" />
          </button>
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

      <div>
        <div className="h-[70vh] overflow-auto">
          <table className="table-pin-rows table-pin-cols table bg-[#F1F1F1]">
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
                    className="checkbox border border-white"
                  />
                </td>
                <th className="bg-white text-black">Order ID</th>
                <th className="bg-white text-center text-black">Date</th>
                <th className="bg-white text-black">Customer</th>
                <th className="bg-white text-black">Total</th>
                {/* <th>Prods/Pics</th> */}
                <th className="bg-white text-black">Payment Status</th>
                <th className="bg-white text-black">Delivery Method</th>
                <th className="w-96 bg-white text-black">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {(searchResult?.length > 0 ? searchResult : orders)?.map(
                (order, index) => (
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
                                (selectedOrder) =>
                                  selectedOrder._id !== order._id
                              )
                            );
                          }
                        }}
                        className="checkbox border border-black"
                      />
                    </td>
                    <td className="w-5">#{order?.orderId}</td>
                    <td className="flex  flex-col text-center">
                      <span>{formatTimestamp(order?.timestamp).date}</span>
                      <span>{formatTimestamp(order?.timestamp).time}</span>
                    </td>
                    {/*  <td className="">
                      <span
                        onClick={() => {
                          setIsModalOpen(!isModalOpen);
                          setSelectedOrder(order);
                        }}
                        className="p-1 text-2xl text-success"
                      >
                        <TbFileInvoice />
                      </span>
                    </td> */}
                    <td className="">
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
                          <div className="">{order.name}</div>
                          {/* <div className="text-sm opacity-50">
                            {order.address}
                          </div> */}
                        </div>
                      </div>
                    </td>
                    <td> ৳ {order?.total}</td>
                    <td className="font-semibold">{order?.paymentType}</td>
                    <td className="font-semibold">{order?.courier}</td>
                    {/* <td className="">
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
                    <td>
                      <div className="dropdown-left dropdown">
                        <label tabIndex={0} className="cursor-pointer">
                          <BsThreeDotsVertical size={18} />
                        </label>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu rounded-box z-[1] w-48 gap-1  bg-base-100 shadow"
                        >
                          <li
                            onClick={() => {
                              setSelectedOrders([order]);
                              navigate("/inventory/invoice-generator");
                            }}
                            className="flex w-full cursor-pointer justify-center rounded-lg bg-white "
                          >
                            <span className="flex cursor-pointer justify-center">
                              <FiPrinter className="text-xl" />
                              <span>Print</span>
                            </span>
                          </li>
                          <li
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsEditModalOpen(!isEditModalOpen);
                            }}
                            className="flex w-full cursor-pointer justify-center rounded-lg bg-white "
                          >
                            <span className="flex cursor-pointer justify-center">
                              <AiOutlineEdit className="text-xl" />
                              <span>Edit</span>
                            </span>
                          </li>
                          {/* <li
                            onClick={() => {
                              handleOrderStatus(order);
                            }}
                            className="flex w-full cursor-pointer justify-center rounded-lg  bg-yellow-100 "
                          >
                            <div
                              className="tooltip flex cursor-pointer justify-center"
                              data-tip="Ready"
                            >
                              <FaCheck className="text-lg text-success " />
                            </div>
                          </li> */}
                          <li
                            onClick={() => {
                              handleOrderStatus(order);
                              sendToCourier(order);
                            }}
                            className="flex w-full cursor-pointer justify-center rounded-lg bg-white"
                          >
                            <div
                              className="tooltip flex cursor-pointer justify-center"
                              data-tip={`Send to ${order?.courier} `}
                            >
                              <GrDeliver className="text-xl text-success " />
                              <p>Send to {order?.courier}</p>
                            </div>
                          </li>
                          <li
                            onClick={() => {
                              handleOrderStatus(order, "cancelled");
                            }}
                            className="flex w-full cursor-pointer justify-center rounded-lg bg-white"
                          >
                            <div
                              className="tooltip flex cursor-pointer justify-center"
                              data-tip="Delete order"
                            >
                              <IoIosCloseCircleOutline className="text-xl" />
                              Cancelled
                            </div>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderProcessing;
