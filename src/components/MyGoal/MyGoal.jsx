import React from "react";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import { MyCareerGuidanceInputField } from "../commonComponents";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "./MyGoalStyle.css";
const MyGoal = () => {
  dayjs.extend(customParseFormat);
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  return (
    <>
      <div className="mainPage">
        <div className="topContainer">
          <div>
            <h5 className="goalHeading">My Goal</h5>
          </div>
          <div className="subHead">
            <h className="subHeading">
              Lorem ipsum is a placeholder text commonly used to demonstrate
            </h>
          </div>
        </div>
        <div className="lowerContainer2">
          <div className="lowerContainer">
            <div className="employeGoal">
              <h className="employersContact">
                What’s the best way for employers to contact you?
              </h>
            </div>
            <div className="secondContainer">
              <h>What’s the best way for employers to contact you?</h>
            </div>
            <div className="inputContainer">
              <h style={{ color: "#111928" }}>What I want to Become:</h>
            </div>
            <div className="inputGoal">
              <input
                className="inputCarrer"
                type="text"
                name="input"
                placeholder="eg Accountant"
                class=" sm:text-[8px] md:text-[8px] xl:text-[11px] px-2 h-[50px] sm:w-[30%] sm:h-[35px] md:h-[38px] w-[97%] rounded-md border-solid border-2 border-gray-400 outline-none "
              />
            </div>
         
            <div className="inputContainer">
              <h style={{ color: "#111928" }}>Specific Goal for the Year:</h>
            </div>
            <div className="inputGoal">
              <input
                className="inputCarrer"
                type="text"
                name="input"
                placeholder="eg Accountant"
                class="  sm:text-[8px] md:text-[8px] xl:text-[11px] px-2 h-[50px] sm:w-[30%] sm:h-[35px] md:h-[38px] w-[97%] rounded-md border-solid border-2 border-gray-400 outline-none "
              />
            </div>
            <div className="inputContainer">
              <h style={{ color: "#111928" }}>
                5 Actions to Achieve the Above:
              </h>
            </div>
            <div
              className="h"
              class="w-[100%] h-[70px] w-[97%]  sm:h-[100px] sm:flex-wrap sm:flex flex items-center justify-around pl-4 "
            >
              <input
                type="text"
                name="input"
                placeholder="Write down your goal"
                class=" sm:text-[8px] md:text-[8px] xl:text-[11px] px-2 h-[50px] sm:w-[30%] sm:h-[35px] md:h-[38px] w-[19%] rounded-md border-solid border-2 border-gray-400 outline-none "
              />
              <input
                type="text"
                name="input"
                placeholder="Set a deadline"
                class=" px-2 sm:text-[8px] md:text-[8px] h-[50px] xl:text-[11px] w-[19%] sm:w-[30%] sm:h-[35px] md:h-[38px] rounded-md border-solid border-2 border-gray-400 outline-none "
              />
              <input
                type="text"
                name="input"
                placeholder="Work on your mindset"
                class=" sm:text-[8px] md:text-[8px] px-2 xl:text-[11px] h-[50px] sm:h-[35px] w-[19%] md:h-[38px] sm:w-[30%] rounded-md border-solid border-2 border-gray-400 outline-none "
              />
              <input
                type="text"
                name="input"
                placeholder="Develop your skillset"
                class=" sm:text-[8px] md:text-[8px] px-2 xl:text-[11px] h-[50px] sm:h-[35px] w-[19%] md:h-[38px] sm:w-[30%] rounded-md border-solid border-2 border-gray-400 outline-none "
              />
              <input
                type="text"
                name="input"
                placeholder="Reward yourself"
                class=" px-2 sm:text-[8px] md:text-[8px] h-[50px] xl:text-[11px] w-[19%] sm:h-[35px] sm:w-[30%] md:h-[38px]  rounded-md border-solid border-2 border-gray-400 outline-none "
              />
              <input
                type="text"
                name="input"
                placeholder="Reward yourself"
                class=" md:hidden lg:hidden xl:hidden xxl:hidden px-2 sm:text-[8px] h-[50px] w-[19%] sm:h-[35px] sm:w-[30%]  rounded-md border-solid border-2 border-gray-400 outline-none "
              />
            </div>
            <div className="inputContainer">
              <h style={{ color: "#111928" }}>Is this Realistic ?</h>
            </div>
            <div class="h-[50px] w-[20%]  sm:w-[50%] md:w-[40%] lg:w-[40%] flex items-center pl-2">
              <div class="h-[40px] w-[50%] flex items-center justify-around ">
                <input
                  type="checkbox"
                  class="h-[24px] w-[24px] border-none text-[#fff] bg-[#1476B7] "
                />
                <p class="text-[#737373] sm:text-[14px] md:text-[16px] text-[18px]  ">
                  Yes
                </p>
              </div>
              <div class="h-[40px] w-[50%]  flex items-center justify-around ">
                <input
                  type="checkbox"
                  class="h-[24px] w-[24px] border-none text-[#F4F6F8] bg[#F4F6F8] "
                />
                <p class="text-[#737373] sm:text-[14px] md:text-[16px] text-[18px] ">
                  No
                </p>
              </div>
            </div>
            <div className="inputContainer">
              <h style={{ color: "#111928" }}>How Long Do I have ?</h>
            </div>
            <div className="calenderGoal">
              <Space direction="vertical" size={12}>
                <DatePicker
                className="dateLibr"
                  defaultValue={dayjs("01/01/2015", dateFormatList[0])}
                  format={dateFormatList}
                />
              </Space>
            </div>
            <div className="timer">
              <div class="contact h-[110px] w-[97%] flex items-center justify-center gap-5 bg-white rounded-md border-solid border-2 border-gray-400  ">
                <div class="h-[80px] w-[10%]  flex flex-col items-center justify-center">
                  <p class="text-[#DB614D] text-[28px] font-bold sm:text-[16px] md:text-[16px] lg:text-[16px] ">
                    0 :
                  </p>
                  <p class="text-[#DB614D] text-[28px] font-bold sm:text-[14px] md:text-[16px] lg:text-[16px] ">
                    Days
                  </p>
                </div>
                <div class="h-[80px] w-[10%]  flex flex-col items-center justify-center">
                  <p class="text-[#474749] text-[28px] font-bold sm:text-[16px] md:text-[16px] lg:text-[16px] ">
                    0 :
                  </p>
                  <p class="text-[#474749] text-[28px] font-bold  sm:text-[14px] md:text-[16px] lg:text-[16px] ">
                    Hours
                  </p>
                </div>
                <div class="h-[80px] w-[10%]  flex flex-col items-center justify-center">
                  <p class="text-[#474749] text-[28px] font-bold sm:text-[16px] md:text-[16px] lg:text-[16px] ">
                    0 :
                  </p>
                  <p class="text-[#474749] text-[28px] font-bold sm:text-[14px] md:text-[16px] lg:text-[16px] ">
                    Mins
                  </p>
                </div>
                <div class="h-[80px] w-[10%]  flex flex-col items-center justify-center">
                  <p class="text-[#474749] text-[28px] font-bold sm:text-[16px] md:text-[16px] lg:text-[16px] ">
                    0 :
                  </p>
                  <p class="text-[#474749] text-[28px] font-bold sm:text-[14px] md:text-[16px] lg:text-[16px] ">
                    Secs
                  </p>
                </div>
              </div>
            </div>
            <div className="buttonGoal">
              <button className="buttonGoalPage">Donload PDF</button>
            </div>
            <br />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyGoal;
