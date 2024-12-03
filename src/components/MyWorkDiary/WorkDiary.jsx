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
    { label: "Quiz", key: "QuizTime", component: <QuizTime /> },
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
                      borderColor:
                        currentDay === index + 1 ? "#1890ff" : "#ccc", // Highlight current day
                      opacity:
                        hoveredDay === day.key || activeDay === day.key
                          ? 1
                          : 0.5, // Show button at full opacity on hover or if active
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
      )}
    </>
  );
};

export default WorkDiary;
