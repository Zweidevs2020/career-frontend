import React, { useRef, useEffect, useState } from "react";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import jsPDF from 'jspdf';
import { MyCareerGuidanceInputField } from "../commonComponents";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DownloadPage from './DownloadPage';
import { API_URL } from "../../utils/constants";
import "./MyGoalStyle.css";
import { getApiWithAuth } from "../../utils/api";
import moment from 'moment';

const MyGoal = () => {
  const reportTemplateRef = useRef(null);

  const [proffession, setProffession] = useState('');
  const [actions, seActions] = useState('');
  const [goal, setGoal] = useState('');
  const [realistic, setRealistic] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [countdown3, setCountdown3] = useState('');
  const [countdown2, setCountdown2] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    getUserGoals()
  }, []);

  useEffect(() => {
    // Calculate time remaining
    const intervalId = setInterval(() => {
      if (countdown) {
        const now = new Date().getTime();
        const distance = countdown - now;
        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setCountdown2({ days, hours, minutes, seconds });
        } else {
          clearInterval(intervalId);
          setCountdown2({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdown]);

  const getUserGoals = async () => {
    const res= await getApiWithAuth(API_URL.GETUSERGOAL)
    if (res.data.data) {
      setGoal(res.data.data.goal);
      seActions(res.data.data.actions);
      setProffession(res.data.data.proffession);
      setRealistic(res.data.data.realistic);
      setCountdown(new Date(res.data.data.countdown))
      setCountdown3(dayjs(res.data.data.countdown).format("DD/MM/YYYY"));
    }
  }

  dayjs.extend(customParseFormat);
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  function handleDateChange(date) {
    if (date) {
      setCountdown(date.$d);
      setCountdown3(date);
    }
  }

  const DownloadBtn = () => {
    const doc = new jsPDF({
        format: 'a4',
        unit: 'px'
    });

    doc.html(reportTemplateRef.current, {
        async callback(doc) {
            await doc.save('Download');
        },
        html2canvas: { scale: 0.67 }
    });
  };

  const SaveInput = () => {
    console.log('print')
  };

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
                value={proffession}
                onChange={(e) => setProffession(e.target.value)}
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
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
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
                  checked={realistic ? true : false}
                  onChange={() => setRealistic(true)}
                  class="h-[24px] w-[24px] border-none text-[#fff] bg-[#1476B7] "
                />
                <p class="text-[#737373] sm:text-[14px] md:text-[16px] text-[18px]  ">
                  Yes
                </p>
              </div>
              <div class="h-[40px] w-[50%]  flex items-center justify-around ">
                <input
                  type="checkbox"
                  checked={!realistic ? true : false}
                  onChange={() => setRealistic(false)}
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
                  value={dayjs(countdown3, dateFormatList[0])}
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                  defaultValue={dayjs("01/01/2015", dateFormatList[0])}
                  // format={dateFormatList}
                />
              </Space>
            </div>
            <div className="timer">
              <div class="contact h-[110px] w-[97%] flex items-center justify-center gap-5 bg-white rounded-md border-solid border-2 border-gray-400  ">
                <div class="h-[80px] w-[10%]  flex flex-col items-center justify-center">
                  <p class="text-[#DB614D] text-[28px] font-bold sm:text-[16px] md:text-[16px] lg:text-[16px] ">
                    {countdown2.days} :
                  </p>
                  <p class="text-[#DB614D] text-[28px] font-bold sm:text-[14px] md:text-[16px] lg:text-[16px] ">
                    Days
                  </p>
                </div>
                <div class="h-[80px] w-[10%]  flex flex-col items-center justify-center">
                  <p class="text-[#474749] text-[28px] font-bold sm:text-[16px] md:text-[16px] lg:text-[16px] ">
                    {countdown2.hours} :
                  </p>
                  <p class="text-[#474749] text-[28px] font-bold  sm:text-[14px] md:text-[16px] lg:text-[16px] ">
                    Hours
                  </p>
                </div>
                <div class="h-[80px] w-[10%]  flex flex-col items-center justify-center">
                  <p class="text-[#474749] text-[28px] font-bold sm:text-[16px] md:text-[16px] lg:text-[16px] ">
                    {countdown2.minutes} :
                  </p>
                  <p class="text-[#474749] text-[28px] font-bold sm:text-[14px] md:text-[16px] lg:text-[16px] ">
                    Mins
                  </p>
                </div>
                <div class="h-[80px] w-[10%]  flex flex-col items-center justify-center">
                  <p class="text-[#474749] text-[28px] font-bold sm:text-[16px] md:text-[16px] lg:text-[16px] ">
                    {countdown2.seconds} :
                  </p>
                  <p class="text-[#474749] text-[28px] font-bold sm:text-[14px] md:text-[16px] lg:text-[16px] ">
                    Secs
                  </p>
                </div>
              </div>
            </div>
            <div style={{ display: 'none' }}>
                <div ref={reportTemplateRef} style={{ display: 'contents' }}>
                    <DownloadPage realistic={realistic} countdown3={countdown} setRealistic={setRealistic} goal={goal} proffession={proffession} actions={actions} countdown2={countdown2}  />
                </div>
            </div>
            <div className="buttonGoal">
              <button onClick={() => DownloadBtn()} className="buttonGoalPage">Download PDF</button>
              <button onClick={() => SaveInput()} className="buttonGoalPage">Save Data</button>
            </div>
            <br />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyGoal;
