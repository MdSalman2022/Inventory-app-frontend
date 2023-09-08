import React, { useEffect, useState, useContext } from "react";
import { AiOutlineEdit, AiOutlineShoppingCart } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import EditCustomerModal from "../../components/Main/Customers/EditCustomerModal";
import avatarIcon from "../../assets/shared/avatar.png";
import DeleteCustomerModal from "../../components/Main/Customers/DeleteCustomerModal";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { TbFileInvoice } from "react-icons/tb";
import InvoiceGenerator from "../../components/Main/shared/InvoiceGenerator/InvoiceGenerator";
import { StateContext } from "@/contexts/StateProvider/StateProvider";
import SingleInvoiceGenerator from "@/components/Main/shared/InvoiceGenerator/SingleInvoiceGenerator";

const CancelledOrders = () => {
  const { userInfo, selectedOrders, setSelectedOrders } =
    useContext(StateContext);
  const [selectedCustomer, setSelectedCustomer] = useState({});
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
      }&filter=cancelled`,
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

  return (
    <div className="w-screen p-3 md:w-full md:space-y-3">
      <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <div>
          <SingleInvoiceGenerator order={selectedOrder} />
        </div>
      </ModalBox>
      <DeleteCustomerModal
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        selectedCustomer={selectedCustomer}
        refetch={refetch}
      />
      <div className="flex flex-col items-start justify-between border-b md:flex-row">
        <div>
          <p className="text-xl font-semibold">Cancelled Orders</p>
          <p>Total Parcels: 1</p>
          <p>Total Sales: ৳0.00</p>
          <p>Total DC: ৳0.00</p>
          <p>Total COD: ৳0.00</p>
          <p>Total Advance: ৳0.00</p>
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
        <div className="my-2 flex items-center gap-2 md:my-0">
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
                  <td>{index + 1}</td>
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
                      </div>
                    </div>
                  </td>
                  <td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CancelledOrders;
