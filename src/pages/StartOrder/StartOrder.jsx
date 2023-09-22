import React, { useContext, useEffect, useRef, useState } from "react";
import {
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RiBarcodeLine, RiDeleteBin6Line } from "react-icons/ri";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import EditCustomerModal from "../../components/Main/Customers/EditCustomerModal";
import avatarIcon from "../../assets/shared/avatar.png";
import DeleteCustomerModal from "../../components/Main/Customers/DeleteCustomerModal";
import StartOrderModal from "../../components/Main/StartOrder/StartOrderModal";
import { StateContext } from "@/contexts/StateProvider/StateProvider";
import { Link } from "react-router-dom";
import { SlCalender } from "react-icons/sl";
import { IoPersonAdd } from "react-icons/io5";
import { EditUserLog } from "@/utils/fetchApi";
import { FaMinus } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { RxCross2 } from "react-icons/rx";
import { CgLayoutGrid } from "react-icons/cg";

const StartOrder = () => {
  const { userInfo, couriers } = useContext(StateContext);
  const [searchCustomerResults, setSearchCustomerResults] = useState([]);
  const [searchProductsResults, setSearchProductsResults] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStartNewOrderOpen, setIsStartNewOrderOpen] = useState(false);

  const { products, refetchProducts, stores } = useContext(StateContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [cashCollect, setCashCollect] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [inputDeliveryCharge, setInputDeliveryCharge] = useState(0);
  const [discountType, setDiscountType] = useState("Fixed");
  const [newCustomerId, setNewCustomerId] = useState("");
  const [district, setDistrict] = useState(
    selectedCustomer?.customer_details?.location ?? ""
  );
  const [courier, setCourier] = useState("");
  const [store, setStore] = useState({});
  const [discountOnAll, setDiscountOnAll] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [salesDate, setSalesDate] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [paymentType, setPaymentType] = useState("");

  console.log("salesDate", salesDate);
  console.log("reference", referenceNo);

  useEffect(() => {
    // Get today's date and format it as "YYYY-MM-DD"
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    setSalesDate(formattedDate); // Set the default value to today's date
  }, []);

  const handleDateChange = (e) => {
    setSalesDate(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault(); // prevent page refresh on form submit
    const form = e.target;
    const customerSearchKey = form["searchCustomer"].value;

    console.log("userInfo?.sellerId", userInfo?.sellerId);
    console.log("userInfo?._id", userInfo?._id);

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
            // setIsStartNewOrderOpen(true);
            setSelectedCustomer(data.customers[0]);
          }
          setSearchCustomerResults(data.customers);
        } else {
          toast.error("Customer Not Found!!");
          setSearchCustomerResults([]);
          if (customerSearchKey.match(/^\d+$/)) {
            setIsStartNewOrderOpen(true);
            setSelectedCustomer({
              customer_details: {
                name: "",
                phone: customerSearchKey,
                image: "",
              },
              _id: "",
            });
          }
        }
      })
      .catch((error) => {
        console.error("Error searching for customers:", error);
        setSearchCustomerResults([]);
      });
  };

  const setDiscountValue = (productId, value) => {
    // Parse the input value as a number
    const numericValue = parseFloat(value);

    if (!isNaN(numericValue)) {
      const updatedProductList = productList.map((product) => {
        if (product._id === productId) {
          return { ...product, discount: numericValue };
        }
        return product;
      });

      setProductList(updatedProductList);
    }
  };

  useEffect(() => {
    if (selectedCustomer?._id) {
      setDistrict(selectedCustomer?.customer_details?.location);
    }
  }, [selectedCustomer]);

  const formRef = useRef(null);

  console.log("deliveryCharge", deliveryCharge);
  console.log("inputDeliveryCharge", typeof inputDeliveryCharge);

  const activeCouriers =
    couriers?.filter((courier) => courier?.status === true) ?? [];
  console.log(activeCouriers);

  console.log("discount type", discountType);
  useEffect(() => {
    if (discountType === "Fixed") {
      setDiscountOnAll(discountAmount);
    } else if (discountType === "Percentage") {
      const value = (subTotal * discountAmount) / 100;
      setDiscountOnAll((subTotal * discountAmount) / 100);
    }

    console.log("discount on all", discountOnAll);
  }, [discountAmount, discountType, subTotal]);

  useEffect(() => {
    if (district && courier) {
      const courierInfo = activeCouriers.find((c) => c?.name === courier);
      console.log("courier info ", courierInfo);
      if (inputDeliveryCharge) {
        setDeliveryCharge(inputDeliveryCharge);
      } else {
        setDeliveryCharge(
          district === "Dhaka"
            ? courierInfo?.chargeInDhaka
            : courierInfo?.chargeOutsideDhaka
        );
      }

      console.log(deliveryCharge);
    }
  }, [district, courier, deliveryCharge, activeCouriers, inputDeliveryCharge]);

  useEffect(() => {
    setIsModalOpen(isStartNewOrderOpen);
  }, [isStartNewOrderOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      setIsStartNewOrderOpen(isModalOpen);
    }
  }, [isModalOpen]);

  console.log("deliveryCharge ", deliveryCharge);
  console.log("product list ", productList);

  const handleSearchProduct = (e) => {
    e.preventDefault(); // prevent page refresh on form submit
    const form = e.target;
    const customerSearchKey = form["search-key"].value;

    console.log(customerSearchKey);

    let url = `${
      import.meta.env.VITE_SERVER_URL
    }/product/search-product?sellerId=${
      userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
    }&`;

    url += `name=${customerSearchKey}`;
    console.log(url);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          toast.success("Products Found!!");
          setSearchProductsResults(data.products);
        } else {
          toast.error("Customer Not Found!!");
          setSearchProductsResults([]);
        }
      })
      .catch((error) => {
        console.error("Error searching for customers:", error);
        setSearchProductsResults([]);
      });
  };

  console.log("search results ", searchCustomerResults);
  console.log("search products results ", searchProductsResults);

  console.log("selected customer ", selectedCustomer);

  const handleOrder = (e) => {
    e.preventDefault();

    if (!selectedCustomer?._id) {
      toast.error("Please select a customer first");
    } else {
      const order = {
        image: "",
        customerId: selectedCustomer?._id,
        name: selectedCustomer?.customer_details?.name,
        phone: selectedCustomer?.customer_details?.phone,
        refNo: referenceNo,
        paymentType,
        address: selectedCustomer?.customer_details?.address,
        district: selectedCustomer?.customer_details?.location,
        thana: selectedCustomer?.customer_details?.thana,
        sellerId:
          userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId,
        storeId: stores[0]?._id,
        store: stores[0],
        products: productList,
        quantity: productList.length,
        courier,
        deliveryCharge,
        discount,
        total: totalPrice,
        advance,
        cash: cashCollect,
        // instruction,
        createdBy: userInfo?.username,
        createdById: userInfo?._id,
        salesDate,
        timestamp: new Date().toISOString(),
      };
      const customerInfo = {
        id: selectedCustomer?._id,
        image: selectedCustomer?.image || "",
        name: selectedCustomer?.customer_details?.name,
        phone: selectedCustomer?.customer_details?.phone,
        address: selectedCustomer?.customer_details?.address,
        location: district,
        total:
          parseInt(selectedCustomer?.purchase?.total) +
          totalPrice +
          deliveryCharge -
          discountOnAll -
          discount,
        order,
        storeId: stores[0]?.storeId,
        processingCount: selectedCustomer?.orders?.processing + 1,
        readyCount: selectedCustomer?.orders?.ready,
        completedCount: selectedCustomer?.orders?.completed,
        returnedCount: selectedCustomer?.orders?.returned,
      };

      console.log(
        "order for if image is not uploaded but selected customer true",
        order,
        customerInfo
      );

      addOrder(order);
      updateCustomer(customerInfo);
    }
  };

  const addOrder = (order) => {
    console.log("order", order);
    fetch(`${import.meta.env.VITE_SERVER_URL}/order/create-order`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log("added order info", result);

        if (result.success) {
          const allProducts = order.products;

          // console.log("my order", order);

          EditUserLog(
            userInfo?._id,
            "Created an order",
            `${result?.orderId} order created`
          );
          fetch(
            `${
              import.meta.env.VITE_SERVER_URL
            }/product/put-update-available-stock`,
            {
              method: "PUT",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({ allProducts }),
            }
          )
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              if (result.success) {
                refetchProducts();
                toast.success("Stock is updated successfully");
              } else {
                console.log("Something went wrong stock update");
                toast.error("Something went wrong stock update");
              }
            })
            .catch((err) => {
              console.log(err);
              toast.error(
                "Something went wrong with creating order in steadfast"
              );
            });
          setIsModalOpen(false);
        } else {
          toast.error("Something went wrong adding order");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong adding order function");
      });
  };
  const updateCustomer = (customer) => {
    console.log("customer ", customer);
    console.log(customer?._id);
    fetch(
      `${import.meta.env.VITE_SERVER_URL}/customer/edit-customer-info?id=${
        customer?.id
      }`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(customer),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        // console.log("my customer", customer);
        if (result.success) {
          toast.success(`${customer?.name} is updated successfully`);
          setIsModalOpen(false);
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  let priceList = new Array(productList.length);

  console.log("priceList", priceList);

  useEffect(() => {
    if (productList.length > 0) {
      const total = productList.reduce(
        (total, product) => total + product.salePrice * product.quantity,
        0
      );

      setTotalPrice(total);
      // const totalAfterDiscount = total - discount;
      // const totalAfterDeliveryCharge =
      // totalAfterDiscount + parseInt(deliveryCharge);
      // console.log("total ", total);
      // console.log("advance ", advance);
      // console.log("discount ", discount);
      // console.log("delivery charge ", deliveryCharge);
      const subtotalPrice = total - discount;
      setSubTotal(subtotalPrice);
      const totalAfterAdvance =
        subtotalPrice - advance - discountOnAll + deliveryCharge;
      console.log(totalAfterAdvance);
      setCashCollect(totalAfterAdvance);
    } else {
      setTotalPrice(0);
      setCashCollect(0);
    }
  }, [productList, discount, deliveryCharge, advance, discountOnAll]);

  // console.log(cashCollect);
  // console.log(totalPrice);

  const handleSelectedProductList = (product) => {
    const existingProduct = productList.find((p) => p._id === product._id);

    if (existingProduct) {
      const updatedProductList = productList.map((p) =>
        p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
      );
      setProductList(updatedProductList);
    } else {
      const newProduct = { ...product, quantity: 1 };
      setProductList([...productList, newProduct]);
    }
  };

  const handleQuantityChange = (productId, quantity, price) => {
    const totalPrice = parseInt(quantity) * parseInt(price);
    const updatedProductList = productList.map((product) =>
      product._id === productId ? { ...product, quantity, totalPrice } : product
    );
    setProductList(updatedProductList);
  };

  const handleRemoveProduct = (productId) => {
    setProductList(productList.filter((product) => product._id !== productId));
  };

  console.log("productList", productList);

  const [error, setError] = useState("");

  // console.log(selectedCustomer);

  console.log("couriers ", couriers);

  useEffect(() => {
    const newDiscounts = productList.map((product) => {
      const discountValue = parseFloat(product.discount);
      return !isNaN(discountValue) ? discountValue : 0; // Default to 0 for invalid discounts
    });

    const totalDiscount = newDiscounts.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    setDiscount(totalDiscount);
  }, [productList]);

  console.log("discountOnAll", discountOnAll);

  useEffect(() => {
    if (selectedCustomer?.customer_details?.location && courier) {
      const courierInfo = activeCouriers.find((c) => c?.name === courier);
      console.log("courier info ", courierInfo);
      if (inputDeliveryCharge) {
        setDeliveryCharge(inputDeliveryCharge);
      } else {
        setDeliveryCharge(
          selectedCustomer?.customer_details?.location === "Dhaka"
            ? courierInfo?.chargeInDhaka
            : courierInfo?.chargeOutsideDhaka
        );
      }

      console.log(deliveryCharge);
    }
  }, [
    district,
    courier,
    deliveryCharge,
    activeCouriers,
    selectedCustomer,
    inputDeliveryCharge,
  ]);

  const inputRef = useRef();

  return (
    <div className="flex w-screen flex-col px-4 py-6 md:w-full md:px-2">
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
      <span className="text-xl font-medium">Start Order</span>
      <hr />
      <div className="flex flex-col gap-3">
        <div className="flex grid-cols-3 flex-col gap-2 py-2 md:grid">
          <div className="col-span-2 flex w-full flex-col gap-2">
            <div className="flex flex-col">
              <label htmlFor="">Customer Name*</label>
              <div className="relative">
                <form
                  onSubmit={handleSearch}
                  className="top-0 flex w-full flex-col gap-2 md:absolute"
                >
                  <div className="join relative">
                    <input
                      type="text"
                      className="input-bordered input join-item w-full focus-within:outline-none md:w-[60%]"
                      placeholder="Name Or Phone Number (any one)"
                      name="searchCustomer"
                      value={selectedCustomer?.customer_details?.name}
                      ref={inputRef}
                      required
                    />
                    {(selectedCustomer?.customer_details?.name ||
                      inputRef?.current?.value) && (
                      <RxCross2
                        onClick={() => {
                          setSelectedCustomer({});
                          inputRef.current.value = "";
                          inputRef.current.focus();
                        }}
                        className="absolute right-[42%] top-3.5 cursor-pointer rounded-full bg-base-200 p-1 text-2xl"
                      />
                    )}
                    <span
                      onClick={() => setIsStartNewOrderOpen(true)}
                      className="join-item btn rounded "
                    >
                      <IoPersonAdd className="text-xl" />
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="btn-primary btn w-full md:w-[60%]"
                  >
                    Search
                  </button>
                </form>
                {searchCustomerResults.length > 0 && (
                  <div className="absolute top-12 z-50 flex flex-col rounded-lg border border-primary bg-white p-3 py-0 md:w-[60%]">
                    {searchCustomerResults?.slice(0, 5)?.map((customer) => (
                      <div
                        onClick={() => {
                          setSelectedCustomer(customer);

                          setSearchCustomerResults([]);
                        }}
                        className="cursor-pointer border-b px-3 py-1 transition-all duration-300 hover:bg-base-100"
                        key={customer?._id}
                      >
                        <p>
                          {customer?.customer_details?.name} -{" "}
                          {customer?.customer_details?.phone} -{" "}
                          {customer?.customer_details?.location}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <div className="flex flex-col">
              <label htmlFor="">Sales Date*</label>
              <div className="join">
                <button className="join-item btn rounded">
                  <SlCalender className="text-xl" />
                </button>
                {/* <input
                  type="date"
                  id="salesDate"
                  name="salesDate"
                  onChange={handleDateChange}
                  defaultValue={""}
                  className="input-bordered input join-item w-full"
                ></input> */}
                <input
                  type="date"
                  id="salesDate"
                  name="salesDate"
                  onChange={handleDateChange}
                  value={salesDate} // Use value to reflect the state
                  className="input-bordered input join-item w-full"
                />
              </div>
            </div>
            <input
              type="text"
              className="input-bordered input join-item focus-within:outline-none"
              placeholder="Reference No."
              name="refNo"
              onChange={(e) => setReferenceNo(e.target.value)}
              required
            />
          </div>
          <div className="col-span-3 flex flex-col">
            <label htmlFor="">Product Name</label>
            <div className="join w-full">
              <button className="join-item btn rounded">
                <RiBarcodeLine className="text-3xl" />
              </button>
              <form
                onSubmit={handleSearchProduct}
                className="relative flex w-full flex-col"
              >
                <input
                  type="text"
                  className="input-bordered input-primary input join-item w-full border-gray-300 focus-within:outline-none"
                  placeholder="Item name / Barcode / Item code"
                  name="search-key"
                />
                {searchProductsResults.length > 0 && (
                  <div className="absolute top-12 z-50 flex w-full flex-col rounded-lg border border-primary bg-white p-3 py-0">
                    {searchProductsResults?.map((product) => (
                      <div
                        onClick={() => {
                          if (product.availableQty > 0) {
                            handleSelectedProductList(product);
                            setSearchProductsResults([]);
                          } else {
                            toast.error("Product is out of stock");
                          }
                        }}
                        className="cursor-pointer border-b px-3 py-1 transition-all duration-300 hover:bg-base-100"
                        key={product?._id}
                      >
                        <p>
                          {product?.name} - {product?.salePrice}Tk -{" "}
                          {product?.availableQty} Piece
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5  py-2">
          <div className="flex flex-col gap-3 overflow-x-auto">
            <table className="table-sm table">
              <thead className="bg-primary text-white">
                <tr className="">
                  <th className="text-center font-medium">Item Name</th>
                  <th className="text-center font-medium">Quantity</th>
                  <th className="text-center font-medium">Unit Price</th>
                  <th className="text-center font-medium">Discount</th>
                  <th className="text-center font-medium">Total Amount</th>
                  <th className="text-center font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {productList?.map((product, index) => (
                  <tr key={product._id} className="">
                    <td className="w-full text-start">{product.name}</td>
                    {/* quantity */}
                    <td className="w-full text-center">
                      <input
                        type="number"
                        className="input-bordered input input-sm w-60"
                        placeholder="Quantity"
                        min={1}
                        max={parseInt(product.availableQty)}
                        value={product.quantity}
                        onChange={(e) => {
                          // handleQuantityChange(product._id, e.target.value);

                          handleQuantityChange(
                            product._id,
                            e.target.value,
                            product.salePrice
                          );
                          setError(
                            e.target.value > parseInt(product.availableQty)
                              ? "Quantity can't be more than available quantity"
                              : ""
                          );
                        }}
                      />
                    </td>
                    <td className="w-full text-center">
                      ৳ {product.salePrice}
                    </td>
                    {/* discount */}
                    <td className="w-full text-center">
                      <input
                        type="number"
                        className="input-bordered input input-sm"
                        placeholder="Discount"
                        name="discount"
                        onChange={(e) =>
                          setDiscountValue(product._id, e.target.value)
                        }
                        defaultValue={0}
                      />
                    </td>
                    {/* total */}
                    <td className="w-full text-center">
                      <input
                        type="number"
                        className="input-bordered input input-sm"
                        placeholder="Total Bill"
                        name="totalBill"
                        value={
                          product.discount
                            ? product.totalPrice - product.discount ||
                              product.salePrice - product.discount
                            : product.totalPrice || product.salePrice
                        }
                        readOnly
                      />
                    </td>

                    <td
                      onClick={() => handleRemoveProduct(product._id)}
                      className="flex items-center justify-center text-white"
                    >
                      <div className="cursor-pointer rounded-full bg-error p-1">
                        {/* <RiDeleteBin6Line /> */}
                        <FaMinus className="text-2xl" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-start gap-10 md:flex-row md:items-center md:justify-between md:gap-0">
            <div className="flex flex-col">
              <div className="flex flex-col gap-1">
                <div className="flex p-1">
                  <p className="md:w-60">Quantity: {productList?.length}</p>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                      <p>Discount on all: </p>
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="Discount Amount"
                          onChange={(e) => setDiscountAmount(e.target.value)}
                          className="border-r-none input-primary input rounded-r-none border border-gray-300 bg-white focus-within:outline-none md:w-[238px]"
                        />
                        <select
                          onChange={(e) => setDiscountType(e.target.value)}
                          className="join-item cursor-pointer rounded-lg rounded-l-none border px-3.5 outline-none focus-within:outline-none"
                        >
                          <option className="" value="Fixed">
                            Fixed
                          </option>
                          <option className="" value="Percentage">
                            Per %
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                    <p>Payment Type: </p>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Advance Amount"
                        onChange={(e) => setAdvance(e.target.value)}
                        className="border-r-none input-primary input rounded-r-none border border-gray-300 bg-white focus-within:outline-none md:w-60"
                      />
                      <select
                        onChange={(e) => setPaymentType(e.target.value)}
                        className="join-item cursor-pointer rounded-lg rounded-l-none border px-2.5 outline-none focus-within:outline-none"
                      >
                        <option value="COD">COD</option>
                        <option value="bKash">bKash</option>
                        <option value="Nagad">Nagad</option>
                        <option value="Rocket">Rocket</option>
                        <option value="Partial">Partial</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col">
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                    <p>Select Courier: </p>
                    <div className="flex">
                      <select
                        className="h-12 w-full cursor-pointer rounded-lg border px-2.5 outline-none focus-within:outline-none md:w-[330px]"
                        name="courier"
                        onChange={(e) => setCourier(e.target.value)}
                        required
                      >
                        <option value="" disabled selected>
                          Select Courier
                        </option>

                        {activeCouriers?.map((courier) => (
                          <option key={courier._id} value={courier.name}>
                            {courier.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <p>Delivery Charge: </p>
                  <input
                    type="number"
                    placeholder="Delivery Charge"
                    defaultValue={deliveryCharge}
                    onChange={(e) =>
                      setInputDeliveryCharge(parseFloat(e.target.value))
                    }
                    className="border-r-none input-primary input border border-gray-300 bg-white focus-within:outline-none md:w-[325px]"
                  />
                </div>
              </div>
            </div>
            <div className="flex w-80 flex-col gap-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subTotal} tk</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{deliveryCharge} tk</span>
              </div>
              <div className="flex justify-between">
                <span>Discount on All</span>
                <span>{discountOnAll} tk</span>
              </div>
              <div className="flex justify-between">
                <span>Advance Payment</span>
                <span>{advance} tk</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="">Customer Payable</span>
                <span>{cashCollect} tk</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-5">
            {/*  <div className="form-control">
              <label className="label cursor-pointer gap-3">
                <input
                  type="checkbox"
                  checked="checked"
                  className="checkbox-primary checkbox"
                />
                <span className="label-text">Send SMS to Customer</span>
              </label>
            </div> */}
            <div className="flex items-center gap-5">
              <button className="btn-error btn-outline btn w-40">Cancel</button>
              <button
                onClick={(e) => handleOrder(e)}
                className="btn-primary btn w-40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartOrder;
