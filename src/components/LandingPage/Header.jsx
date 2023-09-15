import React, { useContext } from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthProvider/AuthProvider";

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex h-[90px] flex-col justify-center bg-white">
      <div className="flex items-center justify-between px-3 md:px-10 md:py-4">
        <div>
          <img
            className="w-32 object-contain md:h-10 md:w-full md:object-cover"
            src={logo}
            alt=""
          />
        </div>
        <div>
          <Link
            to={user ? "/inventory/overview" : "/login"}
            className="btn-success btn border-none bg-[#2CA01C] text-white"
          >
            Login / Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
