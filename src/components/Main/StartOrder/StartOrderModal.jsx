import React, { useContext, useEffect, useRef, useState } from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import { StateContext } from "../../../contexts/StateProvider/StateProvider";
import { useQuery } from "react-query";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StartOrderModal = ({
  isStartNewOrderOpen,
  setIsStartNewOrderOpen,
  selectedCustomer,
  setSelectedCustomer,
}) => {
  const { products, refetchProducts, couriers, stores, userInfo } =
    useContext(StateContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cashCollect, setCashCollect] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [newCustomerId, setNewCustomerId] = useState("");
  const [district, setDistrict] = useState(
    selectedCustomer?.customer_details?.location ?? ""
  );
  const [courier, setCourier] = useState("");
  const [store, setStore] = useState({});
  console.log("courier ", courier);

  console.log("district ", district);

  useEffect(() => {
    if (selectedCustomer?._id) {
      setDistrict(selectedCustomer?.customer_details?.location);
    }
  }, [selectedCustomer]);

  const formRef = useRef(null);

  const activeCouriers =
    couriers?.filter((courier) => courier?.status === true) ?? [];
  console.log(activeCouriers);

  useEffect(() => {
    if (district && courier) {
      const courierInfo = activeCouriers.find((c) => c?.name === courier);
      console.log("courier info ", courierInfo);
      setDeliveryCharge(
        district === "Dhaka"
          ? courierInfo?.chargeInDhaka
          : courierInfo?.chargeOutsideDhaka
      );
      console.log(deliveryCharge);
    }
  }, [district, courier, deliveryCharge, activeCouriers]);

  useEffect(() => {
    setIsModalOpen(isStartNewOrderOpen);
  }, [isStartNewOrderOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      setIsStartNewOrderOpen(isModalOpen);
    }
  }, [isModalOpen]);

  console.log("product list ", productList);
  console.log("store ", store);

  const handleOrder = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const phone = form.phone.value;
    const address = form.address.value;
    const district = form.district.value;
    const courier = form.courier.value;
    const deliveryCharge = parseInt(form.deliveryCharge.value);
    const discount = parseInt(form.discount.value);
    const total = parseInt(form.totalBill.value);
    const advance = parseInt(form.advance.value);
    const cash = parseInt(form.cashCollect.value);
    const instruction = form.instruction.value;
    const image = form?.image?.files[0];

    // console.log(store.name);
    if (image) {
      const formData = new FormData();
      formData.append("image", image);
      const url = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMGBB_KEY
      }`;
      if (!selectedCustomer._id) {
        const customerInfo = {
          name,
          phone,
          address,
          location: district,
          sellerId:
            userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId,
          storeId: store?.storeId,
        };

        fetch(`${import.meta.env.VITE_SERVER_URL}/customer/create-customer`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(customerInfo),
        })
          .then((res) => res.json())
          .then((result) => {
            console.log("new customer info", result);
            if (result.success) {
              console.log("inserted id", result?.result?._id);
              setNewCustomerId(result?.result?._id);
              toast.success(`${customerInfo.name} is added successfully`);
              fetch(url, {
                method: "POST",
                body: formData,
              })
                .then((res) => res.json())
                .then((imgUpload) => {
                  if (imgUpload.success) {
                    console.log("new customer id", result?.result?._id);

                    const order = {
                      image: imgUpload.data.url,
                      customerId: result?.result?._id,
                      name,
                      phone,
                      address,
                      district,
                      sellerId:
                        userInfo?.role === "Admin"
                          ? userInfo?._id
                          : userInfo?.sellerId,
                      storeId: store?.storeId,
                      store,
                      products: productList,
                      quantity: productList.length,
                      courier,
                      deliveryCharge,
                      discount,
                      total,
                      advance,
                      cash,
                      instruction,
                      timestamp: new Date().toISOString(),
                    };
                    const customerInfo = {
                      id: result?.result?._id,
                      image: "",
                      name,
                      phone,
                      address,
                      location: district,
                      total: 0 + total + deliveryCharge - discount,
                      order,
                      processingCount: 1,
                      readyCount: 0,
                      completedCount: 0,
                      returnedCount: 0,
                    };

                    console.log("customer info ", customerInfo);
                    console.log("order info ", order);
                    addOrder(order);
                    updateCustomer(customerInfo);
                  }
                })
                .catch((err) => {
                  console.log(err);
                  toast.error(
                    "Something went wrong with creating order with new customer"
                  );
                });
              setIsModalOpen(false);
            } else {
              toast.error("Something went wrong with customer creation");
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error("Customer could not be added");
          });
      } else {
        // if customer is already exist and image is uploaded
        fetch(url, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((imgUpload) => {
            if (imgUpload.success) {
              const order = {
                image: imgUpload.data.url,
                customerId: selectedCustomer?._id,
                name,
                phone,
                address,
                district,
                sellerId:
                  userInfo?.role === "Admin"
                    ? userInfo?._id
                    : userInfo?.sellerId,
                storeId: store?.storeId,
                store,
                products: productList,
                quantity: productList.length,
                courier,
                deliveryCharge,
                discount,
                total,
                advance,
                cash,
                instruction,
                timestamp: new Date().toISOString(),
              };
              const customerInfo = {
                id: selectedCustomer?._id,
                image: selectedCustomer?.image || "",
                name,
                phone,
                address,
                location: district,
                total:
                  parseInt(selectedCustomer?.purchase?.total) +
                  total +
                  deliveryCharge -
                  discount,
                order,
                processingCount: selectedCustomer?.orders?.processing + 1,
                readyCount: selectedCustomer?.orders?.ready,
                completedCount: selectedCustomer?.orders?.completed,
                returnedCount: selectedCustomer?.orders?.returned,
              };

              console.log(order);
              addOrder(order);
              updateCustomer(customerInfo);
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error(
              "Something went wrong creating order with existing customer"
            );
          });
        setIsModalOpen(false);
      }
    } else {
      // if image is not uploaded

      if (!selectedCustomer?._id) {
        const customerInfo = {
          name,
          phone,
          address,
          location: district,
          sellerId:
            userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId,
        };

        fetch(`${import.meta.env.VITE_SERVER_URL}/customer/create-customer`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(customerInfo),
        })
          .then((res) => res.json())
          .then((result) => {
            console.log(result);
            if (result.success) {
              console.log(result?.result?._id);
              const order = {
                image: "",
                customerId: result?.result?._id,
                name,
                phone,
                address,
                district,
                sellerId:
                  userInfo?.role === "Admin"
                    ? userInfo?._id
                    : userInfo?.sellerId,
                storeId: store?.storeId,
                store,
                products: productList,
                quantity: productList.length,
                courier,
                deliveryCharge,
                discount,
                total,
                advance,
                cash,
                instruction,
                timestamp: new Date().toISOString(),
              };
              const customerInfo = {
                id: result?.result?._id,
                image: "",
                name,
                phone,
                address,
                sellerId:
                  userInfo?.role === "Admin"
                    ? userInfo?._id
                    : userInfo?.sellerId,
                storeId: store?.storeId,
                location: district,
                total: 0 + total + deliveryCharge - discount,
                order,
                processingCount: 1,
                readyCount: 0,
                completedCount: 0,
                returnedCount: 0,
              };

              console.log(
                "order for if image is not uploaded but selected customer false",
                order,
                customerInfo
              );

              addOrder(order);
              updateCustomer(customerInfo);
            }
          });
      } else {
        const order = {
          image: "",
          customerId: selectedCustomer?._id,
          name,
          phone,
          address,
          district,
          sellerId:
            userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId,
          storeId: store?._id,
          store,
          products: productList,
          quantity: productList.length,
          courier,
          deliveryCharge,
          discount,
          total,
          advance,
          cash,
          instruction,
          createdBy: userInfo?.username,
          createdById: userInfo?._id,
          timestamp: new Date().toISOString(),
        };
        const customerInfo = {
          id: selectedCustomer?._id,
          image: selectedCustomer?.image || "",
          name,
          phone,
          address,
          location: district,
          total:
            parseInt(selectedCustomer?.purchase?.total) +
            total +
            deliveryCharge -
            discount,
          order,
          storeId: store?.storeId,
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
    }
  };

  const addOrder = (order) => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/order/create-order`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("added order info", result);

        if (result.success) {
          const allProducts = order.products;

          toast.success(`${order.name} is added successfully`);
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
                console.log("something went wrong stock update");
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
        console.log(result);
        console.log(customer);
        if (result.success) {
          toast.success(`${customer.name} is updated successfully`);
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
      console.log("total ", total);
      console.log("advance ", advance);
      console.log("discount ", discount);
      console.log("delivery charge ", deliveryCharge);
      const totalAfterAdvance = total - advance - discount + deliveryCharge;
      console.log(totalAfterAdvance);
      setCashCollect(totalAfterAdvance);
    } else {
      setTotalPrice(0);
      setCashCollect(0);
    }
  }, [productList, discount, deliveryCharge, advance]);

  console.log(cashCollect);
  console.log(totalPrice);

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

  const handleQuantityChange = (productId, quantity) => {
    const updatedProductList = productList.map((product) =>
      product._id === productId ? { ...product, quantity } : product
    );
    setProductList(updatedProductList);
  };

  const handleRemoveProduct = (productId) => {
    setProductList(productList.filter((product) => product._id !== productId));
  };

  console.log(productList);

  const [error, setError] = useState("");

  console.log(selectedCustomer);

  const handleFormReset = () => {
    setSelectedCustomer(null);
    setProductList([]);
    setAdvance(0);
    setCashCollect(0);
    setCourier("");
    setDeliveryCharge(0);
    setDiscount(0);
    setDistrict("");
    setNewCustomerId("");
    setStore({});
    setTotalPrice(0);
    setError("");
    formRef?.current?.reset();
  };

  useEffect(() => {
    if (!isModalOpen) {
      handleFormReset();
    }
  }, [isModalOpen]);

  console.log("couriers ", couriers);

  return (
    <div>
      <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <div className="flex flex-col ">
          <p className="border-b p-5">Order Information</p>
          <form
            ref={formRef}
            onSubmit={handleOrder}
            className="grid h-[800px] grid-cols-2 gap-5  overflow-y-scroll p-5"
          >
            <input
              type="text"
              className="input-bordered input"
              placeholder="Facebook Name"
              name="name"
              defaultValue={selectedCustomer?.customer_details?.name || ""}
              required
            />
            <input
              type="text"
              className="input-bordered input"
              placeholder="Phone"
              name="phone"
              defaultValue={selectedCustomer?.customer_details?.phone || ""}
              required
            />
            <input
              type="text"
              className="input-bordered input col-span-2"
              placeholder="Address"
              name="address"
              defaultValue={selectedCustomer?.customer_details?.address || ""}
              required
            />
            <select
              name="district"
              id="district"
              className="input-bordered input col-span-2"
              onChange={(e) => setDistrict(e.target.value)}
              defaultValue={district || ""}
              required
            >
              <option value="" disabled selected>
                Select Location
              </option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Khulna">Khulna</option>
              <option value="Barishal">Barishal</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Rangpur">Rangpur</option>
              <option value="Mymensingh">Mymensingh</option>
            </select>
            <select
              name="store"
              id="store"
              className="input-bordered input col-span-2"
              onChange={(e) => setStore(JSON.parse(e.target.value))}
              required
            >
              <option value="" disabled selected>
                Select Store
              </option>
              {stores?.map((store) => (
                <option
                  key={store._id}
                  value={JSON.stringify({
                    _id: store._id,
                    name: store.name,
                    phone: store.phone,
                    district: store.district,
                    address: store.address,
                    sellerId: store.sellerId,
                    storeId: store.storeId,
                    area: store.area,
                    zip: store.zip,
                    status: store.status,
                  })}
                >
                  {store.name}
                </option>
              ))}
            </select>
            <div className="col-span-2 flex h-full w-fit flex-col gap-3 rounded bg-gray-100 p-5">
              <p className="text-xl font-semibold">Products</p>
              <DropdownMenu className="w-full">
                <DropdownMenuTrigger className="btn m-1 w-full bg-primary text-white">
                  {" "}
                  Select Product
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {products?.map((product) => (
                    <DropdownMenuItem
                      className="w-full cursor-pointer"
                      onClick={() => {
                        if (product.availableQty > 0) {
                          handleSelectedProductList(product);
                        } else {
                          toast.error("Product is out of stock");
                        }
                      }}
                      key={product._id}
                      disabled={
                        productList.find((p) => p._id === product._id)
                          ?.quantity === product.availableQty
                      }
                    >
                      <a>
                        {product.name} - ৳ {product.salePrice} -{" "}
                        {product.availableQty} available products
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* selected products  */}
              <div className="flex flex-col gap-3">
                <table>
                  <thead>
                    <tr className="grid grid-cols-4 gap-5">
                      <th className="text-start">Product Name</th>
                      <th className="text-start">Price</th>
                      <th className="text-start">Qty</th>
                      <th className="text-start">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productList?.map((product) => (
                      <tr key={product._id} className="grid grid-cols-4 gap-5">
                        <td>{product.name}</td>
                        <td>৳ {product.salePrice}</td>
                        <td>
                          <input
                            type="number"
                            className="input-bordered input input-sm w-24"
                            placeholder="Quantity"
                            min={1}
                            max={parseInt(product.availableQty)}
                            value={product.quantity}
                            onChange={(e) => {
                              handleQuantityChange(product._id, e.target.value);
                              setError(
                                e.target.value > parseInt(product.availableQty)
                                  ? "Quantity can't be more than available quantity"
                                  : ""
                              );
                            }}
                          />
                        </td>
                        <td
                          onClick={() => handleRemoveProduct(product._id)}
                          className="jus flex items-center text-red-600"
                        >
                          <RiDeleteBin6Line />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <p>{error}</p>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <select
              className="select-bordered select col-span-1 w-full"
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
            <input
              type="number"
              className="input-bordered input"
              placeholder="Delivery Charge"
              name="deliveryCharge"
              onChange={(e) => {
                setDeliveryCharge(e.target.value);
              }}
              value={deliveryCharge || 0}
              readOnly
            />
            <input
              type="number"
              className="input-bordered input"
              placeholder="Discount"
              name="discount"
              onChange={(e) => setDiscount(e.target.value)}
              defaultValue={0}
            />
            <input
              type="number"
              className="input-bordered input"
              placeholder="Total Bill"
              name="totalBill"
              value={totalPrice || 0}
            />
            <input
              type="number"
              className="input-bordered input"
              placeholder="Advance"
              name="advance"
              min={0}
              defaultValue={0}
              onChange={(e) => setAdvance(e.target.value)}
              required
            />
            <input
              type="number"
              className="input-bordered input"
              placeholder="Cash Collect"
              name="cashCollect"
              value={cashCollect || 0}
            />
            <input
              type="text"
              className="input-bordered input col-span-2"
              placeholder="Exchange/special instruction"
              name="instruction"
            />
            <button
              onClick={() => {
                setIsModalOpen(false);
                handleFormReset();
              }}
              type="button"
              className="btn-error btn-outline btn"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary btn">
              Save
            </button>
          </form>
        </div>
      </ModalBox>
    </div>
  );
};

export default StartOrderModal;
