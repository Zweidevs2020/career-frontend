// import React, { useState } from 'react'
// import './CvCoverLetter.css';
// import { Steps } from 'antd';

// const CvCoverLetter = () => {
//     const {Step} = Steps
//     const [current, setCurrent] = useState(1);
//   return (
//     <div>
//       <Steps current={current} labelPlacement='vertical' onChange={(c)=>{
//         setCurrent(c)
//       }} >
//         <Step title='finished' ></Step>
//         <Step title='finished' ></Step>
//         <Step title='finished' ></Step>
//         <Step title='finished' ></Step>
//         <Step title='finished' ></Step>
//         <Step title='finished' ></Step>
//       </Steps>
//     </div>
//   )
// }

// export default CvCoverLetter
import { Button, message, theme } from "antd";
import { useState } from "react";
import PersonalProfile from "./PersonalProfile/PersonalProfile";
import Skill from "./Skill/Skill";
import "./CvCoverLetter.css";
import Steps from "./Steps/Steps";

// const steps = [
//   {
//     title: "Personal Profile",
//     content: <PersonalProfile />,
//   },
//   {
//     title: "Education",
//     content: "Second-content",
//   },
//   {
//     title: "Experience",
//     content: "third-content",
//   },
//   {
//     title: "Skill's",
//     content: <Skill />,
//   },
//   {
//     title: "Interests",
//     content: "Fifth-content",
//   },
//   {
//     title: "Refrences",
//     content: "sixth-content",
//   },
// ];

const CvCoverLetter = () => {
  //   const { token } = theme.useToken();
  const [current, setCurrent] = useState(1);

  const next = () => {
    if (current != 6) setCurrent(current + 1);
  };

  const prev = () => {
    if (current != 1) setCurrent(current - 1);
  };

  // const items = steps.map((item) => ({
  //   key: item.title,
  //   title: item.title,
  // }));

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
          {/* steps */}
          <Steps current={current} />
          {current == 1 ? <PersonalProfile /> : ""}

          <Button
            style={{ border: "1px solid grey", color: "black" }}
            type="primary"
            onClick={() => next()}
          >
            Next
          </Button>

          <Button
            style={{ border: "1px solid grey", color: "black" }}
            type="primary"
            onClick={() => prev()}
          >
            Prev
          </Button>
          {/* <Steps
            current={current}
            items={items}
            labelPlacement="horizontal"
            style={{
              marginTop: "8px",
              width: "98%",
              marginLeft: "10px",
              backgroundColor: "#F8FAFC",
              height: "80px",
              display: "flex",
              alignItems: "center",
            }} */}
        </div>
      </div>

      {/* <div class="w-[98%] h-[100%] bg-white">
        <Steps
          current={current}
          items={items}
          labelPlacement="horizontal"
          style={{
            marginTop: "8px",
            width: "98%",
            marginLeft: "10px",
            backgroundColor: "#F8FAFC",
            height: "80px",
            display: "flex",
            alignItems: "center",
          }}
        />
        <div
          style={{
            height: "580px",
            width: "98%",
            backgroundColor: "#F8FAFC",
            marginTop: "0px",
            marginLeft: "10px",
          }}
        >
          {steps[current].content}
        </div>
        <div
          style={{
            marginTop: 24,
          }}
        >
          {current < steps.length - 1 && (
            <Button
              style={{ border: "1px solid grey", color: "black" }}
              type="primary"
              onClick={() => next()}
            >
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => message.success("Processing complete!")}
            >
              Done
            </Button>
          )}
          {current > 0 && (
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
        </div>
      </div> */}
    </>
  );
};
export default CvCoverLetter;
