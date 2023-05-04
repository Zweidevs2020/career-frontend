import React, { useEffect, useState } from "react";
import { MyCareerGuidanceButton } from "../../../components/commonComponents";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../../utils/constants";
import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { Spin, Modal } from "antd";

const Right = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [educationGuidance, setEducationGuidance] = useState([]);
  const [singlequizData, setSinglequizData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getducationGuidance();
  }, []);

  const getducationGuidance = async () => {
    setLoading(true);
    const response = await getApiWithAuth(API_URL.GETGOALS);
    console.log(
      "==================================================res",
      response
    );
    if (response.data.status === 200) {
      setEducationGuidance(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  return (
    <>
      <div class="h-[100%] w-[100%] items-center flex flex-col">
        <div class="h-[30px] w-[98%]  flex items-center md:h-[40px] md:items-end">
          <p class="text-[#474749] mt-3 sm:text-[15px] ml-2 text-[16px] font-bold">
            Self Assessment
          </p>
        </div>
        <div className="grid grid grid-cols-12 gap-2 mt-3">
          {educationGuidance.map((item) => {
            return (
              <div
                key={item.id}
                class="md:col-span-12 md:ms-3 lg:col-span-9 col-span-6 h-[140px] w-[160px] bg-blue-200 rounded-xl flex flex-col items-center justify-around"
              >
                <div class="h-[50px] w-[90%] flex flex-col items-start justify-center ">
                  <p class="text-[16px] sm:text-[14px] lg:text-[10px] text-slate-500 ml-2 font-lighter">
                    Inflluencing/
                  </p>
                  <p class="text-[16px] sm:text-[14px] lg:text-[10px] text-slate-500 ml-2 font-lighter">
                    Persuasive
                  </p>
                </div>
                <div class="h-[50px] w-[90%] flex items-center justify-around">
                  <div class="h-[40px] w-[40%]  flex items-center justify-start ">
                    <div class="h-6 w-1 bg-[#006Ed3] ml-2 "></div>
                  </div>
                  <div class="h-[40px] w-[40%] flex items-center justify-center">
                    <p class="text-lg text-[32px] font-bold text-[#006ED3]">
                      02
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* <div class='h-[510px] w-[98%]' >
       <div class='h-[140px] w-[40%] sm:h-[130px] md:h-[140px] md:w-[35%] lg:w-[40%] lg:h-[130px] sm:w-[40%] bg-blue-200  rounded-xl flex flex-col items-center justify-around'>
        <div class='h-[50px] w-[90%] flex flex-col items-start justify-center ' >
            <p class='text-[16px] sm:text-[14px] lg:text-[10px] text-slate-500 ml-2 font-lighter' >Artistic/</p>
            <p class='text-[16px] sm:text-[14px] lg:text-[10px] text-slate-500 ml-2 font-lighter' >Creative</p>
        </div>
        <div class='h-[50px] w-[90%] flex items-center justify-around' >
            <div class='h-[40px] w-[40%] flex items-center justify-start ' >
            <div class='h-6 w-1 bg-[#006Ed3] ml-2 '></div>
            </div>
            <div class='h-[40px] w-[40%] flex items-center justify-center' >
                <p class='text-lg text-[32px] font-bold text-[#006ED3]' >45</p>
            </div>
        </div>
        </div> 
       <div class='h-[140px] w-[40%] sm:h-[130px] sm:w-[40%] md:h-[140px] md:w-[35%] lg:w-[40%] lg:h-[130px] bg-blue-200   rounded-xl flex flex-col items-center justify-around '>
       <div class='h-[50px] w-[90%] flex flex-col items-start justify-center ' >
            <p class='text-[16px] sm:text-[14px] lg:text-[10px] text-slate-500 ml-2 font-lighter' >Inflluencing/</p>
            <p class='text-[16px] sm:text-[14px] lg:text-[10px] text-slate-500 ml-2 font-lighter' >Persuasive</p>
        </div>
        <div class='h-[50px] w-[90%] flex items-center justify-around' >
        <div class='h-[40px] w-[40%]  flex items-center justify-start ' >
            <div class='h-6 w-1 bg-[#006Ed3] ml-2 '></div>
            </div>
            <div class='h-[40px] w-[40%] flex items-center justify-center' >
                <p class='text-lg text-[32px] font-bold text-[#006ED3]' >02</p>
            </div>
        </div>
        </div> 
       <div class='h-[140px] w-[40%] sm:h-[130px] sm:w-[40%] md:h-[140px] md:w-[35%] lg:w-[40%] lg:h-[130px] bg-blue-200   rounded-xl  flex flex-col items-center justify-around'>
       <div class='h-[50px] w-[90%] flex flex-col items-start justify-center ' >
            <p class='text-[16px] sm:text-[14px] lg:text-[10px] text-slate-500 ml-2 font-lighter' >Socail</p>
        </div>
        <div class='h-[50px] w-[90%] flex items-center justify-around' >
        <div class='h-[40px] w-[40%]  flex items-center justify-start ' >
            <div class='h-6 w-1 bg-[#006Ed3] ml-2 '></div>
            </div>
            <div class='h-[40px] w-[40%] flex items-center justify-center' >
                <p class='text-lg text-[32px] font-bold text-[#006ED3]' >124</p>
            </div>
        </div>
        </div> 
       <div class='h-[140px] w-[40%] sm:h-[130px] sm:w-[40%] md:h-[140px] md:w-[35%] lg:w-[40%] lg:h-[130px] bg-blue-200   rounded-xl  flex flex-col items-center justify-around'>
       <div class='h-[50px] w-[90%] flex flex-col items-start justify-center ' >
            <p class='text-[16px] sm:text-[14px] lg:text-[10px] text-slate-500 ml-2 font-lighter' >Clierical/</p>
            <p class='text-[16px] sm:text-[14px] lg:text-[10px] text-slate-500 ml-2 font-lighter' >Organisational</p>
        </div>
        <div class='h-[50px] w-[90%] flex items-center justify-around' >
        <div class='h-[40px] w-[40%] flex items-center justify-start ' >
            <div class='h-6 w-1 bg-[#006Ed3] ml-2 '></div>
            </div>
            <div class='h-[40px] w-[40%] flex items-center justify-center' >
                <p class='text-lg text-[32px] font-bold text-[#006ED3]' >34</p>
            </div>
        </div>
        </div> 
       <div class='h-[140px] w-[40%] sm:h-[130px] sm:w-[40%] md:h-[140px] md:w-[35%] lg:w-[40%] lg:h-[130px] bg-blue-200   rounded-xl  flex flex-col items-center justify-around'>
       <div class='h-[50px] w-[90%] flex flex-col items-start justify-center ' >
            <p class='text-[16px] sm:text-[14px] lg:text-[10px] text-slate-500 ml-2 font-lighter' >Manual/</p>
            <p class='text-[16px] sm:text-[14px] lg:text-[10px] text-slate-500 ml-2 font-lighter' >Practical</p>
        </div>
        <div class='h-[50px] w-[90%] flex items-center justify-around' >
        <div class='h-[40px] w-[40%]  flex items-center justify-start ' >
            <div class='h-6 w-1 bg-[#006Ed3] ml-2 '></div>
            </div>
            <div class='h-[40px] w-[40%] flex items-center justify-center' >
                <p class='text-lg text-[32px] font-bold text-[#006ED3]' >231</p>
            </div>
        </div>
        </div> 
       <div class='h-[140px] w-[40%] sm:h-[130px] sm:w-[40%] md:h-[140px] md:w-[35%] lg:w-[40%] lg:h-[130px] bg-blue-200   rounded-xl  flex flex-col items-center justify-around'>
       <div class='h-[50px] w-[90%] flex flex-col items-start justify-center ' >
            <p class='text-[16px] sm:text-[14px] lg:text-[10px] text-slate-500 ml-2 font-lighter' >Understanding/</p>
            <p class='text-[16px] sm:text-[14px] lg:text-[10px] text-slate-500 ml-2 font-lighter' >Investigative</p>
        </div>
        <div class='h-[50px] w-[90%] flex items-center justify-around' >
        <div class='h-[40px] w-[40%]  flex items-center justify-start ' >
            <div class='h-6 w-1 bg-[#006Ed3] ml-2 '></div>
            </div>
            <div class='h-[40px] w-[40%] flex items-center justify-center' >
                <p class='text-lg text-[32px] font-bold text-[#006ED3]' >54</p>
            </div>
        </div>
        </div> 
    </div> */}
      </div>
    </>
  );
};

export default Right;
