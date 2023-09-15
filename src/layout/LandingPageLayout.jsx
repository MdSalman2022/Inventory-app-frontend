import Footer from "@/components/LandingPage/Footer";
import Header from "@/components/LandingPage/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const LandingPageLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default LandingPageLayout;
