import React, { useContext } from "react";
import { RxDashboard } from "react-icons/rx";
import { BsPeopleFill, BsFillBarChartFill } from "react-icons/bs";
import { AiOutlineOrderedList, AiOutlineShoppingCart } from "react-icons/ai";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { CiDeliveryTruck } from "react-icons/ci";
import { PiCrownSimpleBold } from "react-icons/pi";
import { GiReturnArrow } from "react-icons/gi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CgDatabase } from "react-icons/cg";
import { BiLogOut } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";
import { FaExchangeAlt } from "react-icons/fa";
import { StateContext } from "../../../contexts/StateProvider/StateProvider";
import { AuthContext } from "../../../contexts/AuthProvider/AuthProvider";

const SideBar = ({ children }) => {
  const { couriers, userInfo } = useContext(StateContext);

  const activeCouriers =
    couriers?.filter((courier) => courier?.status === true) ?? [];
  console.log(activeCouriers);

  const pages = [
    {
      name: "dashboard",
      icon: <RxDashboard />,
      route: "overview",
    },
    {
      name: "customers",
      icon: <BsPeopleFill />,
      route: "customers",
    },
    {
      name: "Create order",
      icon: <AiOutlineShoppingCart />,
      route: "start-order",
    },
    {
      name: "orders-processing",
      icon: <AiOutlineOrderedList />,
      route: "orders-processing",
    },
    /*    {
      name: "all-ready-orders",
      icon: <LiaFileInvoiceSolid />,
      route: "all-ready-orders",
    }, */
    ...activeCouriers.map((courier) => ({
      name: courier?.name,
      icon: <CiDeliveryTruck />,
      route: `couriers/${courier?.name}`,
    })),
    {
      name: "completed-orders",
      icon: <PiCrownSimpleBold />,
      route: "completed-orders",
    },
    {
      name: "cancelled-orders",
      icon: <RiDeleteBin5Line />,
      route: "cancelled-orders",
    },
    {
      name: "returned-orders",
      icon: <GiReturnArrow />,
      route: "returned-orders",
    },

    {
      name: "products",
      icon: <CgDatabase />,
      route: "products",
    },
    {
      name: "loss-profit",
      icon: <BsFillBarChartFill />,
      route: "loss-profit",
    },
    {
      name: "transactions",
      icon: <FaExchangeAlt />,
      route: "transactions",
    },
  ];

  let activeClassName = `bg-primary text-white rounded-lg`;

  const pagesForNonAdmin = pages.filter(
    (page) =>
      page.name !== "dashboard" &&
      page.name !== "customers" &&
      page.name !== "loss-profit"
  );

  return (
    <div>
      <div className="flex grid-cols-7 text-black md:grid">
        <div className="col-span-1 hidden h-full bg-white md:block">
          <div className="flex h-[93vh] w-full flex-col gap-2 bg-white px-5 py-4">
            {userInfo?.role === "Admin"
              ? pages.map((page, index) => (
                  <NavLink
                    key={index}
                    to={page.route}
                    className={({ isActive }) =>
                      isActive ? activeClassName : "text-gray-600"
                    }
                  >
                    <p className="flex cursor-pointer items-center  justify-start gap-4 rounded-lg p-2 text-sm capitalize hover:bg-primary hover:text-white">
                      {page.icon}
                      {page.name}
                    </p>
                  </NavLink>
                ))
              : pagesForNonAdmin.map((page, index) => (
                  <NavLink
                    key={index}
                    to={page.route}
                    className={({ isActive }) =>
                      isActive ? activeClassName : "text-gray-600"
                    }
                  >
                    <p className="flex cursor-pointer items-center  justify-start gap-4 rounded-lg p-2 text-sm capitalize hover:bg-primary hover:text-white">
                      {page.icon}
                      {page.name}
                    </p>
                  </NavLink>
                ))}
          </div>
        </div>
        <div className="col-span-7 md:col-span-6 md:px-5">{children}</div>
      </div>
    </div>
  );
};

export default SideBar;
