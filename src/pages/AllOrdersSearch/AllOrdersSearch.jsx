import DeleteOrderModal from "@/components/Main/Orders/DeleteOrderModal";
import EditOrderModal from "@/components/Main/Orders/EditOrderModal";
import SingleInvoiceGenerator from "@/components/Main/shared/InvoiceGenerator/SingleInvoiceGenerator";
import ModalBox from "@/components/Main/shared/Modals/ModalBox";
import { StateContext } from "@/contexts/StateProvider/StateProvider";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEdit } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { GiReturnArrow } from "react-icons/gi";
import { GrDeliver } from "react-icons/gr";
import { RiArrowGoBackLine, RiDeleteBin6Line } from "react-icons/ri";
import { TbFileInvoice } from "react-icons/tb";
import { useQuery } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";

const AllOrdersSearch = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get("search");
  const { searchOrders } = useContext(StateContext);

  const { userInfo, selectedOrders, setSelectedOrders, refetchSearch } =
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

  const handleOrderStatus = (id, status) => {
    fetch(
      `${import.meta.env.VITE_SERVER_URL}/order/edit-order-status?id=${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderStatus: status,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("update status ", data);
        refetchSearch();
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

  const sendToCourier = async (order) => {
    try {
      const courier_info = {
        invoice: order?.orderId,
        recipient_name: order.name,
        recipient_phone: order.phone,
        recipient_address: order.address,
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
          body: JSON.stringify({
            courierStatus: "sent",
            courierInfo: resultFromCourier,
          }),
        }
      );

      if (response.ok) {
        const resultFromDB = await response.json();
        console.log("order info", resultFromDB);
        toast.success("Courier data saved successfully");
        refetchSearch();
      } else {
        toast.error("Failed to save courier data");
        throw new Error("Failed to save courier data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save courier data");
    }
  };

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

  return (
    <div className="w-screen space-y-3 p-3 md:w-full">
      <EditOrderModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        setSelectedOrder={setSelectedOrder}
        selectedOrder={selectedOrder}
        refetch={refetchSearch}
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
        refetch={refetchSearch}
      />
      <div className="flex flex-col items-start justify-between border-b md:flex-row">
        <p className="text-xl">
          Search result for:{" "}
          <span className="font-semibold">{searchParam}</span>
        </p>
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
        </div>
      </div>
      <div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead className="bg-primary text-white">
              <tr>
                <td className="w-5">
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    onClick={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(searchOrders?.orders);
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                    checked={
                      selectedOrders?.length === searchOrders?.orders?.length
                    }
                    className="checkbox border border-white"
                  />
                </td>
                <th className="w-10">#</th>
                <th className="w-10">Invoice</th>
                <th className="w-96">Name</th>
                <th className="w-96">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {searchOrders?.orders?.map((order, index) => (
                <tr key={index}>
                  <td className="w-5">
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      checked={selectedOrders?.includes(order)}
                      onClick={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders([...selectedOrders, order]);
                        } else {
                          setSelectedOrders(
                            selectedOrders?.filter(
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
                      <TbFileInvoice />
                    </span>
                  </td>
                  <td className="w-96 space-y-2">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-bold">{order.name}</div>
                        <div className="text-sm opacity-50">
                          {order.address}
                        </div>
                        <div
                          className={`badge ${
                            order?.orderStatus === "returned"
                              ? "badge-warning"
                              : order?.orderStatus === "cancelled"
                              ? "badge-error"
                              : order?.orderStatus === "processing"
                              ? "badge-info"
                              : order?.orderStatus === "ready"
                              ? "badge-primary"
                              : order?.orderStatus === "completed" &&
                                "badge-success"
                          }`}
                        >
                          {order?.orderStatus}
                        </div>
                        {order?.courierStatus === "sent" && (
                          <div className="text-sm opacity-50">
                            ConsignmentID:{" "}
                            {order.courierInfo?.consignment?.consignment_id}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(order?.orderStatus === "ready" ||
                        order?.orderStatus === "processing") && (
                        <span
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsEditModalOpen(!isEditModalOpen);
                          }}
                          className="cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-neutral"
                        >
                          <AiOutlineEdit />
                        </span>
                      )}
                      {(order?.orderStatus === "ready" ||
                        order?.orderStatus === "processing") && (
                        <span
                          onClick={() => {
                            handleOrderStatus(
                              order._id,
                              order?.orderStatus === "ready"
                                ? "completed"
                                : "ready"
                            );
                          }}
                          className="tooltip cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-info"
                          data-tip={
                            order?.orderStatus === "ready"
                              ? "completed"
                              : "ready"
                          }
                        >
                          <FaCheck className="text-lg" />
                        </span>
                      )}
                      {order?.orderStatus === "ready" && (
                        <span
                          onClick={() => {
                            sendToCourier(order);
                          }}
                          className="tooltip cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-info"
                          data-tip={`Send to ${order?.courier} `}
                        >
                          <GrDeliver className="text-lg" />
                        </span>
                      )}
                      {order?.orderStatus === "ready" && (
                        <span
                          onClick={() => {
                            handleOrderStatus(order._id, "processing");
                          }}
                          className="tooltip cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-error"
                          data-tip="Back to Processing"
                        >
                          <RiArrowGoBackLine className="text-lg" />
                        </span>
                      )}
                      {order?.orderStatus === "ready" && (
                        <span
                          onClick={() => {
                            handleOrderStatus(order._id, "cancelled");
                          }}
                          className="tooltip cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-error"
                          data-tip="Cancel Order"
                        >
                          <FcCancel className="text-lg" />
                        </span>
                      )}
                      {order?.orderStatus === "processing" && (
                        <div
                          onClick={() => {
                            setIsDeleteModalOpen(true);
                            setSelectedOrder(order);
                          }}
                          className="tooltip cursor-pointer rounded-full border border-error p-1 text-2xl text-error"
                          data-tip="Delete order"
                        >
                          <RiDeleteBin6Line />
                        </div>
                      )}
                      {order?.orderStatus === "completed" && (
                        <div className="mt-1 flex items-center gap-2">
                          <span
                            onClick={() => {
                              handleOrderStatus(order._id, "returned");
                            }}
                            className="tooltip cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-primary"
                            data-tip="Order Return"
                          >
                            <GiReturnArrow className="text-lg" />
                          </span>
                        </div>
                      )}
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
                    <div className="flex w-44 flex-col">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllOrdersSearch;
