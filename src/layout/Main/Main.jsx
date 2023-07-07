import React from "react";
import Header from "../../components/Main/shared/Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../../components/Main/shared/Footer/Footer";
import SideBar from "../../components/Main/shared/SideBar";

const Main = () => {
  return (
    <div>
      <Header />
      <SideBar>
        <div className="flex flex-col justify-between h-full">
          <Outlet />
          <Footer />
        </div>
      </SideBar>
    </div>
  );
};

export default Main;
