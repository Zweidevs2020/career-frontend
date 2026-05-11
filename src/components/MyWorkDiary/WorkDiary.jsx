import { Spin, Button, Row, Col, message } from "antd";
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
import "./WorkDiary.css";

const WorkDiary = () => {
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [activeDay, setActiveDay] = useState("");
  const [currentDay, setCurrentDay] = useState(1);
  const [hoveredDay, setHoveredDay] = useState(null); // Track which day is being hovered

  const dayComponents = [
    { label: "Day 1", key: "DayOne", component: <DayOne /> },
    { label: "Day 2", key: "DayTwo", component: <DayTwo /> },
    { label: "Day 3", key: "DayThree", component: <DayThree /> },
    { label: "Day 4", key: "DayFour", component: <DayFour /> },
    { label: "Day 5", key: "DayFive", component: <DayFive /> },
    { label: "Day 6", key: "DaySix", component: <DaySix /> },
    { label: "Day 7", key: "DaySeven", component: <DaySeven /> },
    { label: "Day 8", key: "DayEight", component: <DayEight /> },
    { label: "Day 9", key: "DayNine", component: <DayNine /> },
    { label: "Day 10", key: "DayTen", component: <DayTen /> },
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
        <div style={{backgroundColor: "#CEF5E0"}}>
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
            <div style={{ textAlign: "center", margin: "6px 0 20px 0" }}>
              <Row gutter={[16, 16]}>
                {dayComponents.map((day, index) => (
                  <Col
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                    key={day.key}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      key={day.key}
                      type={activeDay === day.key ? "primary" : "default"}
                      style={{
                        backgroundColor:
                          activeDay === day.key ? "#1890ff" : "white",
                        color: activeDay === day.key ? "#fff" : "#000",
                        borderColor: "#000000",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        opacity: 1, // Show button at full opacity on hover or if active
                        cursor:
                          hoveredDay === day.key || activeDay === day.key
                            ? "pointer"
                            : "not-allowed", // Change cursor style when hovered or active
                        width: "120px",
                      }}
                      onClick={() => handleButtonClick(day.key)}
                      onMouseEnter={() => setHoveredDay(day.key)} // Set hovered day on mouse enter
                      onMouseLeave={() => setHoveredDay(null)} // Reset hovered day on mouse leave
                      disabled={hoveredDay === day.key && activeDay === day.key} // Disable if not hovered or active
                    >
                      {hoveredDay === day.key ? "Edit" : day.label}
                    </Button>
                  </Col>
                ))}
              </Row>
            </div>

            {renderActiveComponent()}
          </div>
        </div>
      )}
    </>
  );
};

export default WorkDiary;
