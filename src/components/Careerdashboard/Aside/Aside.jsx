import React from "react";
import mycareer from "../../../assets/mycareer.png";
import Group from "../../../assets/Group.svg";
import logout from "../../../assets/logout.svg";
import Home from "../../../assets/Home.svg";
import Gp from "../../../assets/Gp.svg";
import assesment from "../../../assets/assesment.svg";
import profile from "../../../assets/profile.svg";
import goal from "../../../assets/goal.svg";
import study from "../../../assets/study.svg";
const Aside = () => {
  return (
    <>
      <div
        className="h-[90px] w-[100%] flex items-center justify-center"
      >
        <img src={mycareer} className="h-[45px] lg:h-[35px]" />
      </div>
      <div
        className="w-[100%]  flex flex-col items-center justify-center gap-[5px]"
      >
        <div className="h-[40px] w-[90%] md:w-[95%]  flex items-center  justify-around">
          <div className="h-[30px] w-[15%] flex items-center justify-center">
            <img src={Home} className="" />
          </div>
          <div className="h-[30px] w-[60%] lg:w-[65%] flex items-center justify-start">
            <p className="text-[#1476B7] text-md    lg:text-[14px] font-bold">
              Overview
            </p>
          </div>
        </div>
        <div className="h-[40px] w-[90%] md:w-[95%] flex items-center  justify-around ">
          <div className="h-[30px] w-[15%] flex items-center justify-center">
            <img src={Gp} className="text-[#BDBDBD]" />
          </div>
          <div className="h-[30px] w-[60%] lg:w-[65%] flex items-center justify-start">
            <p className="text-[#737373] text-md font-lighter lg:text-[12px] ">
              CAO Calculator
            </p>
          </div>
        </div>
        <div className="h-[40px] w-[90%] md:w-[95%]   flex items-center  justify-around">
          <div className="h-[30px] w-[15%] flex items-center justify-center">
            <img src={goal} className="text-[#BDBDBD]" />
          </div>
          <div className="h-[30px] w-[60%] lg:w-[65%]  flex items-center justify-start">
            <p className="text-[#737373] text-md font-lighter lg:text-[12px]">
              My Goals
            </p>
          </div>
        </div>
        <div className="h-[40px] w-[90%] md:w-[95%]   flex items-center  justify-around">
          <div className="h-[30px] w-[15%]  flex items-center justify-center">
            <img src={profile} className="text-[#BDBDBD]" />
          </div>
          <div className="h-[30px] w-[60%] lg:w-[65%]  flex items-center justify-start">
            <p className="text-[#737373] text-md font-lighter lg:text-[12px]">
              CV/Cover Later
            </p>
          </div>
        </div>
        <div className="h-[40px] w-[90%]  flex items-center  justify-around">
          <div className="h-[30px] w-[15%]  flex items-center justify-center">
            <img src={assesment} className="text-[#BDBDBD]" />
          </div>
          <div className="h-[30px] w-[60%] lg:w-[65%]  flex items-center justify-start">
            <p className="text-[#737373] text-md font-lighter lg:text-[12px]">
              Self Assessment
            </p>
          </div>
        </div>
        <div className="h-[40px] w-[90%] md:w-[95%]   flex items-center  justify-around">
          <div className="h-[30px] w-[15%]  flex items-center justify-center">
            <img src={study} className="text-[#BDBDBD]" />
          </div>
          <div className="h-[30px] w-[60%] lg:w-[65%]  flex items-center justify-start">
            <p className="text-[#737373] text-md font-lighter lg:text-[12px]">
              My Study{" "}
            </p>
          </div>
        </div>
      </div>
      <div
        className="h-[201px] w-[100%]  flex items-center justify-center"
      >
        <img src={Group} className="h-[190px] lg:h-[130px]" />
      </div>
      <div
        className="h-[80px] w-[100%]  flex items-center justify-center"
      >
        <div className=" h-[40px] w-[70%] bg-[#1476B7] rounded-lg flex items-center justify-evenly">
          <img src={logout} className="h-[26px]" />
          <button className="text-[#fff]">Logout</button>
        </div>
      </div>
    </>
  );
};

export default Aside;
