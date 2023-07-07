import React, { useEffect, useState } from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { toast } from "react-hot-toast";

const EditProductModal = ({
  setIsEditModalOpen,
  isEditModalOpen,
  selectedProduct,
  refetchProducts,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditProduct = (event) => {
    event.preventDefault();
    const imageHostKey = import.meta.env.VITE_IMGBB_KEY;

    const form = event.target;
    const name = form.name.value;
    const description = form.description.value;
    const brand = form.brand.value;
    const image = form.image.files[0];
    const supplier = form.supplier.value;
    const country = form.country.value;
    const store = form.store.value;
    const liftPrice = form.liftPrice.value;
    const salePrice = form.salePrice.value;
    const availableQty = form.availableQty.value;
    const qty = form.qty.value;

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
              description,
              brand,
              supplier,
              country,
              store,
              liftPrice,
              salePrice,
              availableQty,
              qty,
            };

            console.log("edit modal", customer);
            updatedProduct(customer);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong");
        });
    } else {
      const customer = {
        image: selectedProduct?.image,
        name,
        description,
        brand,
        supplier,
        country,
        store,
        liftPrice,
        salePrice,
        availableQty,
        qty,
      };

      console.log("edit modal", customer);
      updatedProduct(customer);
    }
  };

  const updatedProduct = (customer) => {
    fetch(
      `${import.meta.env.VITE_SERVER_URL}/product/edit-product-info?id=${
        selectedProduct?._id
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
        if (result.success) {
          toast.success(`${customer.name} is updated successfully`);
          refetchProducts();
          setIsModalOpen(false);
          setIsEditModalOpen(false);
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
    setIsModalOpen(isEditModalOpen);
  }, [isEditModalOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      setIsEditModalOpen(isModalOpen);
    }
  }, [isModalOpen]);

  return (
    <div>
      <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <div className="bg-base-100">
          <p className="w-full p-5 text-2xl font-semibold shadow">
            Customer Information
          </p>
          <div>
            <form
              onSubmit={handleEditProduct}
              className="flex flex-col gap-3 p-5"
            >
              <label className="w-full space-y-2">
                <p className="font-semibold">Product Name</p>
                <input
                  className="input-bordered input w-full"
                  type="text"
                  name="name"
                  placeholder="Product Title / Name"
                  defaultValue={selectedProduct?.name}
                />
              </label>
              <label className="w-full space-y-2">
                <p className="font-semibold">Product Description</p>
                <textarea
                  className="input-bordered input h-24 max-h-fit min-h-min w-full py-2"
                  type="text"
                  name="description"
                  placeholder="Description"
                  defaultValue={selectedProduct?.description}
                />
              </label>

              <div className="flex gap-3">
                <label className="w-1/2 space-y-2 ">
                  <p className="font-semibold">Product Brand</p>
                  <input
                    className="input-bordered input"
                    type="text"
                    name="brand"
                    placeholder="Brand"
                    defaultValue={selectedProduct?.brand}
                  />
                </label>
                <label className="w-1/2 space-y-2">
                  <p className="font-semibold">Product Made In</p>
                  <input
                    className="input-bordered input "
                    type="text"
                    name="country"
                    placeholder="Country"
                    defaultValue={selectedProduct?.country}
                  />
                </label>
              </div>

              <div className="flex gap-3">
                <label className="w-1/2 space-y-2">
                  <p className="font-semibold">Product Supplier</p>
                  <select
                    name="supplier"
                    id="supplier"
                    className="input-bordered input w-full"
                    defaultValue={selectedProduct?.supplier}
                  >
                    <option value="" disabled>
                      Select Supplier
                    </option>
                    <option value="One Publication">One Publication</option>
                    <option value="Two Publication">Two Publication</option>
                  </select>
                </label>
                <label className="w-1/2 space-y-2">
                  <p className="font-semibold">Product Store</p>
                  <select
                    name="store"
                    id="store"
                    className="input-bordered input w-full"
                    defaultValue={selectedProduct?.store}
                  >
                    <option value="" disabled>
                      Select Store
                    </option>
                    <option value="One Store">One Store</option>
                    <option value="Two Store">Two Store</option>
                  </select>
                </label>
              </div>

              <div className="flex gap-3">
                <label className="w-full space-y-2">
                  <p className="font-semibold">Product Purchase Price</p>
                  <input
                    className="input-bordered input w-full "
                    type="number"
                    name="liftPrice"
                    placeholder="Lift Price"
                    defaultValue={selectedProduct?.liftPrice}
                  />
                </label>
                <label className="w-full space-y-2">
                  <p className="font-semibold">Product Sale Price</p>
                  <input
                    className="input-bordered input w-full "
                    type="number"
                    name="salePrice"
                    placeholder="Sale Price"
                    defaultValue={selectedProduct?.salePrice}
                  />
                </label>
              </div>
              <div className="flex gap-3">
                <label className="w-full space-y-2">
                  <p className="font-semibold">Product Quantity</p>
                  <input
                    className="input-bordered input w-full "
                    type="number"
                    name="qty"
                    placeholder="QTY"
                    defaultValue={selectedProduct?.qty}
                  />
                </label>

                <label className="w-full space-y-2">
                  <p className="font-semibold">Product Available Stock</p>
                  <input
                    className="input-bordered input w-full "
                    type="number"
                    name="availableQty"
                    placeholder="Available Product"
                    defaultValue={selectedProduct?.availableQty}
                  />
                </label>
              </div>
              <div className="flex gap-3">
                <img
                  className="h-10 w-10 object-cover"
                  src={selectedProduct?.image}
                  alt=""
                />
                <input
                  type="file"
                  name="image"
                  className="file-input-bordered file-input-primary file-input w-full max-w-xs"
                />
              </div>
              <div>
                <div className="flex w-full justify-between gap-3">
                  <label
                    type="button"
                    // onClick={() => setIsModalOpen(false)}
                    className="btn-error btn-outline btn w-1/2"
                  >
                    Close!
                  </label>
                  <button
                    type="submit"
                    className="btn-success btn-outline btn w-1/2"
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
  );
};

export default EditProductModal;
