import React from "react";
import logo from "../../assets/reve.png";

const Footer = () => {
  return (
    <div className="flex flex-col gap-10 bg-[#393A3D] px-3 pb-5 pt-20 text-white md:px-10">
      <img className="w-60" src={logo} alt="" />
      <div className="flex h-full flex-col items-center justify-center text-start">
        <p className="text-xl leading-6">
          OrderBoi is product of Reveinfosys. Terms and conditions, features,
          support, and service options <br /> subject to change without notice.{" "}
          <br />
          <br /> By accessing and using this page you agree to the Terms and
          Conditions.
        </p>
      </div>
      <div className="flex w-full flex-col-reverse  items-center justify-between gap-5 md:flex-row md:gap-0">
        <p className="text-center md:text-start">
          © 2023 Reveinfosys. All rights reserved.
        </p>
        <div className="flex flex-col gap-5 text-center md:flex-row md:text-start">
          <p className="border-white pr-5 md:border-r">Legal</p>
          <p className="border-white pr-5 md:border-r">Privacy</p>
          <p className="border-white pr-5 md:border-r">Terms of Service</p>
          <p className="pr-5">Contact</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
