import React, { useContext, useEffect, useRef, useState } from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { StateContext } from "../../../contexts/StateProvider/StateProvider";
import { toast } from "react-hot-toast";
import { RiBarcodeLine, RiDeleteBin6Line } from "react-icons/ri";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EditOrderModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  setSelectedOrder,
  selectedOrder,
  refetch,
}) => {
  const { products, refetchProducts, couriers, userInfo, allCities } =
    useContext(StateContext);
  const [productList, setProductList] = useState(selectedOrder?.products);
  const [totalPrice, setTotalPrice] = useState(selectedOrder?.total);
  const [cashCollect, setCashCollect] = useState(selectedOrder?.cash);
  const [advance, setAdvance] = useState(selectedOrder?.advance);
  const [discount, setDiscount] = useState(selectedOrder?.discount);
  const [deliveryCharge, setDeliveryCharge] = useState(
    selectedOrder?.deliveryCharge
  );

  const [district, setDistrict] = useState(setSelectedOrder?.district ?? "");

  const [courier, setCourier] = useState(selectedOrder?.courier);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState([]);

  console.log("selected order", selectedOrder);
  console.log("selectedCity", selectedCity);
  // Function to handle city selection
  console.log("selected city", selectedCity);

  useEffect(() => {
    if (selectedOrder) {
      setSelectedCity(selectedOrder?.district);
      setSelectedArea(selectedOrder?.thana);

      const cityObject = allCities.find(
        (city) => city.City === selectedOrder?.district
      );

      if (cityObject && selectedOrder?.thana) {
        setSelectedAreas(cityObject.Area);
        setSelectedArea(selectedOrder?.thana);
      } else if (cityObject && !selectedOrder?.thana) {
        setSelectedAreas(cityObject.Area);
      } else {
        setSelectedAreas([]);
      }
    }
  }, [selectedOrder, allCities]);

  const handleCityChange = (e) => {
    const selectedCityName = e.target.value;
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

  const formRef = useRef(null);

  console.log("product list ", productList);

  useEffect(() => {
    if (selectedOrder) {
      setProductList(selectedOrder?.products);
      setTotalPrice(selectedOrder?.total);
      setCashCollect(selectedOrder?.cash);
      setAdvance(selectedOrder?.advance);
      setDiscount(selectedOrder?.discount);
      setDeliveryCharge(selectedOrder?.deliveryCharge);
      setDistrict(selectedOrder?.district);
      setCourier(selectedOrder?.courier);
    }
  }, [selectedOrder]);

  console.log(cashCollect);
  console.log(advance);
  console.log(discount);

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

  const handleFormReset = () => {
    setSelectedOrder(null);
    setProductList([]);
    formRef?.current?.reset();
  };

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

  const handleOrder = async (event) => {
    event.preventDefault();

    const form = event.target;
    const name = form.name.value;
    const phone = form.phone.value;
    const address = form.address.value;
    const district = form.district.value;
    const thana = form.thana.value;
    const courier = form.courier.value;
    const deliveryCharge = parseInt(form.deliveryCharge.value);
    const discount = parseInt(form.discount.value);
    const total = parseInt(form.totalBill.value);
    const advance = parseInt(form.advance.value);
    const cash = parseInt(form.cashCollect.value);
    const instruction = form.instruction.value;

    const orderUpdate = {
      name,
      phone,
      address,
      district,
      thana,
      products: productList,
      quantity: productList.length,
      courier,
      deliveryCharge,
      discount,
      total,
      advance,
      cash,
      instruction,
      updatedBy: userInfo?.username,
      updatedById: userInfo?._id,
      update: {},
      timestamp: new Date().toISOString(),
    };

    console.log("orderUpdate", orderUpdate);

    const selectedOrderFields = [
      "name",
      "phone",
      "address",
      "district",
      "thana",
      "products",
      "courier",
      "deliveryCharge",
      "discount",
      "total",
      "advance",
      "cash",
      "instruction",
    ];

    selectedOrderFields.forEach((field) => {
      if (orderUpdate[field] !== selectedOrder[field]) {
        orderUpdate.update[field] = orderUpdate[field];
      }
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/order/edit-order-info?id=${
          selectedOrder._id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderUpdate),
        }
      );
      console.log(response);
      if (response.ok) {
        const resultFromDB = await response.json();
        console.log("order info", resultFromDB);
        toast.success("Courier data saved successfully");
        setIsEditModalOpen(false);
        refetch();
      } else {
        toast.error("Failed to save courier data");
        throw new Error("Failed to save courier data");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to save courier data");
    }
  };

  console.log(isEditModalOpen);

  useEffect(() => {
    if (selectedOrder) {
      const total = productList?.reduce(
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

  console.log("selected order ", selectedOrder);

  const [searchProductsResults, setSearchProductsResults] = useState([]);

  const searchProductRef = useRef(null);

  const handleSearchProduct = (e) => {
    const customerSearchKey = searchProductRef?.current?.value;

    console.log("customerSearchKey", customerSearchKey);

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

  return (
    <div>
      <ModalBox
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
      >
        <div className="flex max-h-[90vh] flex-col">
          <p className="border-b p-5 text-xl font-semibold">
            Order Information
          </p>
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
              defaultValue={selectedOrder?.name || ""}
              required
            />
            <input
              type="text"
              className="input-bordered input"
              placeholder="Phone"
              name="phone"
              defaultValue={selectedOrder?.phone || ""}
              required
            />
            <input
              type="text"
              className="input-bordered input col-span-2"
              placeholder="Address"
              name="address"
              defaultValue={selectedOrder?.address || ""}
              required
            />
            <label className="col-span-2 flex w-full flex-col items-start gap-3 md:col-span-1">
              <select
                className="select-primary select select-sm h-10 w-[270px] max-w-xs overflow-scroll focus-within:outline-none md:w-full"
                name="district"
                onChange={handleCityChange}
                // value={selectedCity}

                defaultValue={selectedOrder?.district || ""}
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
            </label>
            <label className="col-span-2 flex  w-full flex-col items-start gap-3 md:col-span-1">
              <select
                className="select-primary select select-sm h-10 w-[270px] max-w-xs focus-within:outline-none md:w-full"
                name="thana"
                value={selectedArea}
                defaultValue={selectedOrder?.thana || ""}
                onChange={(e) => setSelectedArea(e.target.value)}
                disabled={!selectedOrder?.district}
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
            </label>
            <div className="col-span-2 flex h-full w-fit flex-col gap-3 rounded bg-gray-100 p-5">
              <p className="text-xl font-semibold">Products</p>
              <div className="col-span-3 flex flex-col">
                <label htmlFor="">Product Name</label>
                <div className="join w-full">
                  <button className="join-item btn rounded">
                    <RiBarcodeLine className="text-3xl" />
                  </button>
                  <div className="relative flex w-full flex-col">
                    <div className="flex gap-2">
                      <input
                        ref={searchProductRef}
                        type="text"
                        className="input-bordered input-primary input join-item w-full border-gray-300 focus-within:outline-none"
                        placeholder="Item name / Barcode / Item code"
                        name="search-key"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault(); // Prevent form submission
                            handleSearchProduct(); // Call your search function
                          }
                        }}
                      />
                      <button
                        onClick={() => handleSearchProduct()}
                        name="search"
                        id="search"
                        className="btn-primary btn"
                        form="search"
                      >
                        Search
                      </button>
                    </div>
                    {searchProductsResults.length > 0 && (
                      <div className="absolute top-12 z-50 flex w-full flex-col rounded-lg border border-primary bg-white p-3 py-0">
                        {searchProductsResults?.map((product) => {
                          const quantityOfProduct = productList?.find(
                            (p) => p._id === product._id
                          )?.quantity;

                          const formattedQuantity = parseInt(quantityOfProduct);

                          return (
                            <div
                              key={product?._id}
                              onClick={() => {
                                console.log("product", product);
                                console.log("productList", productList);
                                console.log(
                                  "searchProductsResults",
                                  searchProductsResults
                                );

                                if (product.availableQty > 0) {
                                  ``;
                                  handleSelectedProductList(product);
                                  setSearchProductsResults([]);
                                } else {
                                  toast.error("Product is out of stock");
                                }
                              }}
                              disabled={
                                formattedQuantity === product.availableQty
                              }
                              className="cursor-pointer border-b px-3 py-1 transition-all duration-300 hover:bg-base-100"
                            >
                              <p>
                                {product?.name} - {product?.salePrice}Tk -{" "}
                                {product?.availableQty} Piece
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/*  <DropdownMenu className="w-full">
                <DropdownMenuTrigger className="btn m-1 w-full bg-primary text-white">
                  {" "}
                  Select Product
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {products?.map((product) => (
                    <DropdownMenuItem
                      className="w-full cursor-pointer"
                      onClick={() => {
                        if (product.availableQty > 0) {``
                          handleSelectedProductList(product);
                        } else {
                          toast.error("Product is out of stock");
                        }
                      }}
                      key={product._id}
                      disabled={
                        productList?.find((p) => p._id === product._id)
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
              </DropdownMenu> */}
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
              defaultValue={selectedOrder?.courier || ""}
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
              placeholder="Discount %"
              name="discount"
              defaultValue={discount || 0}
              onChange={(e) => setDiscount(e.target.value)}
              required
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
              defaultValue={advance || 0}
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
              defaultValue={selectedOrder?.instruction || ""}
            />
            {/* <div className="col-span-2 w-60 space-y-2">
              <p>Other Pictures</p>
              <input
                type="file"
                name="image"
                className="file-input-bordered file-input-primary  file-input w-fit"
              />
            </div> */}
            <button
              onClick={() => {
                setIsEditModalOpen(false);
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

export default EditOrderModal;
