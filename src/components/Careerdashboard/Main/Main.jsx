import React, { useEffect, useState } from "react";
import searchicon from "../../../assets/searchicon.svg";
import imgcard from "../../../assets/imgcard.svg";
import imgcard2 from "../../../assets/imgcard3.svg";
import imgcard3 from "../../../assets/imgcard4.svg";
import imgcard4 from "../../../assets/self-assesment-test.svg";
import imgcard5 from "../../../assets/imgcard2.svg";
import imgcard6 from "../../../assets/myChoiceCard.svg";
import imgcard7 from "../../../assets/educational-guidance-test.svg";
import winningCup from "../../../assets/winningCup.svg";
import { MyCareerGuidanceButton } from "../../../components/commonComponents";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../../utils/constants";
import { getApiWithAuth } from "../../../utils/api";
import { Spin, Modal } from "antd";
import bookImage from "../../../assets/bookImage.png";
import "../Main/Main.css";

const Main = () => {
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
    if (response?.data?.status === 200) {
      setEducationGuidance(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const showModal = (scoreView) => {
    setSinglequizData(scoreView);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="h-[40px] w-[100%] flex items-center justify-between careerGuidenceSearchPDiv">
        <div className="h-[40px] w-[53%] flex items-center ml-3  sm:flex sm:items-center sm:justify-start md:flex md:items-center md:justify-start md:h-[40px] md:w-[60%] lg:flex lg:items-center lg:justify-start  lg:h-[40px] lg:w-[60%] custom-heading sm:w-[100%] sm:ml-0">
          <h1 className="text-[18px] sm:text-[15px]  text-[#474749] font-bold ml-1 sm:text-center w-[100%]">
            Career Guidance
          </h1>
        </div>
     
      </div>
      <div className="grid grid-cols-12 gap-4 px-3 careerGuidenceGrid">
        <div
          // className="col-span-6 rounded-xl"
          className="col-span-6 rounded-xl xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 sm:m-auto m-auto"
          onClick={() => {
            navigate("/cao-calculator");
          }}
        >
          <img
            src={imgcard}
            className=" bg-cover"
            style={{ cursor: "pointer" }}
          />
        </div>
        <div
          // className="col-span-6rounded-xl"
          className="col-span-6 rounded-xl xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 sm:m-auto m-auto"
          onClick={() => {
            navigate("/my-goals");
          }}
        >
          <img
            src={imgcard2}
            className=" bg-cover"
            style={{ cursor: "pointer" }}
          />
        </div>
        <div
          // className="col-span-sm-12 col-span-6  rounded-xl"
          className="col-span-6 rounded-xl xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 sm:m-auto m-auto"
          onClick={() => {
            navigate("/cover-letter");
          }}
        >
          <img
            src={imgcard3}
            className=" bg-cover"
            style={{ cursor: "pointer" }}
          />
        </div>
        <div
          // className="col-span-6rounded-xl"
          className="col-span-6 rounded-xl xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 sm:m-auto m-auto"
          onClick={() => {
            navigate("/self-assesment");
          }}
        >
          <img
            src={imgcard4}
            className=" bg-cover"
            style={{ cursor: "pointer" }}
          />
        </div>
        <div
          // className="col-span-sm-12 col-span-6  rounded-xl"
          className="col-span-6 rounded-xl xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 sm:m-auto m-auto"
          onClick={() => {
            navigate("/my-study");
          }}
        >
          <img
            src={imgcard5}
            className=" bg-cover"
            style={{ cursor: "pointer" }}
          />
        </div>
        <div
      
          className="col-span-6 rounded-xl xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 sm:m-auto m-auto"
          onClick={() => {
            navigate("/my-choices");
          }}
        >
          <img
            src={imgcard6}
            className=" bg-cover"
            style={{ cursor: "pointer" }}
          />
        </div>
        <div
        
          className="col-span-6 rounded-xl xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 sm:m-auto m-auto"
          onClick={() => {
            navigate("/educational-guidance");
          }}
        >
          <img
            src={imgcard7}
            className=" bg-cover"
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
     
      <Modal
        className="modalStyleClass"
        bodyStyle={{
          background: "none",
          display: "flex",
          justifyContent: "center",
        }}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[]}
      >
        <div className="modalInnerStyle">
          <div style={{ alignSelf: "center", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img src={winningCup} alt="winning Cup" />
            </div>
            <div className="mt-4 totalScoreHadding">Total scrores</div>
            <div className="mt-2">
              Lorem ipsum is a placeholder text commonly used to demonstrate the
              visual form of a document.
            </div>
            <div className="mt-3">
              <MyCareerGuidanceButton
                label={`${singlequizData.score ? singlequizData.score : 0}/${
                  singlequizData.total_score ? singlequizData.total_score : 0
                }`}
                className="resultDataButton"
                type="button"
                htmlType="button"
                onClick={handleCancel}
                //   loading={loading}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Main;
