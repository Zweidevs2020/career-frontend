import React from "react";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import { MyCareerGuidanceInputField } from "../commonComponents";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "./MyGoalStyle.css";


const DownloadPage = ({goal,description, proffession, countdown2, actions, countdown3, realistic, setRealistic}) => {

  const styles = {
    goalHeading:{
      'font-family': 'Poppins',
      'font-size': '24px',
      'font-weight': '600',
      'line-height': '36px',
      'letter-spacing': '0em',
      'text-align': 'left',
      'color':'#474749',
      },
      subHeading:{
      'font-family': 'Poppins',
      'font-size': '12px',
      'font-weight': '400',
      'line-height': '18px',
      'letter-spacing': '0em',
      'text-align': 'left',
      'color': '#737373',
      },
      // subHead:{
      // 'padding-bottom':'30px',
      // },
      mainPage:{
      'height': '100%',
      'width': '100%',
      'background-color': 'white',
      },
      topContainer:{
      'padding-top': '30px',
      'padding-left':'40px ',
      },
      lowerContainer:{
      'background-color':'#F8FAFC',
      'width': '94%',
      'height': '100vh',
      },
      lowerContainer2:{
      'display': 'flex',
      'justify-content': 'space-around ',
      },
      employersContact:{
      'padding-left': '20px',
      'font-family': 'Poppins',
      'font-size': '16px',
      'font-weight': '600',
      'line-height': '24px',
      'letter-spacing': '0em',
      'text-align': 'left',
      'color': '#474749',
      },
      employeGoal:{
      'padding-top': '20px',
      },
      secondContainer:{
      'padding-left': '20px',
      'font-family': 'Poppins',
      'font-size': '12px',
      'font-weight': '400',
      'line-height': '18px',
      'letter-spacing': '0em',
      'text-align': 'left',
      'color': '#737373',
      },
      inputContainer:{
      'padding-left': '20px',
      'font-family': 'Inter',
      'font-size': '14px',
      'font-weight': '600',
      'line-height': '21px',
      'letter-spacing': '0em',
      'text-align': 'left',
      'color':'#111928',
      'padding-top': '25px',
      },
      inputGoal:{
      'padding-left': '20px',
      'padding-top': '5px',
      },
      inputCarrer:{
      'width':'97%',
      'height': '40px',
      'font-size': '14px',
      'font-weight': '700'
      },
      dateLibr:{
      'width': '450px',
      },
      h:{
      'padding-left': '20px',
      },
      container :{
      'display': 'block',
      'position': 'relative',
      'padding-left': '35px',
      'margin-bottom': '12px',
      'cursor': 'pointer',
      'font-size': '22px',
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      '-ms-user-select': 'none',
      'user-select': 'none',
      },
      calenderGoal:{
      'padding-top': '15px',
      'padding-left': '20px',
      },
      timer:{
      'padding-top': '20px',
      'padding-left': '20px',
      },
      buttonGoal:{
      'border-radius': '20%',
      'width':'230px',
      'height': '52px',
      'padding-top': '15px',
      'padding-left': '20px',
      },
      buttonGoalPage:{
      'border-radius': '5%',
      'height':'100%',
      'width':'100%',
      'background-color': ' #1476B7',
      'color': 'white',
      },
      page: {
        width: '7in',
        height: '9in',
        margin: '0',
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column'
    },   
  }


  dayjs.extend(customParseFormat);
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  return (
    <>
    <div style={styles.page}>
      <div style={styles.mainPage}>
        <div style={styles.topContainer}>
          <div>
            <h5 style={styles.goalHeading}>My Goal</h5>
          </div>
          <div style={styles.subHead}>
            <h style={styles.subHeading}>
              Lorem ipsum is a placeholder text commonly used to demonstrate
            </h>
          </div>
        </div>
        <div style={styles.inputContainer}>
          <h style={{ color: "#111928" }}>Description:</h>
        </div>
        <div style={styles.inputGoal}>
          <textarea
            style={styles.inputCarrer}
            value={description}
            placeholder="Enter description"
            className="sm:text-[8px] md:text-[8px] xl:text-[11px] px-2 h-[50px] sm:w-[30%] sm:h-[35px] md:h-[38px] w-[97%] rounded-md border-solid border-2 border-gray-400 outline-none "
            readOnly
          />
        </div>
        <div style={styles.lowerContainer2}>
          <div style={styles.lowerContainer}>
            <div style={styles.employeGoal}>
              <h style={styles.employersContact}>
                What’s the best way for employers to contact you?
              </h>
            </div>
            <div style={styles.secondContainer}>
              <h>What’s the best way for employers to contact you?</h>
            </div>
            <div style={styles.inputContainer}>
              <h style={{color: "#111928" }}>What I want to Become:</h>
            </div>
            <div style={styles.inputGoal}>
              <input
                style={styles.inputCarrer}
                type="text"
                name="input"
                value={proffession}
                placeholder="eg Accountant"
                class=" sm:text-[8px] md:text-[8px] xl:text-[11px] px-2 h-[50px] sm:w-[30%] sm:h-[35px] md:h-[38px] w-[97%] rounded-md border-solid border-2 border-gray-400 outline-none "
              />
            </div>
         
            <div style={styles.inputContainer}>
              <h style={{color: "#111928" }}>Specific Goal for the Year:</h>
            </div>
            <div style={styles.inputGoal}>
              <input
                style={styles.inputCarrer}
                type="text"
                value={goal}
                name="input"
                placeholder="eg Accountant"
                class="  sm:text-[8px] md:text-[8px] xl:text-[11px] px-2 h-[50px] sm:w-[30%] sm:h-[35px] md:h-[38px] w-[97%] rounded-md border-solid border-2 border-gray-400 outline-none "
              />
            </div>
            <div style={styles.inputContainer}>
              <h style={{color: "#111928" }}>
                5 Actions to Achieve the Above:
              </h>
            </div>
            <div
              style={styles.h}
              class="w-[100%] h-[70px] w-[97%]  sm:h-[100px] sm:flex-wrap sm:flex flex items-center justify-around pl-4 "
            >
              <input
                type="text"
                name="input"
                placeholder="Write down your goal"
                class=" sm:text-[6px] text-[14px] md:text-[6px] xl:text-[11px] px-2 h-[40px] sm:w-[30%] sm:h-[35px] md:h-[38px] w-[19%] rounded-md border-solid border-2 border-gray-400 outline-none "
              />
              <input
                type="text"
                name="input"
                placeholder="Set a deadline"
                class=" px-2 sm:text-[6px] text-[14px] md:text-[6px] h-[40px] xl:text-[11px] w-[19%] sm:w-[30%] sm:h-[35px] md:h-[38px] rounded-md border-solid border-2 border-gray-400 outline-none "
              />
              <input
                type="text"
                name="input"
                placeholder="Work on your mindset"
                class=" sm:text-[6px] text-[14px] md:text-[6px] px-2 xl:text-[11px] h-[40px] sm:h-[35px] w-[19%] md:h-[38px] sm:w-[30%] rounded-md border-solid border-2 border-gray-400 outline-none "
              />
              <input
                type="text"
                name="input"
                placeholder="Develop your skillset"
                class=" sm:text-[6px] text-[14px] md:text-[6px] px-2 xl:text-[11px] h-[40px] sm:h-[35px] w-[19%] md:h-[38px] sm:w-[30%] rounded-md border-solid border-2 border-gray-400 outline-none "
              />
              <input
                type="text"
                name="input"
                placeholder="Reward yourself"
                class=" px-2 sm:text-[6px] text-[14px] md:text-[6px] h-[40px] xl:text-[11px] w-[19%] sm:h-[35px] sm:w-[30%] md:h-[38px]  rounded-md border-solid border-2 border-gray-400 outline-none "
              />
              <input
                type="text"
                name="input"
                placeholder="Reward yourself"
                class=" md:hidden lg:hidden xl:hidden xxl:hidden px-2 sm:text-[6px] text-[14px] h-[40px] w-[19%] sm:h-[35px] sm:w-[30%]  rounded-md border-solid border-2 border-gray-400 outline-none "
              />
            </div>
            <div style={styles.inputContainer}>
              <h style={{color: "#111928" }}>Is this Realistic ?</h>
            </div>
            <div class="h-[50px] w-[20%]  sm:w-[50%] md:w-[40%] lg:w-[40%] flex items-center pl-2">

              <div style={styles.calenderGoal}>
                <Space direction="vertical" size={12}>
                  <input
                    // style={styles.dateLibr}
                    value={realistic === true ? 'Yes' : 'No'}
                    // format={dateFormatList}
                    style={styles.inputCarrer}
                  />
                </Space>
              </div>
            </div>
            <div style={styles.inputContainer}>
              <h style={{color: "#111928" }}>How Long Do I have ?</h>
            </div>
            <div style={styles.calenderGoal}>
              <Space direction="vertical" size={12}>
                <input
                  // style={styles.dateLibr}
                  value={dayjs(countdown3).format("YYYY-M-D")}
                  // format={dateFormatList}
                  style={styles.inputCarrer}
                />
              </Space>
            </div>
            <div style={styles.timer}>
              <div class="contact h-[110px] w-[97%] flex items-center justify-center gap-5 bg-white rounded-md border-solid border-2 border-gray-400">
                <div class="h-[80px] w-[10%]  flex flex-col items-center justify-center">
                  <p class="text-[#DB614D] text-[20px] font-bold sm:text-[14x] md:text-[14px] lg:text-[14px]">
                    {countdown2.days} :
                  </p>
                  <p class="text-[#DB614D] text-[20px] font-bold sm:text-[14x] md:text-[14px] lg:text-[14px]">
                    Days
                  </p>
                </div>
                <div class="h-[80px] w-[10%]  flex flex-col items-center justify-center">
                  <p class="text-[#474749] text-[20px] font-bold sm:text-[14px] md:text-[14px] lg:text-[14px]">
                    {countdown2.hours} :
                  </p>
                  <p class="text-[#474749] text-[20px] font-bold  sm:text-[14px] md:text-[14px] lg:text-[14px]">
                    Hours
                  </p>
                </div>
                <div class="h-[80px] w-[10%]  flex flex-col items-center justify-center">
                  <p class="text-[#474749] text-[20px] font-bold sm:text-[14px] md:text-[14px] lg:text-[14px]">
                    {countdown2.minutes} :
                  </p>
                  <p class="text-[#474749] text-[20px] font-bold sm:text-[14px] md:text-[14px] lg:text-[14px]">
                    Mins
                  </p>
                </div>
                <div class="h-[80px] w-[10%]  flex flex-col items-center justify-center">
                  <p class="text-[#474749] text-[20px] font-bold sm:text-[14px] md:text-[14px] lg:text-[14px]">
                    {countdown2.seconds} :
                  </p>
                  <p class="text-[#474749] text-[20px] font-bold sm:text-[14px] md:text-[14px] lg:text-[14px]">
                    Secs
                  </p>
                </div>
              </div>
            </div>
            <br />
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default DownloadPage;