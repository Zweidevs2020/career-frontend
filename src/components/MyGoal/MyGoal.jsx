import React, { useRef, useEffect, useState } from "react";
import { DatePicker, Space, Spin, message, Radio } from "antd";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import { MyCareerGuidanceButton } from "../commonComponents";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DownloadPage from "./DownloadPage";
import { API_URL } from "../../utils/constants";
import "./MyGoalStyle.css";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
import moment from "moment";

const MyGoal = () => {
  const reportTemplateRef = useRef(null);

  const [proffession, setProffession] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [goal, setGoal] = useState("");
  const [realistic, setRealistic] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [countdown3, setCountdown3] = useState(dayjs().format("DD-MM-YYYY"));
  const [countdown2, setCountdown2] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [actions, seActions] = useState({
    action1: "",
    action2: "",
    action3: "",
    action4: "",
    action5: "",
  });

  useEffect(() => {
    getUserGoals();
  }, []);

  useEffect(() => {
    // Calculate time remaining
    const intervalId = setInterval(() => {
      if (countdown) {
        const now = new Date().getTime();
        const distance = countdown - now;
        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
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
    setLoading(true);
    const res = await getApiWithAuth(API_URL.GETUSERGOAL);
    if (res.data.data) {
      setGoal(res.data.data.goal);
      seActions(res.data.data.action);
      setProffession(res.data.data.proffession);
      setRealistic(res.data.data.realistic);
      setCountdown(
        res.data.data.countdown === null
          ? dayjs().format("DD-MM-YYYY")
          : new Date(res.data.data.countdown)
      );
      setCountdown3(
        res.data.data.countdown === null
          ? dayjs().format("DD-MM-YYYY")
          : dayjs(res.data.data.countdown).format("DD-MM-YYYY")
      );
      setLoading(false);
    }
  };

  dayjs.extend(customParseFormat);

  function handleDateChange(date) {
    if (date) {
      setCountdown(date.$d);
      setCountdown3(date);
    }
  }

  const DownloadBtn = () => {
    const doc = new jsPDF({
      format: "a4",
      unit: "px",
    });

    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save("Download");
      },
      html2canvas: { scale: 0.67 },
    });
  };

  const SaveInput = async () => {
    setLoading2(true);
    const data = {
      proffession: proffession,
      goal: goal,
      actions: actions,
      realistic: realistic,
      date: dayjs(countdown).format("DD-MM-YYYY"),
    };
    const response = await postApiWithAuth(API_URL.POSTUSERGOAL, data);

    if (response.data.status === 200) {
      message.success("Goals set successfully");
      setLoading2(false);
    } else {
      setLoading2(false);
      message.error(response.data.message);
    }
  };

  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    seActions({ ...actions, [name]: value });
  };
  return (
    <>
      {loading ? (
        <Spin className="spinStyle" />
      ) : (
        <div className="mainPage">
          <div className="topContainer">
            <div>
              <h5 className="goalHeading">My Goals</h5>
            </div>
            <div className="subHead">
              <h className="subHeading">
                Writing down your goal increases your chances of success. Fill
                out this form to view any time or print and put you can see
                daily.
              </h>
            </div>
          </div>
          <div className="lowerContainer2">
            <div className="lowerContainer">
              {/* <div className="employeGoal">
                <h className="employersContact">
                  What’s the best way for employers to contact you?
                </h>
              </div>
              <div className="secondContainer">
                <h>What’s the best way for employers to contact you?</h>
              </div> */}
              <div className="inputContainer">
                <h style={{ color: "#111928" }}>What I want to:</h>
              </div>
              <div className="inputGoal">
                <input
                  type="text"
                  value={proffession}
                  onChange={(e) => setProffession(e.target.value)}
                  name="input"
                  placeholder=" EG: Accountant or Save the planet"
                  className="inputCarrer sm:text-[8px] md:text-[8px] xl:text-[11px] px-2 h-[50px] sm:w-[30%] sm:h-[35px] md:h-[38px] w-[97%] rounded-md border-solid border-2 border-gray-400 outline-none "
                />
              </div>

              <div className="inputContainer">
                <h style={{ color: "#111928" }}>
                  Specific goal for week/month/term/year:
                </h>
              </div>
              {/* <div className="inputGoal">
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  name="input"
                  placeholder="eg Accountant"
                  className="inputCarrer  sm:text-[8px] md:text-[8px] xl:text-[11px] px-2 h-[50px] sm:w-[30%] sm:h-[35px] md:h-[38px] w-[97%] rounded-md border-solid border-2 border-gray-400 outline-none "
                />
              </div> */}
              <div className="inputGoal">
                <div className="mt-3">
                  <Radio.Group
                    name="input"
                    onChange={(e) => setGoal(e.target.value)}
                    value={goal}
                  >
                    <Space direction="horizontal">
                      <Radio value={"week"}>Week</Radio>
                      <Radio value={"month"}>Month</Radio>
                      <Radio value={"term"}>Term</Radio>
                      <Radio value={"year"}>Year</Radio>
                    </Space>
                  </Radio.Group>
                </div>
              </div>
              <div className="inputContainer">
                <h style={{ color: "#111928" }}>
                  2 actions to achieve the above:
                </h>
              </div>
              <div className="w-[100%] h-[100px] pl-4 ">
                <input
                  type="text"
                  placeholder="Action 1"
                  name="action1"
                  value={actions.action1}
                  className=" sm:text-[8px] md:text-[8px] xl:text-[11px] px-2 mt-2 h-[50px] sm:w-[30%] sm:h-[35px] md:h-[38px] w-[100%] rounded-md border-solid border-2 border-gray-400 outline-none "
                  onChange={(e) => {
                    onChangeHandle(e);
                  }}
                />
                <input
                  type="text"
                  placeholder="Action 2"
                  name="action2"
                  value={actions.action2}
                  className=" px-2 sm:text-[8px] md:text-[8px] mt-2 h-[50px] xl:text-[11px] w-[100%] sm:w-[30%] sm:h-[35px] md:h-[38px] rounded-md border-solid border-2 border-gray-400 outline-none "
                  onChange={(e) => {
                    onChangeHandle(e);
                  }}
                />
                {/* <input
                  type="text"
                  name="action3"
                  value={actions.action3}
                  placeholder="Work on your mindset"
                  className=" sm:text-[8px] md:text-[8px] px-2 xl:text-[11px] h-[50px] sm:h-[35px] w-[19%] md:h-[38px] sm:w-[30%] rounded-md border-solid border-2 border-gray-400 outline-none "
                  onChange={(e) => {
                    onChangeHandle(e);
                  }}
                />
                <input
                  type="text"
                  name="action4"
                  value={actions.action4}
                  placeholder="Develop your skillset"
                  className=" sm:text-[8px] md:text-[8px] px-2 xl:text-[11px] h-[50px] sm:h-[35px] w-[19%] md:h-[38px] sm:w-[30%] rounded-md border-solid border-2 border-gray-400 outline-none "
                  onChange={(e) => {
                    onChangeHandle(e);
                  }}
                />
                <input
                  type="text"
                  name="action5"
                  value={actions.action5}
                  placeholder="Reward yourself"
                  className=" px-2 sm:text-[8px] md:text-[8px] h-[50px] xl:text-[11px] w-[19%] sm:h-[35px] sm:w-[30%] md:h-[38px]  rounded-md border-solid border-2 border-gray-400 outline-none "
                  onChange={(e) => {
                    onChangeHandle(e);
                  }}
                /> */}
              </div>
              <div className="inputContainer">
                <h style={{ color: "#111928" }}>Is this realistic ?</h>
              </div>
              <div className="h-[50px] w-[20%]  sm:w-[50%] md:w-[40%] lg:w-[40%] flex items-center pl-2">
                <div className="h-[40px] w-[50%] flex items-center justify-around ">
                  <input
                    type="checkbox"
                    checked={realistic ? true : false}
                    onChange={() => setRealistic(true)}
                    className="h-[24px] w-[24px] border-none text-[#fff] bg-[#1476B7] "
                  />
                  <p className="text-[#737373] sm:text-[14px] md:text-[16px] text-[18px]  ">
                    Yes
                  </p>
                </div>
                <div className="h-[40px] w-[50%]  flex items-center justify-around ">
                  <input
                    type="checkbox"
                    checked={!realistic ? true : false}
                    onChange={() => setRealistic(false)}
                    className="h-[24px] w-[24px] border-none text-[#F4F6F8] bg[#F4F6F8] "
                  />
                  <p className="text-[#737373] sm:text-[14px] md:text-[16px] text-[18px] ">
                    No
                  </p>
                </div>
              </div>
              <div className="inputContainer">
                <h style={{ color: "#111928" }}>How long do I have ?</h>
              </div>
              <div className="calenderGoal">
                <Space direction="vertical" size={12}>
                  <DatePicker
                    className="dateLibr"
                    value={dayjs(countdown3, "DD-MM-YYYY")}
                    onChange={handleDateChange}
                    format="DD-MM-YYYY"
                    // defaultValue={dayjs("01/01/2015", "DD-MM-YYYY")}
                  />
                </Space>
              </div>
              <div className="timer">
                <div className="contact h-[110px] w-[97%] flex items-center justify-center gap-5 bg-white rounded-md border-solid border-2 border-gray-400  ">
                  <div className="h-[80px] w-[10%]  flex flex-col items-center justify-center">
                    <p className="text-[#DB614D] text-[28px] font-bold sm:text-[16px] md:text-[16px] lg:text-[16px] ">
                      {countdown2.days} :
                    </p>
                    <p className="text-[#DB614D] text-[28px] font-bold sm:text-[14px] md:text-[16px] lg:text-[16px] ">
                      Days
                    </p>
                  </div>
                  <div className="h-[80px] w-[10%]  flex flex-col items-center justify-center">
                    <p className="text-[#474749] text-[28px] font-bold sm:text-[16px] md:text-[16px] lg:text-[16px] ">
                      {countdown2.hours} :
                    </p>
                    <p className="text-[#474749] text-[28px] font-bold  sm:text-[14px] md:text-[16px] lg:text-[16px] ">
                      Hours
                    </p>
                  </div>
                  <div className="h-[80px] w-[10%]  flex flex-col items-center justify-center">
                    <p className="text-[#474749] text-[28px] font-bold sm:text-[16px] md:text-[16px] lg:text-[16px] ">
                      {countdown2.minutes} :
                    </p>
                    <p className="text-[#474749] text-[28px] font-bold sm:text-[14px] md:text-[16px] lg:text-[16px] ">
                      Mins
                    </p>
                  </div>
                  <div className="h-[80px] w-[10%]  flex flex-col items-center justify-center">
                    <p className="text-[#474749] text-[28px] font-bold sm:text-[16px] md:text-[16px] lg:text-[16px] ">
                      {countdown2.seconds} :
                    </p>
                    <p className="text-[#474749] text-[28px] font-bold sm:text-[14px] md:text-[16px] lg:text-[16px] ">
                      Secs
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ display: "none" }}>
                <div ref={reportTemplateRef} style={{ display: "contents" }}>
                  <DownloadPage
                    realistic={realistic}
                    countdown3={countdown}
                    setRealistic={setRealistic}
                    goal={goal}
                    proffession={proffession}
                    actions={actions}
                    countdown2={countdown2}
                  />
                </div>
              </div>
              <div className="buttonGoal">
                <button
                  onClick={() => DownloadBtn()}
                  className="buttonGoalPage"
                >
                  Download PDF
                </button>
                <MyCareerGuidanceButton
                  label=" Save Data"
                  loading={loading2}
                  className="buttonGoalPage"
                  onClick={() => SaveInput()}
                />
              </div>
              <br />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyGoal;
