import React, { useEffect, useState, useContext, useRef } from "react";
import { AiOutlineEdit, AiOutlineShoppingCart } from "react-icons/ai";
import { RiArrowGoBackLine, RiDeleteBin6Line } from "react-icons/ri";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import EditCustomerModal from "../../components/Main/Customers/EditCustomerModal";
import avatarIcon from "../../assets/shared/avatar.png";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import DeleteOrderModal from "../../components/Main/Orders/DeleteOrderModal";
import { FaCheck } from "react-icons/fa";
import { TbFileInvoice } from "react-icons/tb";
import { FcCancel } from "react-icons/fc";
import InvoiceGenerator from "../../components/Main/shared/InvoiceGenerator/InvoiceGenerator";
import { GrDeliver } from "react-icons/gr";
import EditOrderModal from "../../components/Main/Orders/EditOrderModal";
import { StateContext } from "@/contexts/StateProvider/StateProvider";
import SingleInvoiceGenerator from "@/components/Main/shared/InvoiceGenerator/SingleInvoiceGenerator";
import { BsThreeDots } from "react-icons/bs";

const AllReadyOrders = () => {
  const { userInfo, selectedOrders, setSelectedOrders } =
    useContext(StateContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});
  console.log(isEditModalOpen);
  console.log(selectedOrder);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSelectedOrders([]);
  }, []);

  console.log("selected order ", selectedOrder);
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
      }&filter=ready`,
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
    const filteredOrders = data?.orders?.filter(
      (order) => order.courierStatus !== "sent"
    );
    const reversedOrders = filteredOrders?.reverse(); // Reverse the order of the orders

    return reversedOrders;
  });

  console.log("orders", orders);

  const handleExportClick = () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/customer-export`, {
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

  // console.log(isModalOpen);

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
        updateCustomer(data?.order?.customerId, status);
        toast.success("Order status updated successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to update order status");
      });
  };

  const updateCustomer = (id, status) => {
    console.log("update customer ");
    const payload = {};

    if (status === "completed") {
      payload.completedCount = 1;
    } else if (status === "cancelled") {
      payload.cancelledCount = 1;
    } else if (status === "processing") {
      payload.processingCount = 1;
    }

    fetch(
      `${import.meta.env.VITE_SERVER_URL}/customer/update-order-count?id=${id}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
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

  const [searchResult, setSearchResult] = useState([]);

  const SearchOrderById = async (event) => {
    event.preventDefault();
    const form = event.target;
    const orderId = form.orderId.value;

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
        setSelectedOrder={setSelectedOrder}
        selectedOrder={selectedOrder}
        refetch={refetch}
      />
      <div className="flex flex-col items-start justify-between border-b md:flex-row">
        <div>
          <p className="text-xl font-semibold">All Ready Orders</p>
          <p>Total Parcels: 1</p>
          <p>Total Sales: ৳0.00</p>
          <p>Total DC: ৳0.00</p>
          <p>Total COD: ৳0.00</p>
          <p>Total Advance: ৳0.00</p>
        </div>
        <div className="mt-3 flex w-full flex-col gap-3 md:mt-0 md:w-auto md:flex-row md:gap-5">
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
          onSubmit={SearchOrderById}
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
        <div className="h-[70vh] overflow-auto">
          <table className="table-pin-rows table-pin-cols table">
            {/* head */}
            <thead className="bg-primary text-white">
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
                <th className="w-96 bg-primary text-white">Price</th>
                <th className="w-96 bg-primary text-white">Action</th>
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
                    <td className="w-10">{index + 1}</td>
                    <td>
                      <span
                        onClick={() => {
                          setIsModalOpen(!isModalOpen);
                          setSelectedOrder(order);
                        }}
                        className="cursor-pointer p-1 text-2xl text-success"
                      >
                        <TbFileInvoice />
                      </span>
                    </td>
                    <td className="">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-bold">{order.name}</div>
                          <div className="text-sm opacity-50">
                            {order.address}
                          </div>
                          {order?.courierStatus === "sent" && (
                            <div className="text-sm opacity-50">
                              ConsignmentID:{" "}
                              {order.courierInfo?.consignment?.consignment_id}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* <td>
                    <div className="avatar-group -space-x-6">
                      {order.products?.map((product) => (
                        <div key={product._id} className="avatar">
                          <div className="w-12">
                            <img src={product?.image} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </td> */}
                    <td className="w-96">
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
                              setSelectedOrder(order);
                              setIsEditModalOpen(!isEditModalOpen);
                            }}
                            className="flex w-full cursor-pointer justify-center rounded-lg bg-green-100  "
                          >
                            <span className="flex cursor-pointer justify-center">
                              <AiOutlineEdit className="text-xl text-success " />
                            </span>
                          </li>
                          <li
                            onClick={() => {
                              handleOrderStatus(order._id, "completed");
                            }}
                            className="flex w-full cursor-pointer justify-center rounded-lg  bg-yellow-100 "
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
                              sendToCourier(order);
                            }}
                            className="flex w-full cursor-pointer justify-center rounded-lg bg-red-100"
                          >
                            <div
                              className="tooltip flex cursor-pointer justify-center"
                              data-tip={`Send to ${order?.courier} `}
                            >
                              <GrDeliver className="text-xl text-success " />
                            </div>
                          </li>
                          <li
                            onClick={() => {
                              handleOrderStatus(order._id, "processing");
                            }}
                            className="flex w-full cursor-pointer justify-center rounded-lg bg-red-100"
                          >
                            <div
                              className="tooltip flex cursor-pointer justify-center"
                              data-tip="Back to Processing"
                            >
                              <RiArrowGoBackLine className="text-xl text-success " />
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

export default AllReadyOrders;
