import React, { useContext, useEffect, useRef, useState } from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { StateContext } from "../../../contexts/StateProvider/StateProvider";
import { toast } from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";
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
  const { products, refetchProducts, couriers } = useContext(StateContext);
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

    console.log(orderUpdate);

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

  return (
    <div>
      <ModalBox
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
      >
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
            <select
              name="district"
              id="district"
              className="input-bordered input col-span-2"
              defaultValue={selectedOrder?.district || ""}
              onChange={(e) => setDistrict(e.target.value)}
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
