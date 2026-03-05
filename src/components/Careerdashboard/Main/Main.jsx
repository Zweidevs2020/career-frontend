import React, { memo, useCallback, useState } from "react";
// import imgcard from "../../../assets/1.png";
// import imgcard2 from "../../../assets/2.png";
// import imgcard3 from "../../../assets/3.png";
// import imgcard4 from "../../../assets/4.png";
// import imgcard5 from "../../../assets/5.png";
// import imgcard6 from "../../../assets/6.png";
// import imgcard7 from "../../../assets/7.png";
import imgcard from "../../../assets/66.png";
import imgcard2 from "../../../assets/13.png";
import imgcard3 from "../../../assets/16.png";
import imgcard4 from "../../../assets/67.png";
import imgcard5 from "../../../assets/14.png";
import imgcard6 from "../../../assets/15.png";
import imgcard7 from "../../../assets/12.png";
import imgcard8 from "../../../assets/17.png";
import imgcard9 from "../../../assets/18.png";
import winningCup from "../../../assets/winningCup.svg";
import { MyCareerGuidanceButton } from "../../../components/commonComponents";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import "../Main/Main.css";

const cards = [
  { src: imgcard, navigateTo: "/cao-calculator", alt: "My CAO Points" },
  { src: imgcard4, navigateTo: "/my-goals", alt: "My Goals" },
  { src: imgcard2, navigateTo: "/cover-letter", alt: "My Career Choices" },
  { src: imgcard5, navigateTo: "/self-assesment", alt: "My Self Assessment" },
  { src: imgcard3, navigateTo: "/my-study", alt: "My CV" },
  { src: imgcard7, navigateTo: "/my-choices", alt: "My Choices" },
  { src: imgcard6, navigateTo: "/educational-guidance", alt: "My Study Timetable" },
  { src: imgcard8, navigateTo: "/my-guidance-report", alt: "My Guidance Report" },
  { src: imgcard9, navigateTo: "/work-diary", alt: "My Work Experience" },
];

const GuidanceCard = memo(({ src, alt, isPriority, onClick }) => (
  <button type="button" className="careerGuidenceCard" onClick={onClick}>
    <img
      src={src}
      alt={alt}
      loading={isPriority ? "eager" : "lazy"}
      fetchPriority={isPriority ? "high" : "auto"}
      decoding="async"
      width="900"
      height="900"
    />
  </button>
));

const Main = () => {
  const navigate = useNavigate();
  const [singlequizData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <div className="h-[40px] w-[100%] flex items-center justify-between careerGuidenceSearchPDiv">
        <div className="h-[40px] w-[53%] flex items-center ml-3  sm:flex sm:items-center sm:justify-start md:flex md:items-center md:justify-start md:h-[40px] md:w-[60%] lg:flex lg:items-center lg:justify-start  lg:h-[40px] lg:w-[60%] custom-heading sm:w-[100%] sm:ml-0">
          <h1 className="text-[18px] sm:text-[15px]  text-[#474749] font-bold ml-1 sm:text-center w-[100%]">
            Career Guidance
          </h1>
        </div>
      </div>
      <div className="careerGuidenceGrid">
        {cards.map((card, index) => (
          <GuidanceCard
            key={index}
            src={card.src}
            alt={card.alt}
            isPriority={index < 3}
            onClick={() => navigate(card.navigateTo)}
          />
        ))}
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
