import React, { useContext, useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineShoppingCart } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import EditCustomerModal from "../../components/Main/Customers/EditCustomerModal";
import avatarIcon from "../../assets/shared/avatar.png";
import DeleteCustomerModal from "../../components/Main/Customers/DeleteCustomerModal";
import { useQuery } from "react-query";
import { StateContext } from "../../contexts/StateProvider/StateProvider";
import { Link, useNavigate } from "react-router-dom";
import { EditUserLog } from "@/utils/fetchApi";
import { FaSearch } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import StartOrderModal from "@/components/Main/StartOrder/StartOrderModal";
import { BsThreeDots } from "react-icons/bs";

const Customers = () => {
  const { userInfo, couriers, allCities } = useContext(StateContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});

  console.log(isEditModalOpen);
  console.log(selectedCustomer);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState([]);

  const navigate = useNavigate();

  if (userInfo?.role !== "Admin") {
    navigate("/start-order");
  }

  console.log(userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId);

  const {
    data: customers,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery("customers", async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/customer/get-customers?sellerId=${
        userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
      }`,
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
    return response.json().then((data) => data.customers);
  });

  console.log(customers);

  const handleExportClick = () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/customer/customer-export`, {
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

  const handleAddCustomer = (event) => {
    event.preventDefault();
    const imageHostKey = import.meta.env.VITE_IMGBB_KEY;

    const form = event.target;
    const name = form.name.value;
    const phone = form.phone.value;
    const district = selectedCity;
    const thana = selectedArea;
    const address = form.address.value;
    const link = form.link.value;
    const image = form?.image?.files[0];

    if (image) {
      const formData = new FormData();
      formData.append("image", image);
      const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((imgUpload) => {
          if (imgUpload.success) {
            const customer = {
              image: imgUpload.data.url,
              name,
              phone,
              location: district,
              thana,
              address,
              link,
              sellerId:
                userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId,
            };

            console.log(customer);
            addCustomer(customer);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong");
        });
    } else {
      const customer = {
        image: "", // Set empty string for image
        name,
        phone,
        location: district,
        thana,
        address,
        link,
        sellerId:
          userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId,
      };

      console.log("customer", customer);
      addCustomer(customer);
    }
  };

  const addCustomer = (customer) => {
    console.log("customer", customer);
    fetch(`${import.meta.env.VITE_SERVER_URL}/customer/create-customer`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(customer),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toast.success(`${customer.name} is added successfully`);
          refetch();
          setIsModalOpen(false);
          EditUserLog(
            userInfo?._id,
            "Added a customer",
            `${customer?.name} added`
          );
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault(); // prevent page refresh on form submit
    const form = e.target;
    const customerSearchKey = form["search-key"].value;

    console.log(customerSearchKey);

    setIsSearchModalOpen(false);

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
        console.log(data.customers);
        if (data.success) {
          toast.success("Customer Found!!");
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
  console.log(searchResults.length);

  console.log("customers ", customers);
  const [isStartNewOrderOpen, setIsStartNewOrderOpen] = useState(false);

  console.log("new order modal open ", isStartNewOrderOpen);

  // Function to handle city selection
  const handleCityChange = (e) => {
    const selectedCityName = e.target.value;
    console.log("selectedCityName", selectedCityName);
    setSelectedCity(selectedCityName);

    const cityObject = allCities.find((city) => city.City === selectedCityName);

    if (cityObject) {
      setSelectedAreas(cityObject.Area);
    } else {
      setSelectedAreas([]);
    }
  };

  console.log("selectedCity", selectedCity);
  console.log("selectedArea", selectedArea);

  const inputBox = "input-bordered input focus-within:outline-none";

  function formatTimestamp(timestamp) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const date = new Date(timestamp);
    return date.toLocaleString("en-US", options);
  }

  return (
    <div className="w-screen space-y-3 px-3 md:w-full">
      <EditCustomerModal
        setIsEditModalOpen={setIsEditModalOpen}
        isEditModalOpen={isEditModalOpen}
        selectedCustomer={selectedCustomer}
        refetch={refetch}
      />
      <DeleteCustomerModal
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        selectedCustomer={selectedCustomer}
        refetch={refetch}
      />
      <StartOrderModal
        isStartNewOrderOpen={isStartNewOrderOpen}
        setIsStartNewOrderOpen={setIsStartNewOrderOpen}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
      />
      <div className="flex w-full flex-col gap-3 border-b pb-3 md:flex-row md:justify-between md:gap-0">
        <p className="flex items-center text-xl font-semibold">
          Customers List
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExportClick}
            className="btn-primary btn-outline btn-sm btn md:btn-md"
          >
            Export
          </button>
          {/* Open the modal using ID.showModal() method */}

          {/* The button to open modal */}
          <label
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="btn-primary btn-outline btn-sm btn md:btn-md"
          >
            Add Customer
          </label>
          <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
            <div className="w-80 bg-base-100 md:w-96">
              <p className="w-full p-5 text-2xl font-semibold shadow">
                Customer Information
              </p>
              <div>
                <form
                  onSubmit={handleAddCustomer}
                  className="flex flex-col gap-3 p-5"
                >
                  <input
                    className={inputBox}
                    type="text"
                    name="name"
                    placeholder="Facebook Name"
                  />
                  <input
                    className={inputBox}
                    type="text"
                    name="phone"
                    placeholder="Phone"
                  />
                  <input
                    className={inputBox}
                    type="text"
                    name="address"
                    placeholder="Address"
                  />

                  <div className="flex gap-3">
                    <select
                      className="select-bordered select h-10 w-full max-w-xs focus-within:outline-none"
                      name="district"
                      onChange={handleCityChange}
                      value={selectedCity}
                    >
                      <option value="" disabled>
                        Select an District
                      </option>
                      {allCities.map((city, index) => (
                        <option key={index} value={city.City}>
                          {city.City}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <select
                      className="select-bordered select h-10 w-full max-w-xs focus-within:outline-none"
                      name="thana"
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      disabled={selectedCity === ""}
                    >
                      <option value="" disabled>
                        Select an Thana
                      </option>
                      {selectedAreas.map((area, index) => (
                        <option key={index} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    className={inputBox}
                    type="text"
                    name="link"
                    placeholder="Facebook inbox link"
                  />
                  <div>
                    <div className="flex w-full justify-between gap-3">
                      <label
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="btn"
                      >
                        Close!
                      </label>
                      <button
                        type="submit"
                        className="btn-success btn-outline btn"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </ModalBox>
        </div>
      </div>
      <div className="my-2 flex justify-between">
        <div className="flex items-center gap-2">
          <p>Show</p>
          <select
            name="page"
            id="page"
            className="input-bordered input select select-sm md:select-md"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <p>Search</p>
          <form onSubmit={handleSearch}>
            <input
              name="search-key"
              type="text"
              className="input-bordered input"
            />
          </form>
        </div>
        <div className="flex items-center md:hidden">
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
                <form onSubmit={handleSearch} className="w-full">
                  <div className="flex w-full items-center justify-between gap-3">
                    <input
                      name="search-key"
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
          <table className="table-pin-rows table-pin-cols table">
            {/* head */}
            <thead className=" text-white">
              <tr>
                <th className="rounded-tl-lg bg-primary">#</th>
                <th className=" bg-primary">Customer Details</th>
                <th className="bg-primary">Purchase</th>
                <th className="bg-primary">Orders</th>
                <th className="rounded-tr-lg bg-primary">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {searchResults.length > 0
                ? searchResults.map((customer, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="flex flex-col gap-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <Link
                              to={`profile/${customer?._id}`}
                              className="font-bold text-info"
                            >
                              {customer?.customer_details?.name}
                            </Link>
                            <div className="text-sm opacity-50">
                              {customer?.customer_details?.location}
                            </div>
                            <div className="text-sm opacity-50">
                              {customer?.customer_details?.address}
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
                        <div>Total: {customer?.purchase?.total}</div>
                        {customer?.purchase?.last_purchase ? (
                          <div>
                            Last purchase:{" "}
                            {formatTimestamp(customer?.purchase?.last_purchase)}
                          </div>
                        ) : (
                          <></>
                        )}
                      </td>
                      <td>
                        <div>
                          <p>Processing: {customer?.orders?.processing}</p>
                          {customer?.orders?.ready ? (
                            <p>Ready: {customer?.orders?.ready}</p>
                          ) : (
                            <p>Ready: 0</p>
                          )}

                          {customer?.orders?.completed ? (
                            <p>Completed: {customer?.orders?.completed}</p>
                          ) : (
                            <p>Completed: 0</p>
                          )}
                          {customer?.orders?.returned ? (
                            <p>Returned: {customer?.orders?.returned}</p>
                          ) : (
                            <p>Returned: 0</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                : customers?.map((customer, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="flex flex-col gap-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <Link
                              to={`profile/${customer?._id}`}
                              className="font-bold text-info"
                            >
                              {customer?.customer_details?.name}
                            </Link>
                            <div className="text-sm opacity-50">
                              {customer?.customer_details?.location}
                            </div>
                            <div className="text-sm opacity-50">
                              {customer?.customer_details?.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>Total: {customer?.purchase?.total}</div>
                        {customer?.purchase?.last_purchase ? (
                          <div>
                            Last purchase:{" "}
                            {formatTimestamp(customer?.purchase?.last_purchase)}
                          </div>
                        ) : (
                          <></>
                        )}
                      </td>
                      <td>
                        <div>
                          <p>Processing: {customer?.orders?.processing}</p>
                          {customer?.orders?.ready ? (
                            <p>Ready: {customer?.orders?.ready}</p>
                          ) : (
                            <p>Ready: 0</p>
                          )}

                          {customer.orders?.completed ? (
                            <p>Completed: {customer?.orders?.completed}</p>
                          ) : (
                            <p>Completed: 0</p>
                          )}
                          {customer?.orders?.returned ? (
                            <p>Returned: {customer?.orders?.returned}</p>
                          ) : (
                            <p>Returned: 0</p>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="dropdown-bottom dropdown">
                          <label tabIndex={0} className="btn-sm btn m-1">
                            <BsThreeDots size={18} />
                          </label>
                          <ul
                            tabIndex={0}
                            className="dropdown-content rounded-box z-[1] flex w-full items-center justify-center gap-1 bg-base-100  p-1 shadow"
                          >
                            <li
                              onClick={() => {
                                if (couriers && couriers.length > 0) {
                                  setSelectedCustomer(customer);
                                  setIsStartNewOrderOpen(true);
                                } else {
                                  toast.error("Please add a courier first!!");
                                }
                              }}
                              className="flex w-full cursor-pointer justify-center rounded-lg bg-green-100 px-3 "
                            >
                              <span className="flex justify-center">
                                <AiOutlineShoppingCart className="text-2xl text-success " />
                              </span>
                            </li>
                            <li
                              onClick={() => {
                                setIsEditModalOpen(true);
                                setSelectedCustomer(customer);
                              }}
                              className="flex w-full cursor-pointer justify-center rounded-lg bg-yellow-100  px-3"
                            >
                              <span className="flex justify-center">
                                <AiOutlineEdit className="text-2xl text-warning " />
                              </span>
                            </li>
                            <li
                              onClick={() => {
                                setIsDeleteModalOpen(true);
                                setSelectedCustomer(customer);
                              }}
                              className="flex w-full cursor-pointer justify-center rounded-lg bg-red-100 px-3"
                            >
                              <span className="flex justify-center">
                                <RiDeleteBin6Line className="text-2xl text-error  " />
                              </span>
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

export default Customers;
