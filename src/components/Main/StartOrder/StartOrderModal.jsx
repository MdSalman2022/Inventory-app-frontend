import React, { useContext, useEffect, useRef, useState } from "react";
import ModalBox from "../shared/Modals/ModalBox";
import { toast } from "react-hot-toast";
import { StateContext } from "../../../contexts/StateProvider/StateProvider";
import { useQuery } from "react-query";
import { RiBarcodeLine, RiDeleteBin6Line } from "react-icons/ri";
import { IoPersonAdd } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditUserLog } from "@/utils/fetchApi";
import { AiOutlinePlus } from "react-icons/ai";

const StartOrderModal = ({
  isStartNewOrderOpen,
  setIsStartNewOrderOpen,
  selectedCustomer,
  setSelectedCustomer,
}) => {
  const { userInfo, allCities } = useContext(StateContext);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState([]);

  // Function to handle city selection
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

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value;
    const phone = form.phone.value;
    const address = form.address.value;
    const thana = selectedArea;
    const district = selectedCity;

    const customerInfo = {
      name,
      phone,
      address,
      thana,
      location: district,
      sellerId: userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId,
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
          EditUserLog(userInfo?._id, "Added a customer", `${name} added`);

          console.log(result?.result?._id);
          toast.success("created new customer");
          setSelectedCustomer(result?.result);
          setIsStartNewOrderOpen(false);
        } else {
          toast.error("failed to create customer");
        }
      });
  };

  const inputBox = "input-primary input h-10 w-80 focus-within:outline-none";

  return (
    <div>
      <ModalBox
        isModalOpen={isStartNewOrderOpen}
        setIsModalOpen={setIsStartNewOrderOpen}
      >
        <div className="flex flex-col">
          <p className="border-b p-4 text-xl font-bold">Customer Information</p>
          <form
            onSubmit={handleCreateCustomer}
            className="flex flex-col gap-4 px-10 py-4"
          >
            <label className="flex flex-col items-start gap-3">
              <input
                type="text"
                className={inputBox}
                placeholder="Mobile No."
                name="phone"
                required
              />
            </label>
            <label className="flex flex-col items-start gap-3">
              <input
                type="text"
                className={inputBox}
                placeholder="Customer Name"
                name="name"
                required
              />
            </label>
            <label className="flex flex-col items-start gap-3">
              <select
                className="select-primary select select-sm h-10 w-full max-w-xs focus-within:outline-none"
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
            </label>
            <label className="flex flex-col items-start gap-3">
              <select
                className="select-primary select select-sm h-10 w-full max-w-xs focus-within:outline-none"
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
            </label>
            <label className="flex flex-col items-start gap-3">
              <input
                type="text"
                className={inputBox}
                placeholder="Road / Flat No. / Village"
                name="address"
                required
              />
            </label>

            <label className="flex flex-col items-start gap-3">
              <input
                type="text"
                className={inputBox}
                placeholder="Bangladesh"
                value="Bangladesh"
                name="country"
                readOnly
              />
            </label>
            <div className="flex w-full justify-between gap-5">
              <button
                onClick={() => setIsStartNewOrderOpen(false)}
                type="reset"
                className=" btn-error btn-outline btn w-36"
              >
                Cancel
              </button>
              <button type="submit" className=" btn-primary btn w-36">
                Save
              </button>
            </div>
          </form>
        </div>
      </ModalBox>
    </div>
  );
};

export default StartOrderModal;
