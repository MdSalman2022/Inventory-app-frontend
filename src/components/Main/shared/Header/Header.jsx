import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
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
      path: "/suppliers",
    },
  ];

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
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input-bordered input w-60 rounded-full md:w-96"
            />
          </div>
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
              <div className="w-10 rounded-full">
                <img src="https://i.ibb.co/LpsnbCC/Rectangle-182.png" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu  rounded-box z-[1] mt-3 w-52 gap-1 bg-base-100 p-2 shadow"
            >
              {menus?.map((menu, index) => (
                <li key={index}>
                  <Link to={menu.path} className="hover:bg-base-200">
                    {menu.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
