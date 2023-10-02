import React, { useContext, useEffect, useState } from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import { EditUserLog } from "@/utils/fetchApi";
import { StateContext } from "@/contexts/StateProvider/StateProvider";

const EditCustomerModal = ({
  setIsEditModalOpen,
  isEditModalOpen,
  selectedCustomer,
  refetch,
}) => {
  const { userInfo, allCities } = useContext(StateContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState([]);

  console.log("selectedCity", selectedCity);
  // Function to handle city selection
  console.log("selected city", selectedCity);

  useEffect(() => {
    if (selectedCustomer) {
      setSelectedCity(selectedCustomer?.customer_details?.location);
      setSelectedArea(selectedCustomer?.customer_details?.thana);

      const cityObject = allCities.find(
        (city) => city.City === selectedCustomer?.customer_details?.location
      );

      if (cityObject && selectedCustomer?.customer_details?.thana) {
        setSelectedAreas(cityObject.Area);
        setSelectedArea(selectedCustomer?.customer_details?.thana);
      } else if (cityObject && !selectedCustomer?.customer_details?.thana) {
        setSelectedAreas(cityObject.Area);
      } else {
        setSelectedAreas([]);
      }
    }
  }, [selectedCustomer, allCities]);

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
  console.log("selected customer", selectedCustomer);

  const handleEditCustomer = (event) => {
    event.preventDefault();
    const imageHostKey = import.meta.env.VITE_IMGBB_KEY;

    const form = event.target;
    const name = form.name.value;
    const phone = form.phone.value;
    const address = form.address.value;
    const link = form.link.value;
    const image = form?.image?.files[0];

    console.log(selectedCustomer?._id);

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
              ...selectedCustomer,
              image: imgUpload.data.url,
              name,
              phone,
              district,
              address,
              link,
            };

            console.log("edit modal", customer);
            updateCustomer(customer);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong");
        });
    } else {
      const customer = {
        ...selectedCustomer,
        image: selectedCustomer?.image,
        name,
        phone,
        address,
        location: selectedCity,
        thana: selectedArea,
        link,
      };

      console.log("edit modal", customer);
      updateCustomer(customer);
    }
  };

  const updateCustomer = (customer) => {
    fetch(
      `${import.meta.env.VITE_SERVER_URL}/customer/edit-customer-info?id=${
        selectedCustomer?._id
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
          refetch();
          setIsModalOpen(false);
          setIsEditModalOpen(false);
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
        <div className="w-80 bg-base-100 md:w-96">
          <p className="w-full p-5 text-2xl font-semibold shadow">
            Customer Information
          </p>
          <div>
            <form
              onSubmit={handleEditCustomer}
              className="flex flex-col gap-3 p-5"
            >
              <input
                className="input-bordered input "
                type="text"
                name="name"
                placeholder="Facebook Name"
                defaultValue={selectedCustomer?.customer_details?.name}
              />
              <input
                className="input-bordered input "
                type="text"
                name="phone"
                placeholder="Phone"
                defaultValue={selectedCustomer?.customer_details?.phone}
              />
              <input
                className="input-bordered input "
                type="text"
                name="address"
                placeholder="Address"
                defaultValue={selectedCustomer?.customer_details?.address}
              />

              <select
                className="select-primary select select-sm h-10 w-[270px] max-w-xs overflow-scroll focus-within:outline-none md:w-full"
                name="district"
                onChange={handleCityChange}
                // value={selectedCity}

                defaultValue={
                  selectedCustomer?.customer_details?.location || ""
                }
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
              <select
                className="select-primary select select-sm h-10 w-[270px] max-w-xs focus-within:outline-none md:w-full"
                name="thana"
                value={selectedArea}
                defaultValue={selectedCustomer?.customer_details?.thana || ""}
                onChange={(e) => setSelectedArea(e.target.value)}
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
              <input
                className="input-bordered input "
                type="text"
                name="link"
                placeholder="Facebook inbox link"
                defaultValue={selectedCustomer?.customer_details?.link}
              />
              <div>
                <div className="flex w-full justify-between gap-3">
                  <label
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsEditModalOpen(false);
                    }}
                    className="btn"
                  >
                    Close!
                  </label>
                  <button type="submit" className="btn-success btn-outline btn">
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

export default EditCustomerModal;
