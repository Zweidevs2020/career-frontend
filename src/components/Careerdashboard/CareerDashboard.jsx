import React from "react";
import Navbar from "./Navbar";
import Aside from "./Aside";
import Main from "./Main";
import Right from "./Right";

const CareerDashboard = () => {
  return (
    <div
      className="h-[100vh] w-[100%] bg-[#F5F5F5] grid grid-cols-12  "
    >
      <div
        className="bg-white w-[100%] col-span-7 sm:col-span-12 md:col-span-8 "
        style={{ borderRight: "2px solid #F0F0F0" }}
      >
        <Main />
      </div>
      <div className=" bg-white  w-[100%] col-span-5 sm:col-span-12 md:col-span-4">
        <Right />
      </div>
    </div>
  );
};

export default CareerDashboard;
