import React, { useRef, useEffect, useState } from "react";
import { DatePicker, Space, Spin, message, Radio, Button, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import { MyCareerGuidanceButton } from "../commonComponents";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DownloadPage from "./DownloadPage";
import { API_URL } from "../../utils/constants";
import "./MyGoalStyle.css";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
import moment from "moment";
import { PDFDocument, rgb } from "pdf-lib";

const MyGoal = () => {
  const reportTemplateRef = useRef(null);

  const [proffession, setProffession] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const [goal, setGoal] = useState("");
  const [realistic, setRealistic] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [description, setDescription] = useState("");
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
      // setGoal(res.data.data.goal);
      setDescription(res.data.data.description);
      seActions(res.data.data.action);
      setProffession(res.data.data.proffession);
      setDescription(res.data.data.description);
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

const DownloadBtn = async () => {
  setLoading3(true);
  const res = await getApiWithAuth(API_URL.GETMYGOALPDF);
  if (res.data.status === 200) {
    const data = res.data.data;

    const pdfBytes = Uint8Array.from(
      [...data].map((char) => char.charCodeAt(0))
    );

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

    const link = document.createElement("a");
    link.href = pdfDataUri;
    link.download = `${proffession}.pdf`;
    link.dispatchEvent(new MouseEvent("click"));

    // ✅ ADD THIS
    message.success("PDF downloaded successfully!");

    setLoading3(false);
  } else {
    setLoading3(false);
  }
};

  const SaveInput = async () => {
    if (realistic) {
      setLoading2(true);
      const data = {
        proffession: proffession,
        // goal: goal,
        description: description,
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
    } else {
      message.error("Realistic should be Yes ");
    }
  };

  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    seActions({ ...actions, [name]: value });
  };

  const disabledDate = (current) => {
    const today = dayjs().startOf("day");

    return current < today;
  };

  return (
    <>
      {loading ? (
        <Spin className="spinStyle" />
      ) : (
        <div className="mainPage ">
          <div className="topContainer bg-[#e06eb1]">
            <div>
              <h5 className="goalHeading">My Goals</h5>
            </div>
            <div className="subHead">
              <h className="subHeading !text-white">
                Writing down your goal increases your chances of success. Fill
                out this form to view any time or print and put you can see
                daily.
              </h>
            </div>
          </div>
          <div className="lowerContainer2 bg-[#e06eb1]">
            <div className="lowerContainer">
              <div className="inputContainer">
                <h style={{ color: "#111928" }}>What I want to:</h>
              </div>
              <div className="inputGoal">
                <input
                  type="text"
                  value={proffession}
                  onChange={(e) => setProffession(e.target.value)}
                  name="input"
                  placeholder=" EG: Accountant or save the planet"
                  className="inputCarrer sm:text-[8px] md:text-[10px] xl:text-[11px] px-2 h-[50px] sm:w-[30%] sm:h-[35px] md:h-[38px] w-[97%] rounded-md border-solid border-2 border-gray-400 outline-none "
                />
              </div>
              <div className="inputContainer">
                <h style={{ color: "#111928" }}>
                  2 Actions to achieve the above:
                </h>
              </div>
              <div className="w-[100%] h-[100px] pl-4 ">
                <input
                  type="text"
                  placeholder="Action 1"
                  name="action1"
                  value={actions.action1}
                  style={{ width: "97%" }}
                  className=" sm:text-[8px] md:text-[10px] xl:text-[11px] px-2 mt-2 h-[50px] sm:w-[30%] sm:h-[35px] md:h-[38px] w-[100%] rounded-md border-solid border-2 border-gray-400 outline-none "
                  onChange={(e) => {
                    onChangeHandle(e);
                  }}
                />
                <input
                  type="text"
                  placeholder="Action 2"
                  name="action2"
                  value={actions.action2}
                  style={{ width: "97%" }}
                  className=" px-2 sm:text-[8px] md:text-[10px] mt-2 h-[50px] xl:text-[11px] w-[100%] sm:w-[30%] sm:h-[35px] md:h-[38px] rounded-md border-solid border-2 border-gray-400 outline-none "
                  onChange={(e) => {
                    onChangeHandle(e);
                  }}
                />
              </div>
              <div className="inputContainer">
                <h style={{ color: "#111928" }}>Is this realistic ?</h>
              </div>
              <div className="h-[50px] w-[20%]  sm:w-[50%] md:w-[40%] lg:w-[40%] flex items-center pl-2">
                <div className="h-[40px] w-[50%] flex items-center justify-around ">
                  <input
                    type="checkbox"
                    style={{ cursor: "pointer" }}
                    checked={realistic ? true : false}
                    onChange={() => setRealistic(true)}
                    className="h-[24px] w-[24px] border-none text-[#fff] bg-[#1476B7] "
                  />
                  <p className="text-[#737373] sm:text-[14px] md:text-[14px] text-[14px]  ">
                    Yes
                  </p>
                </div>
                <div className="h-[40px] w-[50%]  flex items-center justify-around ">
                  <input
                    type="checkbox"
                    style={{ cursor: "pointer" }}
                    checked={!realistic ? true : false}
                    onChange={() => setRealistic(false)}
                    className="h-[24px] w-[24px] border-none text-[#F4F6F8] bg[#F4F6F8] "
                  />
                  <p className="text-[#737373] sm:text-[14px] md:text-[14px] text-[14px] ">
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
                    className="dateLibr px-2 sm:text-[8px] md:text-[10px] mt-2 h-[50px] xl:text-[11px] w-[100%] sm:w-[30%] sm:h-[35px] md:h-[38px] rounded-md border-solid border-2 border-gray-400 outline-none"
                    value={dayjs(countdown3, "DD-MM-YYYY")}
                    onChange={handleDateChange}
                    disabledDate={disabledDate}
                    format="DD-MM-YYYY"
                    allowClear={false}
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
                    // goal={goal}
                    proffession={proffession}
                    actions={actions}
                    countdown2={countdown2}
                    description={description}
                  />
                </div>
              </div>
              <div className="buttonGoal">
                <Button
                  loading={loading3}
                  className="createNewReportBtn"
                  onClick={() => DownloadBtn()}
                >
                  Download PDF
                </Button>
              <div className="mr-8">
                <Button
                  loading={loading2}
                  className="createNewReportBtn"
                  onClick={() => SaveInput()}
                >
                  Save Data
                </Button>
                </div>

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
