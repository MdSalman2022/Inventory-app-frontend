import React, { useContext, useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineShoppingCart } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import EditCustomerModal from "../../components/Main/Customers/EditCustomerModal";
import avatarIcon from "../../assets/shared/avatar.png";
import DeleteCustomerModal from "../../components/Main/Customers/DeleteCustomerModal";
import StartOrderModal from "../../components/Main/StartOrder/StartOrderModal";
import { StateContext } from "@/contexts/StateProvider/StateProvider";
import { Link } from "react-router-dom";

const StartOrder = () => {
  const { userInfo, couriers } = useContext(StateContext);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault(); // prevent page refresh on form submit
    const form = e.target;
    const customerSearchKey = form["search-key"].value;

    console.log(customerSearchKey);

    let url = `${
      import.meta.env.VITE_SERVER_URL
    }/customer/search-customer?sellerId=${
      userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
    }&`;

    if (customerSearchKey.match(/^\d+$/)) {
      url += `phonenumber=${customerSearchKey}`;
      console.log(url);
    } else {
      url += `name=${customerSearchKey}`;
      console.log(url);
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          toast.success("Customer Found!!");
          if (customerSearchKey.match(/^\d+$/)) {
            setIsStartNewOrderOpen(true);
            setSelectedCustomer(data.customers[0]);
          }
          setSearchResults(data.customers);
        } else {
          toast.error("Customer Not Found!!");
          setSearchResults([]);
        }
      })
      .catch((error) => {
        console.error("Error searching for customers:", error);
        setSearchResults([]);
      });
  };

  console.log(searchResults);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});

  console.log(isEditModalOpen);
  console.log(selectedCustomer);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isStartNewOrderOpen, setIsStartNewOrderOpen] = useState(false);

  console.log("couriers ", couriers);
  console.log("couriers length ", couriers?.length);

  return (
    <div className="flex flex-col gap-3">
      <EditCustomerModal
        setIsEditModalOpen={setIsEditModalOpen}
        isEditModalOpen={isEditModalOpen}
        selectedCustomer={selectedCustomer}
      />
      <DeleteCustomerModal
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        selectedCustomer={selectedCustomer}
      />
      <StartOrderModal
        isStartNewOrderOpen={isStartNewOrderOpen}
        setIsStartNewOrderOpen={setIsStartNewOrderOpen}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
      />
      <p className="font-medium">Start Order</p>
      <hr />
      <p>Please enter Customer Phone Number or Facebook Name!!</p>
      <form onSubmit={handleSearch} className="flex flex-col gap-5">
        <input
          className="input-bordered input-primary input w-1/2"
          type="text"
          name="search-key"
          placeholder="Name or Phone Number (any one)"
        />
        <button type="submit" className="btn-primary btn w-1/2">
          Search
        </button>
      </form>
      <div className="flex items-center gap-2">
        আপনি যে কাস্টমার খুঁজছেন তিনি তালিকায় আছে কি না দেখুন। না থাকলে এখানে
        <button
          onClick={() => {
            couriers?.length > 0
              ? setIsStartNewOrderOpen(true)
              : toast.error("Please add a courier first!!");
          }}
          className="btn-info btn p-2"
        >
          Start New Order
        </button>
        ক্লিক করুন।
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead className="bg-primary text-white">
            <tr>
              <th>Customer Details</th>
              <th>Purchase</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {searchResults.map((customer, index) => (
              <tr key={index}>
                <td className="flex flex-col gap-1">
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={customer.customer_details.image || avatarIcon}
                          alt="image"
                          className="rounded-full border-2 border-primary p-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Link
                        to={`/customer/profile/${customer?._id}`}
                        className="font-bold text-info"
                      >
                        {customer?.customer_details?.name}
                      </Link>
                      <div className="text-sm opacity-50">
                        {customer.customer_details.location}
                      </div>
                      <div className="text-sm opacity-50">
                        {customer.customer_details.address}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      onClick={() => {
                        if (couriers && couriers.length > 0) {
                          setSelectedCustomer(customer);
                          setIsStartNewOrderOpen(true);
                        } else {
                          toast.error("Please add a courier first!!");
                        }
                      }}
                      className="cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-success"
                    >
                      <AiOutlineShoppingCart />
                    </span>
                    <span
                      onClick={() => {
                        setIsEditModalOpen(true);
                        setSelectedCustomer(customer);
                      }}
                      className="cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-info"
                    >
                      <AiOutlineEdit />
                    </span>
                    <span
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setSelectedCustomer(customer);
                      }}
                      className="cursor-pointer rounded-full border border-gray-500 p-1 text-2xl text-error"
                    >
                      <RiDeleteBin6Line />
                    </span>
                  </div>
                </td>
                <td>
                  <div>Total: {customer.purchase.total}</div>
                  {customer?.purchase?.last_purchase ? (
                    <div>
                      Last purchase: {customer?.purchase?.last_purchase.name}
                    </div>
                  ) : (
                    <></>
                  )}
                </td>
                <td>
                  <div>
                    <p>Processing: {customer.orders.processing}</p>
                    {customer.orders.ready ? (
                      <p>Ready: {customer.orders.ready}</p>
                    ) : (
                      <p>Ready: 0</p>
                    )}

                    {customer.orders.completed ? (
                      <p>Completed: {customer.orders.completed}</p>
                    ) : (
                      <p>Completed: 0</p>
                    )}
                    {customer.orders.returned ? (
                      <p>Returned: {customer.orders.returned}</p>
                    ) : (
                      <p>Returned: 0</p>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-white">
            <tr>
              <th>Showing 1 to 2 of 2 entries</th>
              <th></th>
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
  );
};

export default StartOrder;
