import React, { useEffect, useState, useContext } from "react";
import { AiOutlineEdit, AiOutlineShoppingCart } from "react-icons/ai";
import { RiDeleteBin4Fill, RiDeleteBin6Line } from "react-icons/ri";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import EditCustomerModal from "../../components/Main/Customers/EditCustomerModal";
import avatarIcon from "../../assets/shared/avatar.png";
import DeleteCustomerModal from "../../components/Main/Customers/DeleteCustomerModal";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { RiArrowGoBackLine } from "react-icons/ri";

import { FaCheck, FaEdit } from "react-icons/fa";
import { TbFileInvoice } from "react-icons/tb";
import InvoiceGenerator from "../../components/Main/shared/InvoiceGenerator/InvoiceGenerator";
import { StateContext } from "@/contexts/StateProvider/StateProvider";
import SingleInvoiceGenerator from "@/components/Main/shared/InvoiceGenerator/SingleInvoiceGenerator";
import { GiReturnArrow } from "react-icons/gi";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import { formatTimestamp, searchOrderByIdUniFunc } from "@/utils/fetchApi";
import { FiCheckCircle, FiPrinter, FiTruck } from "react-icons/fi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaBagShopping } from "react-icons/fa6";
import DeleteOrderModal from "@/components/Main/Orders/DeleteOrderModal";

const CompletedOrders = () => {
  const { userInfo, selectedOrders, setSelectedOrders } =
    useContext(StateContext);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
      }&filter=completed`,
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

  console.log(orders);
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

  console.log("searchResult", searchResult);

  const handleExportClick = () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/order-export`, {
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

  const handleOrderStatus = (id, status) => {
    const payload = {
      orderStatus: status,
      updatedBy: userInfo?.username,
      updatedById: userInfo?._id,
      update: {
        orderStatus: status,
      },
    };
    fetch(
      `${import.meta.env.VITE_SERVER_URL}/order/edit-order-status?id=${id}`,
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
        console.log("update status ", data);
        refetch();
        updateCustomer(data?.order?.customerId);
        toast.success("Order status updated successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to update order status");
      });
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
          returnedCount: 1,
        }),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        console.log("result update customer ", result);
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

  console.log(isModalOpen);

  const navigate = useNavigate();

  return (
    <div className="w-screen space-y-3 p-3 md:w-full">
      <DeleteOrderModal
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        selectedOrder={selectedOrder}
        refetch={refetch}
      />
      <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <div>
          <SingleInvoiceGenerator order={selectedOrder} />
        </div>
      </ModalBox>
      <div className="mt-3 flex flex-col items-start justify-between border-b md:flex-row">
        <p className="text-xl font-semibold">Completed Orders</p>
        {/* <div>
          <p>Total Parcels: 1</p>
          <p>Total Sales: ৳0.00</p>
          <p>Total DC: ৳0.00</p>
          <p>Total COD: ৳0.00</p>
          <p>Total Advance: ৳0.00</p>
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
          <Link
            to="/orders-processing/import-csv"
            className="btn-primary btn-outline btn"
          >
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
            <span className="tooltip" data-tip="Print Invoice">
              <FiPrinter
                onClick={() => {
                  if (selectedOrders?.length > 0) {
                    navigate("/inventory/invoice-generator");
                  } else {
                    toast.error("Please select an order");
                  }
                }}
                className={`tooltip cursor-pointer ${
                  selectedOrders?.length > 0
                    ? ""
                    : "cursor-not-allowed text-[#11111125]"
                }`}
                data-tip="Edit order"
              />
            </span>
            <span className="tooltip" data-tip="Bag">
              <button disabled className="cursor-not-allowed">
                <FaBagShopping className="text-[#11111125] " />
              </button>
            </span>
            <span className="tooltip" data-tip="Edit Order">
              <FaEdit
                className={`tooltip cursor-not-allowed text-[#11111125]`}
                data-tip="Edit order"
              />
            </span>
            <span className="tooltip" data-tip="Deliver Order">
              <FiTruck
                className={`tooltip cursor-not-allowed text-[#11111125]`}
                data-tip="Deliver order"
              />
            </span>
            <span className="tooltip" data-tip="Cancel Order">
              <IoIosCloseCircleOutline
                /*    onClick={() => {
                if (selectedOrders?.length === 1) {
                  handleOrderStatus(selectedOrders[0], "cancelled");
                } else {
                  toast.error("Please select an order");
                }
              }} */
                className={`cursor-not-allowed text-[#11111125]`}
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
                className={`tooltip cursor-pointer ${
                  selectedOrders?.length === 1
                    ? ""
                    : "cursor-not-allowed text-[#11111125]"
                }`}
                data-tip="Delete order"
              />
            </span>
            <span className="tooltip" data-tip="Complete Order">
              <FiCheckCircle
                // onClick={() => {
                //   if (selectedOrders?.length === 1) {
                //     handleOrderStatus(selectedOrders[0], "completed");
                //   } else {
                //     toast.error("Please select an order");
                //   }
                // }}
                className={`tooltip cursor-not-allowed text-[#11111125]`}
                data-tip="Complete order"
              />
            </span>
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
      </div>

      <div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead className="bg-white text-black">
              <tr>
                <th className="w-5">
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
                    className="checkbox-primary checkbox border border-black"
                  />
                </th>
                <th className="bg-white text-black">Order ID</th>
                <th className="bg-white text-center text-black md:w-60">
                  Date
                </th>
                <th className="bg-white text-center text-black">Customer</th>
                <th className="bg-white text-black ">Total</th>
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
                  <td className="w-20 font-medium">#{order?.orderId}</td>
                  <td className="flex flex-col text-center font-medium md:w-60">
                    <span>{formatTimestamp(order?.timestamp).date}</span>
                    <span>{formatTimestamp(order?.timestamp).time}</span>
                  </td>
                  <td className="">
                    <div className="flex justify-center text-center font-semibold">
                      {order.name}
                    </div>
                    {/*     <div className="flex items-center  space-x-3">
                        <div>
                          <div className="font-bold">{order.name}</div>
                          <div className="text-sm opacity-50">
                            {order.address}
                          </div>
                        </div>
                      </div> */}
                  </td>

                  <td className="w-40 font-semibold"> ৳ {order?.total}</td>
                  <td className="w-20 text-center font-semibold">
                    {order?.paymentType}
                  </td>
                  <td className=" flex flex-col items-center gap-1 text-center font-semibold">
                    {order?.courier}
                    <span className="w-fit rounded-full bg-[#1DC68C] px-3 text-xs font-bold text-black">
                      DELIVERED
                    </span>
                  </td>

                  <td className="">
                    <span className="flex justify-center font-bold">
                      {order?.courierInfo?.consignment?.consignment_id ||
                        "No Consignment Id"}
                    </span>
                  </td>
                  {/*  <td>
                    <div className="flex w-32 flex-col">
                      <p className="badge badge-info">
                        {order?.courier}: {order?.deliveryCharge}
                      </p>
                      <p>Quantity: {order?.quantity}</p>
                      <p className="">Price: {order?.total} Tk</p>
                      <p className="">Discount: {order?.discount} Tk</p>
                      <p className="">
                        Total Bill:{" "}
                        {parseInt(order?.total) +
                          parseInt(order?.deliveryCharge) -
                          order?.discount}
                        Tk
                      </p>
                      <p className="">Advance: {order?.advance} Tk</p>
                      <p className="">COD: {order?.cash} Tk</p>
                    </div>
                  </td> */}
                  <td>
                    <div className="dropdown-left dropdown flex justify-center">
                      <label
                        tabIndex={0}
                        className="flex cursor-pointer justify-center"
                      >
                        <BsThreeDotsVertical size={18} />
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu rounded-box z-[1] w-40 gap-1  bg-base-100 shadow"
                      >
                        <li
                          onClick={() => {
                            setIsDeleteModalOpen(true);
                            setSelectedOrder(order);
                          }}
                          className="flex w-full cursor-pointer justify-center rounded-lg bg-white"
                        >
                          <div
                            className="tooltip flex cursor-pointer justify-center"
                            data-tip="Delete"
                          >
                            <RiDeleteBin6Line className="text-xl text-black" />
                          </div>
                        </li>
                        {/*  <li
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

export default CompletedOrders;
