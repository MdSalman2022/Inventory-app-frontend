import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../contexts/AuthProvider/AuthProvider";
import { StateContext } from "@/contexts/StateProvider/StateProvider";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RxDashboard } from "react-icons/rx";
import { BsFillBarChartFill, BsPeopleFill } from "react-icons/bs";
import { AiOutlineOrderedList, AiOutlineShoppingCart } from "react-icons/ai";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { CiDeliveryTruck } from "react-icons/ci";
import { PiCrownSimpleBold } from "react-icons/pi";
import { GiReturnArrow } from "react-icons/gi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CgDatabase } from "react-icons/cg";
import { FaExchangeAlt } from "react-icons/fa";

const Header = () => {
  const {
    couriers,
    userInfo,
    searchOrder,
    fetchOrderByName,
    refetchSearch,
    setSearchName,
  } = useContext(StateContext);
  const { user, logOut } = useContext(AuthContext);

  const activeCouriers =
    couriers?.filter((courier) => courier?.status === true) ?? [];
  console.log(activeCouriers);

  const pages = [
    {
      name: "dashboard",
      icon: <RxDashboard />,
      route: "/",
    },
    {
      name: "customers",
      icon: <BsPeopleFill />,
      route: "/customers",
    },
    {
      name: "start-order",
      icon: <AiOutlineShoppingCart />,
      route: "/start-order",
    },
    {
      name: "orders-processing",
      icon: <AiOutlineOrderedList />,
      route: "/orders-processing",
    },
    {
      name: "all-ready-orders",
      icon: <LiaFileInvoiceSolid />,
      route: "/all-ready-orders",
    },
    ...activeCouriers.map((courier) => ({
      name: courier?.name,
      icon: <CiDeliveryTruck />,
      route: `/couriers/${courier?.name}`,
    })),
    {
      name: "completed-orders",
      icon: <PiCrownSimpleBold />,
      route: "/completed-orders",
    },
    {
      name: "returned-orders",
      icon: <GiReturnArrow />,
      route: "/returned-orders",
    },
    {
      name: "cancelled-orders",
      icon: <RiDeleteBin5Line />,
      route: "/cancelled-orders",
    },
    {
      name: "products",
      icon: <CgDatabase />,
      route: "/products",
    },
    {
      name: "loss-profit",
      icon: <BsFillBarChartFill />,
      route: "/loss-profit",
    },
    {
      name: "transactions",
      icon: <FaExchangeAlt />,
      route: "/transactions",
    },
  ];

  let activeClassName = `bg-primary text-white rounded-lg w-full h-full`;

  const pagesForNonAdmin = pages.filter(
    (page) =>
      page.name !== "dashboard" &&
      page.name !== "customers" &&
      page.name !== "loss-profit"
  );

  const menus = [
    {
      name: "Settings",
      path: "/profile",
    },

    {
      name: "Users",
      path: "/users",
    },
    {
      name: "Couriers",
      path: "/couriers",
    },
    {
      name: "Stores",
      path: "/stores",
    },
    {
      name: "Products",
      path: "/products",
    },
    {
      name: "Suppliers",
      path: "/supplier",
    },
  ];

  const masterMenus = [
    {
      name: "Marchants",
      path: "/marchants",
    },
  ];

  console.log(user);
  const navigate = useNavigate();

  const SearchByName = async (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;

    console.log("name ", name);
    setSearchName(name);

    try {
      await fetchOrderByName(name);
      refetchSearch();
      toast.success("Order found successfully");
      navigate(`/orders/all?search=${name}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to find order");
    }
  };

  console.log("search result ", searchOrder);

  return (
    <div className="relative z-10">
      <div className="flex h-16 w-screen items-center justify-between bg-base-100 px-5 shadow-lg">
        <div className="flex md:hidden">
          <div className="dropdown-start dropdown">
            <label tabIndex={0} className="btn-ghost btn-circle btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu  rounded-box z-[1] mt-3 w-52 gap-1 bg-base-100 p-2 shadow"
            >
              {userInfo?.role === "Admin"
                ? pages?.map((page, index) => (
                    <li key={index}>
                      <NavLink
                        to={page.route}
                        className={({ isActive }) =>
                          isActive
                            ? activeClassName
                            : "h-full w-full text-gray-600"
                        }
                      >
                        <p className="flex h-5 cursor-pointer items-center justify-start gap-4 rounded-lg p-1 text-sm capitalize hover:text-white">
                          {page.icon}
                          {page.name}
                        </p>
                      </NavLink>
                    </li>
                  ))
                : pagesForNonAdmin.map((page, index) => (
                    <li key={index}>
                      <NavLink
                        to={page.route}
                        className={({ isActive }) =>
                          isActive ? activeClassName : "w-full text-gray-600"
                        }
                      >
                        <p className="flex h-5 cursor-pointer  items-center justify-start gap-4 rounded-lg p-1 text-sm capitalize hover:bg-primary hover:text-white">
                          {page.icon}
                          {page.name}
                        </p>
                      </NavLink>
                    </li>
                  ))}
            </ul>
          </div>

          <div className="flex">
            <a className="btn-ghost btn text-xl normal-case">
              <img
                className="h-10 w-full object-cover"
                src="https://i.ibb.co/TW8T2kc/logo-momley.png"
                alt=""
              />
            </a>
          </div>
        </div>
        <div className="hidden md:flex md:flex-1">
          <a className="btn-ghost btn text-xl normal-case">
            <img
              className="h-10 w-full object-cover"
              src="https://i.ibb.co/TW8T2kc/logo-momley.png"
              alt=""
            />
          </a>
        </div>
        <div className="flex items-center">
          <form
            onSubmit={SearchByName}
            className="hidden items-center gap-2 md:flex"
          >
            <p>Search</p>
            <input
              type="text"
              name="name"
              placeholder="Roton"
              className="input-bordered input w-60 rounded-full md:w-96"
            />
          </form>
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
              <div className="w-10 rounded-full">
                <img
                  src={
                    user?.photoURL ||
                    "https://static-00.iconduck.com/assets.00/user-avatar-icon-512x512-vufpcmdn.png"
                  }
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu  rounded-box z-[1] mt-3 w-52 gap-1 bg-base-100 p-2 shadow"
            >
              {userInfo?.Master === true &&
                masterMenus?.map((menu, index) => (
                  <li key={index}>
                    <Link to={menu.path} className="hover:bg-base-200">
                      {menu.name}
                    </Link>
                  </li>
                ))}
              {menus?.map((menu, index) => (
                <li key={index}>
                  <Link to={menu.path} className="hover:bg-base-200">
                    {menu.name}
                  </Link>
                </li>
              ))}

              {user?.uid && (
                <li>
                  <div onClick={logOut} className="hover:bg-base-200">
                    Logout
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
