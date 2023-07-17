import React, { useEffect, useState, useContext } from "react";
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

const AllReadyOrders = () => {
  const { userInfo } = useContext(StateContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});

  console.log(isEditModalOpen);
  console.log(selectedOrder);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(["orders", userInfo], async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/order/get-orders?sellerId=${
        userInfo?._id
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
    return response.json().then((data) => data.orders);
  });

  console.log(orders);

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
        console.log(data);
        refetch();
        toast.success("Order status updated successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to update order status");
      });
  };

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
            "Api-Key": import.meta.env.VITE_STEADFAST_API_KEY,
            "Secret-Key": import.meta.env.VITE_STEADFAST_SECRET_KEY,
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

  return (
    <div className="space-y-4">
      <EditOrderModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        setSelectedOrder={setSelectedOrder}
        selectedOrder={selectedOrder}
        refetch={refetch}
      />
      <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <InvoiceGenerator order={selectedOrder} />
      </ModalBox>
      <DeleteOrderModal
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        setSelectedOrder={setSelectedOrder}
        selectedOrder={selectedOrder}
        refetch={refetch}
      />
      <div className="flex items-start justify-between border-b py-3">
        <div>
          <p className="text-xl font-semibold">All Ready Orders</p>
          <p>Total Parcels: 1</p>
          <p>Total Sales: ৳0.00</p>
          <p>Total DC: ৳0.00</p>
          <p>Total COD: ৳0.00</p>
          <p>Total Advance: ৳0.00</p>
        </div>
        <div className="flex items-center gap-4">
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
        <div className="flex items-center gap-2">
          <p>Show</p>
          <select name="page" id="page" className="input-bordered input p-2">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <p>entries</p>
        </div>
        <div className="flex items-center gap-2">
          <p>Search</p>
          <input type="text" className="input-bordered input" />
        </div>
      </div>

      <div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead className="bg-primary text-white">
              <tr>
                <th>#</th>
                <th>Invoice</th>
                <th>Name</th>
                {/* <th>Prods/Pics</th> */}
                <th>Price</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {orders?.map((order, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <span
                      onClick={() => {
                        setIsModalOpen(!isModalOpen);
                        setSelectedOrder(order);
                      }}
                      className="p-1 text-2xl text-success"
                    >
                      <TbFileInvoice />
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
                    <div className="flex items-center gap-2">
                      <span
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsEditModalOpen(!isEditModalOpen);
                        }}
                        className="cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-neutral"
                      >
                        <AiOutlineEdit />
                      </span>
                      <span
                        onClick={() => {
                          handleOrderStatus(order._id, "completed");
                        }}
                        className="tooltip cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-info"
                        data-tip="Complete"
                      >
                        <FaCheck className="text-lg" />
                      </span>
                      {(!order?.courierStatus ||
                        order?.courierStatus === "returned") && (
                        <span
                          onClick={() => {
                            sendToCourier(order);
                          }}
                          className="tooltip cursor-pointer cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-info"
                          data-tip={`Send to ${order?.courier} `}
                        >
                          <GrDeliver className="text-lg" />
                        </span>
                      )}
                      <span
                        onClick={() => {
                          handleOrderStatus(order._id, "processing");
                        }}
                        className="tooltip cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-error"
                        data-tip="Back to Processing"
                      >
                        <RiArrowGoBackLine className="text-lg" />
                      </span>
                      <span
                        onClick={() => {
                          handleOrderStatus(order._id, "cancelled");
                        }}
                        className="tooltip cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-error"
                        data-tip="Cancel Order"
                      >
                        <FcCancel className="text-lg" />
                      </span>
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
                  <td>
                    <div className="flex flex-col">
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
            <tfoot className="bg-white">
              <tr>
                <th>Showing 1 to 2 of 2 entries</th>
                <th></th>
                <th></th>
                {/* <th></th> */}
                <th className="flex justify-end">
                  <div className="join">
                    <button className="join-item btn">Previous</button>
                    <button className="btn-primary join-item btn">1</button>
                    <button className="join-item btn ">Next</button>
                  </div>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllReadyOrders;
