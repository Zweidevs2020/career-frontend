import React, { useEffect, useState } from "react";
import searchicon from "../../../assets/searchicon.svg";
import imgcard from "../../../assets/imgcard.svg";
import imgcard2 from "../../../assets/imgcard2.svg";
import imgcard3 from "../../../assets/imgcard3.svg";
import imgcard4 from "../../../assets/imgcard4.svg";
import bokimg from "../../../assets/bokimg.svg";
import editimg from "../../../assets/editimg.svg";
import winningCup from "../../../assets/winningCup.svg";
import { MyCareerGuidanceButton } from "../../../components/commonComponents";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../../utils/constants";
import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { Spin, Modal } from "antd";

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

  const showModal = (scoreView) => {
    setSinglequizData(scoreView);
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="h-[40px] w-[100%] flex items-center justify-between">
        <div className="h-[40px] w-[53%] flex items-center ml-3  sm:flex sm:items-center sm:justify-start md:flex md:items-center md:justify-start md:h-[40px] md:w-[60%] lg:flex lg:items-center lg:justify-start  lg:h-[40px] lg:w-[60%]">
          <h1 className="text-[18px] sm:text-[15px]  text-[#474749] font-bold ml-1">
            Career Guidance
          </h1>
        </div>
        <div className="h-[40px] w-[25%]  mr-2 flex items-center justify-around sm:w-[35%] sm:mr-1 md:mr-1 md:h-[40px] md:w-[30%] lg:h-[40px] lg:w-[35%] ">
          <img src={searchicon} className="sm:h-[16px] md:h-[18px]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-[75%] sm:w-[70%] border-none outline-none"
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 px-3">
        <div
          className="col-span-6  rounded-xl"
          onClick={() => {
            navigate("/cao-calculator");
          }}
        >
          <img src={imgcard} className=" bg-cover" />
        </div>
        <div
          className="col-span-6  rounded-xl"
          onClick={() => {
            navigate("/cao-calculator");
          }}
        >
          <img src={imgcard3} className=" bg-cover" />
        </div>
        <div
          className="col-span-6  rounded-xl"
          onClick={() => {
            navigate("/cao-calculator");
          }}
        >
          <img src={imgcard2} className=" bg-cover" />
        </div>
        <div
          className="col-span-6  rounded-xl"
          onClick={() => {
            navigate("/cao-calculator");
          }}
        >
          <img src={imgcard4} className=" bg-cover" />
        </div>
      </div>
      <div className="h-[30px] w-[100%] flex items-center justify-start ">
        <div className="h-[40px] w-[53%] mt-3 ml-3 flex items-center sm:h-[30px] sm:w-[90%] md:w-[90%] lg:w-[90%] ">
          <h1 className="text-[18px] sm:text-[15px] text-[#474749]  font-bold ml-1 ">
            My Educational Guidance
          </h1>
        </div>
      </div>
      <div className="w-[100%] grid sm:grid-cols-1 lg:grid-cols-1 grid-cols-2 gap-2">
        {loading ? (
          <Spin className="spinStyle" />
        ) : educationGuidance.length === 0 ? (
          <div className="quizDetailsStyle">No Data Found</div>
        ) : (
          educationGuidance.map((item) => {
            return (
              <div
                key={item.id}
                className="h-[60px] w-[90%] mt-3 bg-[#F7F7F7] sm:ms-4 rounded-lg flex items-center justify-around sm:h-[50px] lg:h-[60px] px-2 "
              >
                <div className="h-[45px] w-[15%] sm:h-[25px] sm:w-[16%] md:h-[35px] md:w-[16%] lg:h-[35px] lg:w-[18%] bg-blue-300 rounded-lg flex items-center justify-center">
                  {!item.complete ? (
                    <img
                      src={bokimg}
                      className="h-[20px] sm:h-[12px] md:h-[15px] lg:h-[16px]"
                    />
                  ) : (
                    <img
                      src={editimg}
                      className="h-[25px] sm:h-[14px] md:h-[17px] lg:h-[17px]"
                    />
                  )}
                </div>
                <div className="h-[45px] w-[50%]  flex flex-col items-start sm:h-[30px]  md:h-[35px] lg:h-[35px]">
                  <p className="text-[#303030] sm:text-[12px] md:text-[15px]  lg:text-[13px] font-bold">
                    {item.name}
                  </p>
                  <p className=" garage-title text-[#BDBDBD] text-[12px]">
                    {item.description}
                  </p>
                </div>
                {!item.complete ? (
                  <div className="h-[45px] w-[25%]  flex items-center justify-center">
                    <button
                      onClick={() =>
                        navigate("/educational-guidance-test", {
                          state: { data: item },
                        })
                      }
                      className="h-[31px] w-[100%] rounded-lg bg-[#1476B7] text-[#fff] text-[10px]"
                    >
                      Take Test
                    </button>
                  </div>
                ) : (
                  <div className="h-[45px] w-[25%]  flex items-center justify-center ">
                    <button
                      onClick={() => showModal(item)}
                      className="h-[31px] w-[100%] rounded-lg bg-[#1476B7] text-[#fff] text-[10px]  "
                    >
                      View Result
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
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
