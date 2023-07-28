import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../contexts/AuthProvider/AuthProvider";
import { StateContext } from "@/contexts/StateProvider/StateProvider";
import { toast } from "react-hot-toast";

const Header = () => {
  const { userInfo, searchOrder, setSearchOrder } = useContext(StateContext);
  const { user, logOut } = useContext(AuthContext);

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

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/order/search-order-by-name?name=${name}&sellerId=${
          userInfo?.role === "Admin" ? userInfo?._id : userInfo?.sellerId
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const resultFromDB = await response.json();
        if (resultFromDB.success) {
          console.log("order info", resultFromDB);
          toast.success("Order found successfully");
          setSearchOrder(resultFromDB.orders);
          navigate(`/orders/all?search=${name}`);
        } else {
          toast.error("Failed to find order");
        }
      } else {
        toast.error("Failed to find order");
        throw new Error("Failed to find order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to find order");
    }
  };

  console.log("search result ", searchOrder);

  return (
    <div className="relative z-10">
      <div className="navbar bg-base-100 px-5 shadow-lg">
        <div className="flex-1">
          <a className="btn-ghost btn text-xl normal-case">
            <img
              className="h-10 w-full object-cover"
              src="https://i.ibb.co/TW8T2kc/logo-momley.png"
              alt=""
            />
          </a>
        </div>
        <div className="flex-none gap-2">
          <form onSubmit={SearchByName} className="flex items-center gap-2">
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
