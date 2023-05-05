import { Button } from "antd";
import { useEffect, useState } from "react";
import PersonalProfile from "./PersonalProfile/PersonalProfile";
import Skill from "./Skill/Skill";
import "./CvCoverLetter.css";
import Steps from "./Steps/Steps";
import Interest from "./Interests/Interest";
import Reference from "./Reference/Reference";

const CvCoverLetter = () => {
  const [current, setCurrent] = useState(1);

  return (
    <>
      <div class="h-[100%] w-[100%] bg-white mt-3">
        <div
          class="h-[100px] ml-9"
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <h1 class="font-bold text-[24px] text-[#474749] ">CV/Cover Letter</h1>
          <p class="text-[#737373] text-[12px] mt-1">
            Lorem ipsum is a placeholder text commonly used to demonstrate.
          </p>
        </div>
        <div className="cv-Data">
          <div className="ml-2">
            <Steps current={current} />
          </div>
          {current == 1 ? (
            <PersonalProfile setCurrent={setCurrent} current={current} />
          ) : current == 2 ? (
            <Skill setCurrent={setCurrent} current={current} />
          ) : current == 3 ? (
            <Interest setCurrent={setCurrent} current={current} />
          ) : current == 4 ? (
            <Reference setCurrent={setCurrent} current={current} />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
export default CvCoverLetter;
