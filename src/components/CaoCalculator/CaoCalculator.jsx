import add from "../../assets/add.svg";
import dropdownicon from "../../assets/dropdownIcon.svg";
import gage from "../../assets/gage.svg";
import React, { useState } from "react";
import sideAuthImage from "../../assets/sideAuthImage.png";
import myCareerGuidanceIcon from "../../assets/myCareerGuidanceIcon.png";
import usernameIcon from "../../assets/usernameIcon.svg";
import lockIcon from "../../assets/lockIcon.svg";
import { Link } from "react-router-dom";
import { API_URL } from "../../utils/constants";
import { postApiWithoutAuth } from "../../utils/api";
import { setToken } from "../../utils/LocalStorage";
import { Checkbox, Form, Image } from "antd";
import {
  MyCareerGuidanceInputField,
  MyCareerGuidanceButton,
} from "../../components/commonComponents";
const CaoCalculator = () => {
  return (
    // <div
    //   style={{
    //     height: "100vh",
    //     width: "100%",
    //     background: "white",
    //     padding: 30,
    //   }}
    // >
    //   <div style={{ background: "white" }}>
    //     <div className="welcomeHaddingText">
    //       Let’s Calculate Your Grade Points Average{" "}
    //     </div>
    //     <div
    //       className="textStyle18"
    //       style={{ marginTop: 10, paddingBottom: 10 }}
    //     >
    //       Enter your email and password
    //     </div>
    //     <div
    //       style={{
    //         background: "#F8FAFC",
    //         height: "100%",
    //         padding: 20,
    //         height: "80vh",
    //       }}
    //     >
    //       <div className="welcomeHaddingText">My CAO Points: </div>
    //       <div className="textStyle18">
    //         Lorem ipsum is a placeholder text commonly used to demonstrate
    //       </div>
    //       <div
    //         style={{
    //           width: "100%",
    //           height: "50vh",
    //           backgroundColor: "white",
    //           display: "flex",
    //           justifyContent: "space-between",
    //           padding: 10,
    //         }}
    //       >
    //         <div style={{ width: "62%" }}>
    //           <div
    //             style={{
    //               display: "flex",
    //               justifyContent: "space-between",
    //               alignItems: "center",
    //             }}
    //           >
    //             <div className="textStyle18">Subjects</div>
    //             <div>
    //               <img src={add} alt="" />
    //             </div>
    //           </div>
    //           <div style={{display:"flex",justifyContent:'space-around'}}>
    //             <div>#</div>
    //             <div>Subject</div>
    //             <div>Level</div>
    //             <div>Expected Grades</div>
    //           </div>
    //         </div>

    //         <div style={{ width: "35%" }}>
    //           <div className="textStyle18">Expected Points for Semester 01</div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className='calculator' class='grid grid-cols-10 grid-rows-[90px,500px] gap-[2px] sm:grid sm:grid-cols-10 sm:grid-row-[90px,500px] sm:gap-[2px] ' >
        <div class=' bg-[#f4f6f8]   w-[100%] h-[700px] sm:w-[100%] col-span-10 flex flex-col items-center justify-around'>
            <div class='h-[70px]  w-[98%]  sm:w-[98%] sm:hidden  flex flex-col justify-around' >
            <p class='font-bold text-[24px] text-[#474749] sm:text-[16px] md:text-[18px] lg:text-[18px] ' >My CAO Points:</p>
             <p class='font-light text-[#737373] text-[16px] sm:text-[10px] md:text-[14px] lg:text-[14px] ' >Lorem ipsum is a placeholder text commonly used to demonstrate</p>
            </div>
            <div class='bg-[#f4f6f8] h-[600px] w-[98%]  sm:h-[100%] sm:flex sm:flex-col sm:w-[98%] rounded-md flex gap-[3px]'  >
                <div className='subject' class='bg-white md:w-[65%] rounded-tl-md ml-1 h-[530px] sm:h-[430px] mt-3 w-[70%] sm:w-[98%] flex items-center flex-col' >
                    <div class='h-[50px] w-[98%] px-5 bg-white flex justify-between items-center ' >
                        <p class='text-[22px] font-bold sm:text-[14px] md:text-[15px] lg:text-[16px]' > Subjects</p>
                        <div class='h-[30px] w-[30px] flex items-center justify-center bg-[#F8FAFC] rounded-full' >
                        <img src={add} alt="" />
                        </div>
                    </div>
                    <hr class='w-[100%] h-[2px] relative mt-[2px] bg-slate-100'  ></hr>
                    <div class='relative mt-1 bg-white h-[467px] sm:h-[360px] w-[98%] flex flex-col items-center gap-2 ' >
                        <div class='h-[50px] w-[95%] mt-2 bg-[#F4F6F8] flex items-center justify-around' >
                            <div class='h-[40px] w-[23%]  flex items-center justify-center' >
                                <p class='text-[22px] sm:text-[16px] md:text-[12px]  lg:text-[12px] text-[#737373] font-bold' >#</p>
                            </div>
                            <div class='h-[40px] w-[23%]  flex items-center justify-center' >
                                <p class='text-[16px] sm:text-[12px] md:text-[12px] lg:text-[12px] text-[#737373]  font-bold' >Subject</p>
                            </div>
                            <div class='h-[40px] w-[23%] flex items-center justify-center' >
                                <p class='text-[16px] md:text-[12px] sm:text-[12px] lg:text-[12px] text-[#737373]  font-bold' >Level</p>
                            </div>
                            <div class='h-[40px] w-[23%] text-[#737373]  flex items-center justify-center' >
                                <p class='text-[16px] md:text-[12px] sm:text-[12px] lg:text-[12px] font-bold' >Ecpected Grades</p>
                            </div>
                        </div>
                        <div class='h-[50px] w-[95%] bg-[#F4F6F8] flex items-center justify-around' >
                            <div class='h-[40px] w-[23%] rounded-md bg-white flex items-center justify-center' >
                                <p class='text-[14px] text-[#858585] sm:text-[10px] md:text-[9px] lg:text-[10px]  font-light' >01</p>
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585] sm:text-[8px] md:text-[9px] lg:text-[10px] ' >Pick Subjects</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px] sm:h-[4px] md:h-[4px] lg:h-[4px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585] sm:text-[8px] md:text-[9px] lg:text-[10px] ' >Higher</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px] sm:h-[4px] md:h-[4px] lg:h-[4px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585] sm:text-[8px] md:text-[9px] lg:text-[10px] ' >A1</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px] sm:h-[4px] md:h-[4px] lg:h-[4px]' />
                            </div>
                        </div>
                        <div class='h-[50px] w-[95%] bg-[#F4F6F8] flex items-center justify-around' >
                            <div class='h-[40px] w-[23%] rounded-md bg-white flex items-center justify-center' >
                                <p class='text-[14px] text-[#858585] sm:text-[10px] md:text-[9px] lg:text-[10px]  font-light' >01</p>
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585] sm:text-[8px] md:text-[9px] lg:text-[10px] ' >Pick Subjects</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px] sm:h-[4px] md:h-[4px] lg:h-[4px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585] sm:text-[8px] md:text-[9px] lg:text-[10px] ' >Higher</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px] sm:h-[4px] md:h-[4px] lg:h-[4px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585] sm:text-[8px] md:text-[9px] lg:text-[10px] ' >A1</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px] sm:h-[4px] md:h-[4px] lg:h-[4px]' />
                            </div>
                        </div>
                        <div class='h-[50px] w-[95%] bg-[#F4F6F8] flex items-center justify-around' >
                            <div class='h-[40px] w-[23%] rounded-md bg-white flex items-center justify-center' >
                                <p class='text-[14px] text-[#858585] sm:text-[10px] md:text-[9px] lg:text-[10px]  font-light' >01</p>
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585] sm:text-[8px] md:text-[9px] lg:text-[10px]  ' >Pick Subjects</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px] sm:h-[4px] md:h-[4px] lg:h-[4px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585] sm:text-[8px] md:text-[9px] lg:text-[10px] ' >Higher</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px] sm:h-[4px] md:h-[4px] lg:h-[4px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585] sm:text-[8px] md:text-[9px] lg:text-[10px] ' >A1</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px] sm:h-[4px] md:h-[4px] lg:h-[4px]' />
                            </div>
                        </div>
                        <div class='h-[50px] w-[95%] bg-[#F4F6F8] flex items-center justify-around' >
                            <div class='h-[40px] w-[23%] rounded-md bg-white flex items-center justify-center' >
                                <p class='text-[14px] text-[#858585] sm:text-[10px] md:text-[9px] lg:text-[10px]  font-light' >01</p>
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585] sm:text-[8px] md:text-[9px] lg:text-[10px] ' >Pick Subjects</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px] sm:h-[4px] md:h-[4px] lg:h-[4px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585] sm:text-[8px] md:text-[9px] lg:text-[10px] ' >Higher</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px] sm:h-[4px] md:h-[4px] lg:h-[4px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585] sm:text-[8px] md:text-[9px] lg:text-[10px] ' >A1</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px] sm:h-[4px] md:h-[4px] lg:h-[4px]' />
                            </div>
                        </div>

                        <div class='h-[50px] w-[95%] bg-[#F4F6F8] flex items-center justify-around' >
                            <div class='h-[40px] w-[23%] rounded-md bg-white flex items-center justify-center' >
                                <p class='text-[14px] text-[#858585] sm:text-[10px] md:text-[9px] lg:text-[10px]  font-light' >01</p>
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585] sm:text-[8px] md:text-[9px] lg:text-[10px] ' >Pick Subjects</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px] sm:h-[4px] md:h-[4px] lg:h-[4px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585] sm:text-[8px] md:text-[9px] lg:text-[10px] ' >Higher</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px] sm:h-[4px] md:h-[4px] lg:h-[4px]' />
                            </div>
                            <div class='h-[40px] w-[23%] rounded-md px-2 bg-white flex items-center justify-between' >
                                <p class='text-[#858585] sm:text-[8px] md:text-[9px]  lg:text-[10px]   ' >A1</p>
                                <img src={dropdownicon} alt="" class='text-[#858585] h-[6px] sm:h-[4px] md:h-[4px] lg:h-[4px]' />
                            </div>
                        </div>

                    </div>
                </div>
                <div className='points'  class='bg-white md:w-[33%]  sm:w-[98%] sm:h-[100%] sm:ml-1 rounded-tr-md h-[530px] mt-3 w-[29%] flex flex-col items-center  ' >
                <div class='h-[50px] w-[98%] sm:h-[50px] sm:mb-2 px-5 ml-[2px] bg-white flex justify-between items-center ' >
                        <p class='text-[14px] font-bold  md:text-[12px] lg:text-[12px] ' >Expected Points for Semester 01</p>
                </div>
                <hr class='w-[100%] h-[2px] relative mt-[2px] bg-slate-100'  ></hr>
                <div class='h-[50px] w-[90%]  relative mt-3 flex items-center justify-start ' >
                    <p class='font-light text-[16px] text-[#474749]  md:text-[14px] lg:text-[14px] ' >CAO Points</p>
                </div>
                <div class='h-[30px] w-[90%]  relative mt-2 flex items-center justify-between px-4 ' >
                    <p class='font-bold text-[14px] text-[#474749]  md:text-[10px] lg:text-[10px] ' >Points</p>
                    <p class='font-light text-[14px] text-[#474749] md:text-[10px] lg:text-[10px] ' >150</p>
                </div>
                <hr class='w-[100%] h-[1px] relative mt-[4px] bg-slate-100'  ></hr>

                <div class='h-[30px] w-[90%]  relative mt-2 flex items-center justify-between px-4 ' >
                    <p class='font-bold text-[14px] text-[#474749]  md:text-[10px] lg:text-[10px]  ' >Bonus Points</p>
                    <p class='font-light text-[14px] text-[#474749]  md:text-[10px] lg:text-[10px] ' >150</p>
                </div>
                <hr class='w-[100%] h-[1px] relative mt-[4px] bg-slate-100'  ></hr>

                <div class='h-[30px] w-[90%] relative mt-2 flex items-center justify-between px-4 ' >
                    <p class='font-bold text-[14px] text-[#474749]  md:text-[10px] lg:text-[10px]  ' >Final Points</p>
                    <p class='font-light text-[14px] text-[#474749] md:text-[10px] lg:text-[10px]  ' >295</p>
                </div>
                <hr class='w-[100%] h-[1px] relative mt-[4px] bg-slate-100'  ></hr>

                <div class='h-[267px]  w-[98%] relative mt-3 flex items-center justify-center' >
                    <img src={gage} alt=""  class='md:h-[120px] lg:h-[140px]'  />
                </div>

                </div>

                <div class='absolute mt-[544px] md:w-[95%] lg:w-[65%] ml-2 h-[50px] w-[78%] flex items-center justify-end px-2 sm:hidden' >
                    <div class='  h-[45px] md:w-[50%] lg:w-[50%]  w-[30%] flex items-center justify-evenly ' >
                        <button class='h-[40px] w-[35%] rounded-md bg-white text-[#A8A8A8] '>Clear All</button>
                        <button class='h-[40px] w-[35%] rounded-md bg-white text-[#1476B7] border-2 border-[#1476B7] ' >Calculate</button>
                    </div>
                </div>

            </div>
        </div>

    </div>
  );
};

export default CaoCalculator;
