import { Spin, Button, Row, Col } from "antd";
import React, { useState, useEffect } from "react";
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

const WorkDiary = () => {
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);

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
    { label: "Quiz", key: "QuizTime", component: <QuizTime /> },
  ];

  useEffect(() => {
    // Calculate the current day based on today's date
    const startDate = new Date(); // Start from today
    const today = new Date();
    const diffInDays =
      Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) % 11; // Loop back to Day 1 after Quiz
    const dayIndex = diffInDays === 0 ? 0 : diffInDays;
    setCurrentDay(dayIndex + 1);
    setActiveDay(dayComponents[dayIndex].key);
  }, []);

  const handleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      // Move back to the current day when disabling Edit Mode
      const todayIndex = currentDay - 1;
      setActiveDay(dayComponents[todayIndex].key);
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
        <div className="bg-white">
          <div className="topContainer">
            <div>
              <h5 className="goalHeading">My Work Diary</h5>
            </div>
            <div className="subHead">
              <h className="subHeading">
                Writing down your goal increases your chances of success. Fill
                out this form to view any time or print and put you can see
                daily.
              </h>
            </div>
          </div>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
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
                        activeDay === day.key ? "#1890ff" : "transparent",
                      color: activeDay === day.key ? "#fff" : "#000",
                      borderColor: isEditMode
                        ? "#1890ff" // Blue border in Edit Mode
                        : currentDay === index + 1
                        ? "#1890ff" // Blue border for the current day
                        : "#ccc", // Gray border for non-current days
                      opacity:
                        !isEditMode && currentDay !== index + 1 ? 0.5 : 1, // Grayed-out disabled buttons
                      cursor:
                        !isEditMode && currentDay !== index + 1
                          ? "not-allowed"
                          : "pointer",
                      width: "120px",
                    }}
                    onClick={() => {
                      if (isEditMode || currentDay === index + 1) {
                        setActiveDay(day.key);
                      }
                    }}
                    disabled={!isEditMode && currentDay !== index + 1}
                  >
                    {day.label}
                  </Button>
                </Col>
              ))}
            </Row>
          </div>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Button
              type="dashed"
              onClick={handleEditMode}
              style={{
                color: isEditMode ? "red" : "blue",
                borderColor: isEditMode ? "red" : "blue",
              }}
            >
              {isEditMode ? "Disable Edit Mode" : "Enable Edit Mode"}
            </Button>
          </div>
          <hr />
          <div className="lowerContainer2">
            <div className="bg-white">{renderActiveComponent()}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkDiary;
