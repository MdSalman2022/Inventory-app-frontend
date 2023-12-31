import React, { useContext, useState } from "react";
import { AiOutlineEdit, AiOutlineShoppingCart } from "react-icons/ai";
import { useQuery } from "react-query";
import avatarIcon from "../../assets/shared/avatar.png";
import { RiDeleteBin6Line } from "react-icons/ri";
import ModalBox from "../../components/Main/shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import DeleteProductModal from "../../components/Main/Products/DeleteProductModal";
import EditProductModal from "../../components/Main/Products/EditProductModal";
import { StateContext } from "../../contexts/StateProvider/StateProvider";
import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";

const Products = () => {
  const {
    products,
    refetchProducts,
    productsIsLoading,
    stores,
    suppliers,
    userInfo,
  } = useContext(StateContext);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [store, setStore] = useState({});
  const [supplier, setSupplier] = useState({});

  console.log("supplier info ", supplier);

  console.log(isEditModalOpen);
  //   console.log(selectedProduct);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExportClick = () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/product/product-export`, {
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

  const handleAddProduct = (event) => {
    event.preventDefault();
    const imageHostKey = import.meta.env.VITE_IMGBB_KEY;

    const form = event.target;
    const name = form.name.value;
    const description = form.description.value;
    const brand = form.brand.value;
    const image = form?.image?.files[0];
    const country = form.country.value;
    const liftPrice = form.liftPrice.value;
    const salePrice = form.salePrice.value;
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
            const product = {
              image: imgUpload.data.url,
              name,
              description,
              brand,
              supplierId: supplier?._id,
              supplier: supplier,
              storeId: store?.storeId,
              store,
              country,
              liftPrice,
              salePrice,
              qty,
              sellerId:
                userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId,
            };

            console.log(product);
            addProduct(product);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong");
        });
    } else {
      const product = {
        image: "",
        name,
        description,
        brand,
        supplierId: supplier?._id,
        supplier,
        storeId: store?.storeId,
        store,
        country,
        liftPrice,
        salePrice,
        qty,
        sellerId:
          userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId,
      };

      console.log(product);
      addProduct(product);
    }
  };

  const addProduct = (product) => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/product/create-product`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          toast.success(`${product.name} is added successfully`);
          refetchProducts();
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

  function formatStockDate(isoTimestamp) {
    const date = new Date(isoTimestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });

    return formattedDate;
  }

  const totalProductValue = products?.reduce((acc, product) => {
    return acc + product.salePrice * product.availableQty;
  }, 0);

  const totalSupplierCount = products?.reduce((acc, product) => {
    let count = 0;
    if (acc[product.supplier]) {
      count = acc[product.supplier] + 1;
    } else {
      count = 1;
    }
    return {
      ...acc,
      [product.supplier]: count,
    };
  }, {});

  const totalSupplierLength =
    products?.length > 0 &&
    Object?.keys(totalSupplierCount)?.map((key) => ({
      name: key,
      count: totalSupplierCount[key],
    }));
  console.log(totalSupplierLength);

  const [searchResults, setSearchResults] = useState("");

  const handleSearch = (e) => {
    e.preventDefault(); // prevent page refresh on form submit
    const form = e.target;
    const customerSearchKey = form["search-key"].value;

    console.log(customerSearchKey);

    let url = `${import.meta.env.VITE_SERVER_URL}/api/search-product?`;

    url += `name=${customerSearchKey}`;
    console.log(url);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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

  console.log("store ", store);
  console.log("products ", products);

  if (stores?.length === 0) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center">
        <Link to="/stores">
          <h1 className="cursor-pointer text-3xl font-bold hover:text-primary">
            Create A Store First
          </h1>
        </Link>
      </div>
    );
  } else
    return (
      <div className="w-screen p-3 md:w-full md:space-y-4 md:p-0">
        <EditProductModal
          setIsEditModalOpen={setIsEditModalOpen}
          isEditModalOpen={isEditModalOpen}
          selectedProduct={selectedProduct}
          refetchProducts={refetchProducts}
        />
        <DeleteProductModal
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          isDeleteModalOpen={isDeleteModalOpen}
          selectedProduct={selectedProduct}
          refetchProducts={refetchProducts}
        />
        <div className="flex grid-cols-3 flex-col gap-5 md:grid">
          <div className="rounded-lg border bg-white p-2">
            <p className="text-xl font-semibold">Product Stock Info</p>
            <p>Total Available</p>
            <div className="grid grid-cols-2">
              <p>Category</p>
              <p>{totalSupplierLength?.length || 0}</p>
              <p>Items </p>
              <p>{products?.length || 0}</p>
              <p>Value</p>
              <p>{totalProductValue || 0}</p>
            </div>
          </div>
          <div className="rounded-lg border bg-white p-2">
            <p className="text-xl font-semibold">This Month Stock In</p>
            <p>Total Available</p>
            <div className="grid grid-cols-2">
              <p>Category</p>
              <p>{totalSupplierLength?.length || 0}</p>
              <p>Items </p>
              <p>{products?.length || 0}</p>
              <p>Value</p>
              <p>{totalProductValue || 0}</p>
            </div>
          </div>
          <div className="rounded-lg border bg-white p-2">
            <p className="text-xl font-semibold">Last Month Stock In</p>
            <p>Total Available</p>
            <div className="grid grid-cols-2">
              <p>Category</p>
              <p>{totalSupplierLength?.length || 0}</p>
              <p>Items </p>
              <p>{products?.length || 0}</p>
              <p>Value</p>
              <p>{totalProductValue || 0}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-b py-3">
          <p className="text-xl font-semibold">Products List</p>

          <div className="flex items-center gap-4">
            <button
              onClick={handleExportClick}
              className="btn-primary btn-outline btn"
            >
              Export
            </button>
            <label
              onClick={() => setIsModalOpen(!isModalOpen)}
              className="btn-primary btn-outline btn"
            >
              Add Product
            </label>
            <ModalBox isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
              <div className="bg-base-100">
                <p className="w-full p-5 text-2xl font-semibold shadow">
                  Product Information
                </p>
                <div>
                  <form
                    onSubmit={handleAddProduct}
                    className="flex flex-col gap-3 p-5"
                  >
                    <input
                      className="input-bordered input "
                      type="text"
                      name="name"
                      placeholder="Product Title / Name"
                    />
                    <textarea
                      className="input-bordered input h-24 max-h-fit min-h-min py-2 "
                      type="text"
                      name="description"
                      placeholder="Description"
                    />
                    <div className="flex gap-3">
                      <input
                        className="input-bordered input w-1/2 "
                        type="text"
                        name="brand"
                        placeholder="Brand"
                      />
                      <input
                        className="input-bordered input w-1/2 "
                        type="text"
                        name="country"
                        placeholder="Country"
                      />
                    </div>

                    <div className="flex gap-3">
                      <select
                        name="supplier"
                        id="supplier"
                        className="input-bordered input w-1/2"
                        onChange={(e) =>
                          setSupplier(JSON.parse(e.target.value))
                        }
                      >
                        <option value="" disabled selected>
                          Select Supplier
                        </option>
                        {suppliers?.map((supplier) => (
                          <option
                            key={supplier?._id}
                            value={JSON.stringify({
                              _id: supplier._id,
                              name: supplier.name,
                              phone: supplier.phone,
                              address: supplier.address,
                            })}
                          >
                            {supplier.name}
                          </option>
                        ))}
                      </select>
                      <select
                        name="store"
                        id="store"
                        className="input-bordered input w-1/2"
                        onChange={(e) => setStore(JSON.parse(e.target.value))}
                      >
                        <option value="" disabled selected>
                          Select Store
                        </option>
                        {stores?.map((store) => (
                          <option
                            key={store?._id}
                            value={JSON.stringify({
                              _id: store._id,
                              name: store.name,
                              phone: store.phone,
                              district: store.district,
                              address: store.address,
                              sellerId: store.sellerId,
                              area: store.area,
                              zip: store.zip,
                              status: store.status,
                              storeId: store.storeId,
                            })}
                          >
                            {store.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <input
                        className="input-bordered input w-full "
                        type="number"
                        name="liftPrice"
                        placeholder="Purchase Price"
                      />
                      <input
                        className="input-bordered input w-full "
                        type="number"
                        name="salePrice"
                        placeholder="Sale Price"
                      />
                    </div>
                    <div className="flex gap-3">
                      <input
                        className="input-bordered input w-full "
                        type="number"
                        name="qty"
                        placeholder="QTY"
                      />
                      {/* 
                    <input
                      type="file"
                      name="image"
                      className="file-input-bordered file-input-primary file-input w-full max-w-xs"
                    /> */}
                    </div>
                    <div>
                      <div className="flex w-full justify-between gap-3">
                        <label
                          type="button"
                          // onClick={() => setIsModalOpen(false)}
                          className="btn-outline btn-error btn w-1/2"
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
        </div>
        <div className="my-2 flex justify-between md:my-0">
          <div className="flex items-center gap-2">
            <p>Show</p>
            <select name="page" id="page" className="input-bordered input p-2">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <p>Search</p>
            <form onSubmit={handleSearch}>
              <input
                name="search-key"
                type="text"
                className="input-bordered input"
              />
            </form>
          </div>
        </div>

        <div>
          <div className="h-[70vh] overflow-auto">
            <table className="table-pin-rows table">
              {/* head */}
              <thead className="bg-primary text-white">
                <tr>
                  <th className="w-5 bg-primary text-white">#</th>
                  <th className="max-w-96 w-60 min-w-fit bg-primary text-white">
                    Product Name
                  </th>
                  <th className="bg-primary text-white">Store</th>
                  <th className="bg-primary text-white">Supplier</th>
                  <th className="bg-primary text-white">Stock</th>
                  <th className="bg-primary text-white">Price</th>
                  <th className="bg-primary text-white">Stock Date</th>
                  <th className="bg-primary text-white">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {!searchResults
                  ? products?.map((product, index) => (
                      <tr key={index}>
                        <th className="w-5">{index + 1}</th>
                        <td className="max-w-96 flex w-60 min-w-fit flex-col gap-1">
                          <div className="flex items-center space-x-3">
                            {/* <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
                              <img
                                src={product.image || avatarIcon}
                                alt="image"
                                className="rounded-full border-2 border-primary p-1"
                              />
                            </div>
                          </div> */}
                            <div>
                              <div className="font-bold">{product.name}</div>
                              <div className="text-sm opacity-50">
                                {product.location}
                              </div>
                              <div className="text-sm opacity-50">
                                {product.address}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>{product.store?.name}</div>
                        </td>
                        <td>
                          <div>{product?.supplier?.name}</div>
                        </td>
                        <td>
                          <div>Avl: {product.availableQty}</div>
                          <div>(Qty: {product.qty})</div>
                        </td>
                        <td>
                          <div>S: {product.salePrice}</div>
                          <div>(P: {product.liftPrice})</div>
                        </td>
                        <td>
                          <div>
                            <p>
                              Processing: {formatStockDate(product.timestamp)}
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="dropdown-left dropdown">
                            <label tabIndex={0} className="btn-sm btn m-1">
                              <BsThreeDots size={18} />
                            </label>
                            <ul
                              tabIndex={0}
                              className="dropdown-content menu rounded-box z-[1] w-40 gap-1  bg-base-100 shadow"
                            >
                              <li
                                onClick={() => {
                                  setIsEditModalOpen(true);
                                  setSelectedProduct(product);
                                }}
                                className="flex w-full cursor-pointer justify-center rounded-lg  bg-yellow-100 "
                              >
                                <div
                                  className="tooltip flex cursor-pointer justify-center"
                                  data-tip="Ready"
                                >
                                  <AiOutlineEdit className="text-lg text-success " />
                                </div>
                              </li>
                              <li
                                onClick={() => {
                                  setIsDeleteModalOpen(true);
                                  setSelectedProduct(product);
                                }}
                                className="flex w-full cursor-pointer justify-center rounded-lg bg-red-100"
                              >
                                <div
                                  className="tooltip flex cursor-pointer justify-center"
                                  data-tip="Delete order"
                                >
                                  <RiDeleteBin6Line className="text-xl text-success " />
                                </div>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))
                  : searchResults?.map((product, index) => (
                      <tr key={index}>
                        <th className="w-5">{index + 1}</th>
                        <td className="max-w-96 flex w-60 min-w-fit flex-col gap-1">
                          <div className="flex items-center space-x-3">
                            {/* <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
                              <img
                                src={product.image || avatarIcon}
                                alt="image"
                                className="rounded-full border-2 border-primary p-1"
                              />
                            </div>
                          </div> */}
                            <div>
                              <div className="font-bold">{product.name}</div>
                              <div className="text-sm opacity-50">
                                {product.location}
                              </div>
                              <div className="text-sm opacity-50">
                                {product.address}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>{product.supplier}</div>
                        </td>
                        <td>
                          <div>Avl: {product.availableQty}</div>
                          <div>(Qty: {product.qty})</div>
                        </td>
                        <td>
                          <div>S: {product.salePrice}</div>
                          <div>(P: {product.liftPrice})</div>
                        </td>
                        <td>
                          <div>
                            <p>
                              Processing: {formatStockDate(product.stockDate)}
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="dropdown-left dropdown">
                            <label tabIndex={0} className="btn-sm btn m-1">
                              <BsThreeDots size={18} />
                            </label>
                            <ul
                              tabIndex={0}
                              className="dropdown-content menu rounded-box z-[1] w-40 gap-1  bg-base-100 shadow"
                            >
                              <li
                                onClick={() => {
                                  setIsEditModalOpen(true);
                                  setSelectedProduct(product);
                                }}
                                className="flex w-full cursor-pointer justify-center rounded-lg  bg-yellow-100 "
                              >
                                <div
                                  className="tooltip flex cursor-pointer justify-center"
                                  data-tip="Ready"
                                >
                                  <AiOutlineEdit className="text-lg text-success " />
                                </div>
                              </li>
                              <li
                                onClick={() => {
                                  setIsDeleteModalOpen(true);
                                  setSelectedProduct(product);
                                }}
                                className="flex w-full cursor-pointer justify-center rounded-lg bg-red-100"
                              >
                                <div
                                  className="tooltip flex cursor-pointer justify-center"
                                  data-tip="Delete order"
                                >
                                  <RiDeleteBin6Line className="text-xl text-success " />
                                </div>
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

export default Products;
