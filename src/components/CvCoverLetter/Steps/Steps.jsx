import React from "react";
import "./Steps.css";

const Steps = ({ current, setCurrent }) => {
  const stepTitles = [
    "Personal Profile",
    "Education",
    "Work Experience",
    "Skill's",
    "Interests",
    "References",
  ];

  return (
    <>
      <div className="steps">
        {stepTitles.map((item, index) => {
          return (
            <div
              className="step-item"
              key={index + 1}
              onClick={() => {
                setCurrent(index + 1);
              }}
            >
              <div
                className={
                  current >= index + 1
                    ? "step-item-line  step-item-line-active"
                    : "step-item-line  step-item-line-nonActive"
                }
              />
              <div
                className={
                  current >= index + 1
                    ? "step-icon-style step-icon-style-active"
                    : "step-icon-style step-icon-style-nonActive"
                }
              >
                <span
                  className={
                    current >= index + 1
                      ? "step-icon-text step-icon-text-active"
                      : "step-icon-text step-icon-text-nonActive"
                  }
                >
                  {`0${index + 1}`}
                </span>
              </div>
              <div
                className={
                  current >= index + 1
                    ? "step-item-content step-item-content-active"
                    : "step-item-content step-item-content-nonActive"
                }
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Steps;

