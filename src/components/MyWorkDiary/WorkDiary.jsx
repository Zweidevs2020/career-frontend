import { Spin, Button, message } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import DayOne from "./DayOne";
import DayTwo from "./DayTwo";
import DayThree from "./DayThree";
import DayFour from "./DayFour";
import DayFive from "./DayFive";
import DaySix from "./DaySix";
import DaySeven from "./DaySeven";
import DayEight from "./DayEight";
import DayNine from "./DayNine";
import DayTen from "./DayTen";
import QuizTime from "./QuizTime";
import { API_URL } from "../../utils/constants";
import { getToken } from "../../utils/LocalStorage";
import day1Graphic from "../../assets/workDiaryDays/day-1.png";
import day2Graphic from "../../assets/workDiaryDays/day-2.png";
import day3Graphic from "../../assets/workDiaryDays/day-3.png";
import day4Graphic from "../../assets/workDiaryDays/day-4.png";
import day5Graphic from "../../assets/workDiaryDays/day-5.png";
import day6Graphic from "../../assets/workDiaryDays/day-6.png";
import day7Graphic from "../../assets/workDiaryDays/day-7.png";
import day8Graphic from "../../assets/workDiaryDays/day-8.png";
import day9Graphic from "../../assets/workDiaryDays/day-9.png";
import day10Graphic from "../../assets/workDiaryDays/day-10.png";
import "./WorkDiary.css";

const WorkDiary = () => {
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [activeDay, setActiveDay] = useState("");
  const [currentDay, setCurrentDay] = useState(1);

  const dayComponents = [
    { label: "Day 1", key: "DayOne", component: <DayOne />, graphic: day1Graphic, accent: "#2bb3a3" },
    { label: "Day 2", key: "DayTwo", component: <DayTwo />, graphic: day2Graphic, accent: "#5566c4" },
    { label: "Day 3", key: "DayThree", component: <DayThree />, graphic: day3Graphic, accent: "#c9566a" },
    { label: "Day 4", key: "DayFour", component: <DayFour />, graphic: day4Graphic, accent: "#1f7fa8" },
    { label: "Day 5", key: "DayFive", component: <DayFive />, graphic: day5Graphic, accent: "#9a4797" },
    { label: "Day 6", key: "DaySix", component: <DaySix />, graphic: day6Graphic, accent: "#2a8a5e" },
    { label: "Day 7", key: "DaySeven", component: <DaySeven />, graphic: day7Graphic, accent: "#a5613c" },
    { label: "Day 8", key: "DayEight", component: <DayEight />, graphic: day8Graphic, accent: "#3466b8" },
    { label: "Day 9", key: "DayNine", component: <DayNine />, graphic: day9Graphic, accent: "#b4437a" },
    { label: "Day 10", key: "DayTen", component: <DayTen />, graphic: day10Graphic, accent: "#5f7f33" },
    // { label: "Quiz", key: "QuizTime", component: <QuizTime /> },
  ];
  useEffect(() => {
    // Set the start date of Day 1
    const startDate = new Date("2024-11-01"); // Change this to your desired start date
    const today = new Date();

    // Calculate the difference in days between today and the start date
    const diffInDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

    // Determine the active day based on the difference
    let dayIndex = diffInDays % dayComponents.length; // Loop back to Day 1 after Day 10

    // If DayIndex exceeds 10, reset it to Day 1
    if (dayIndex > 9) {
      dayIndex = 0; // Reset to Day 1 after Day 10
    }

    setCurrentDay(dayIndex + 1);
    setActiveDay(dayComponents[dayIndex].key);
  }, [dayComponents.length]);

  // useEffect(() => {
  //   // Set the start date of Day 1
  //   const startDate = new Date("2024-11-01"); // Change this to your desired start date
  //   const today = new Date();

  //   // Calculate the difference in days between today and the start date
  //   const diffInDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

  //   // Determine the active day based on the difference
  //   const dayIndex = diffInDays % dayComponents.length; // Loop back to Day 1 after Day 10
  //   console.log(dayIndex + 1);
  //   setCurrentDay(dayIndex + 1);
  //   setActiveDay(dayComponents[dayIndex].key);
  // }, [dayComponents.length]);
  const handleButtonClick = (dayKey) => {
    setActiveDay(dayKey);
  };

  const handleDownloadWorkDiary = async () => {
    const token = getToken();

    if (!token) {
      message.error("Student token not found. Please log in again.");
      return;
    }

    setDownloadLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL || "";
      const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
      const downloadUrl = `${normalizedBase}${API_URL.WORK_DIARY_DOWNLOAD}`;

      const response = await axios.get(downloadUrl, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = new Blob([response.data], {
        type:
          response.headers["content-type"] ||
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const downloadLink = document.createElement("a");
      const objectUrl = window.URL.createObjectURL(blob);
      const contentDisposition = response.headers["content-disposition"];
      const filenameMatch = contentDisposition?.match(/filename="?([^"]+)"?/);
      const filename = filenameMatch?.[1] || "work-diary.docx";

      downloadLink.href = objectUrl;
      downloadLink.setAttribute("download", filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.URL.revokeObjectURL(objectUrl);

      message.success("Work diary downloaded successfully.");
    } catch (error) {
      console.error("Error downloading work diary:", error);
      message.error("Failed to download work diary. Please try again.");
    } finally {
      setDownloadLoading(false);
    }
  };

  const renderActiveComponent = () => {
    const day = dayComponents.find((d) => d.key === activeDay);
    return day ? day.component : null;
  };

  return (
    <>
      {loading ? (
        <Spin className="spinStyle" />
      ) : (
        <div style={{backgroundColor: "#5DC889"}}>
          <div
            className="topContainer"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "20px",
              paddingLeft: "20px",
              paddingRight: "20px",
              marginBottom: "14px",
              gap: "12px",
            }}
          >
            <div>
              <h5 className="goalHeading">My Work Diary</h5>
            </div>
            <Button
              type="primary"
              onClick={handleDownloadWorkDiary}
              loading={downloadLoading}
              style={{
                marginLeft: "auto",
                backgroundColor: "#1476B7",
                borderColor: "#1476B7",
                borderRadius: "10px",
                fontWeight: 500,
                boxShadow: "0 4px 12px rgba(20, 118, 183, 0.25)",
              }}
            >
              Download Work Diary
            </Button>
            {/* <div className="subHead">
              <h className="subHeading">
                Writing down your goal increases your chances of success. Fill
                out this form to view any time or print and put you can see
                daily.
              </h>
            </div> */}
          </div>
          <div
            className="workDiaryInnerPanel"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              margin: "0 20px 20px 20px",
              padding: "14px 14px 20px 14px",
            }}
          >
            <nav className="wdDayPicker" aria-label="Work diary days">
              <div className="wdDayStrip">
                {dayComponents.map((day) => {
                  const isActive = activeDay === day.key;
                  return (
                    <button
                      type="button"
                      key={day.key}
                      className={`wdDayTile${isActive ? " wdDayTileActive" : ""}`}
                      style={{ "--wd-accent": day.accent }}
                      aria-pressed={isActive}
                      aria-label={day.label}
                      onClick={() => handleButtonClick(day.key)}
                    >
                      <span className="wdDayImageWrap">
                        <img
                          src={day.graphic}
                          alt=""
                          width="340"
                          height="340"
                          decoding="async"
                          draggable="false"
                        />
                      </span>
                      <span className="wdDayLabel">{day.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {renderActiveComponent()}
          </div>
        </div>
      )}
    </>
  );
};

export default WorkDiary;
