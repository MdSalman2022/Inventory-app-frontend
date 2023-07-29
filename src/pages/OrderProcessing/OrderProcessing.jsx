import React, { useContext, useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineShoppingCart } from "react-icons/ai";
import { RiArrowGoBackLine, RiDeleteBin6Line } from "react-icons/ri";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import EditCustomerModal from "../../components/Main/Customers/EditCustomerModal";
import avatarIcon from "../../assets/shared/avatar.png";
import DeleteCustomerModal from "../../components/Main/Customers/DeleteCustomerModal";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { TbFileInvoice } from "react-icons/tb";
import { FaCheck } from "react-icons/fa";
import DeleteOrderModal from "../../components/Main/Orders/DeleteOrderModal";
import InvoiceGenerator from "../../components/Main/shared/InvoiceGenerator/InvoiceGenerator";
import { StateContext } from "@/contexts/StateProvider/StateProvider";
import SingleInvoiceGenerator from "@/components/Main/shared/InvoiceGenerator/SingleInvoiceGenerator";
import EditOrderModal from "@/components/Main/Orders/EditOrderModal";

const OrderProcessing = () => {
  const { userInfo, selectedOrders, setSelectedOrders } =
    useContext(StateContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    return response.json().then((data) => data.orders);
  });

  console.log(orders);

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

  const handleOrderStatus = (order) => {
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
        orderStatus: "ready",
        updatedBy: userInfo?.username,
        updatedById: userInfo?._id,
        update: {
          orderStatus: "ready",
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
    <div className="space-y-4">
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
      <div className="flex items-start justify-between border-b py-3">
        <div>
          <p className="text-xl font-semibold">Order Processing</p>
          <p>Total Parcels: 0</p>
          <p>Total Sales: ৳0.00</p>
          <p>Total DC: ৳0.00</p>
          <p>Total COD: ৳0.00</p>
          <p>Total Advance: ৳0.00</p>
        </div>
        <div className="flex items-center gap-4">
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
        <form onSubmit={SearchOrderById} className="flex items-center gap-2">
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
                        setSelectedOrders(orders);
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                    checked={selectedOrders?.length === orders?.length}
                    className="checkbox border border-white"
                  />
                </td>
                <th>#</th>
                <th>Invoice</th>
                <th>Name</th>
                {/* <th>Prods/Pics</th> */}
                <th>Price</th>
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
                        <div
                          onClick={() => {
                            handleOrderStatus(order);
                          }}
                          className="tooltip cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-info"
                          data-tip="Ready"
                        >
                          <FaCheck className="text-lg" />
                        </div>
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
                      </div>
                    </td>
                    {/* <td></td> */}
                    <td>
                      <div className="flex flex-col">
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
                  </tr>
                )
              )}
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

export default OrderProcessing;
