import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { API_URL } from "../../utils/constants";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
import { MyCareerGuidanceButton } from "../../components/commonComponents";
import bookImage from "../../assets/bookImage.png";
import winningCup from "../../assets/winningCup.svg";
import homeModal from "../../assets/homeModal.svg";
import crossIconModal from "../../assets/crossIconModal.svg";

import "./EducationalGuidance.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
const EducationalGuidance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizz, setQuizz] = useState([]);
  const [singlequizData, setSinglequizData] = useState({});
  const [open, setOpen] = useState(false);
  const [testId, setTestId] = useState({});
  const [openPieChart, setOpenPieChart] = useState(false);

  useEffect(() => {
    if (data !== undefined) {
      setOpenPieChart(true);
    }
  }, [data]);
  useEffect(() => {
    getQuiz();
  }, []);

  const getQuiz = async () => {
    setLoading(true);
    const response = await getApiWithAuth(API_URL.GETGOALS);
    console.log("==========response", response);
    if (response?.data.status === 200) {
      setQuizz(response.data.data);
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
      <div className="educationalGuidanceMainDiv">
        <div className="welcomeHaddingText pb-3">My Educational Guidance</div>
        <div className="educationalGuidanceSecondDiv">
          {loading ? (
            <Spin className="spinStyle" />
          ) : quizz.length === 0 ? (
            <div className="quizDetailsStyle">No Data Found</div>
          ) : (
            quizz.map((item) => {
              return (
                <div className="quizStyle" key={item.id}>
                  <div className="width90">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img src={bookImage} alt="" />
                      <div style={{ marginLeft: 20 }}>
                        <div className="quizHeadingStyle">{item.name}</div>
                        <div className="quizDetailsStyle">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    {!item.complete ? (
                      <MyCareerGuidanceButton
                        label="Take Test"
                        className="takebutton"
                        type="button"
                        htmlType="button"
                        // onClick={() =>
                        //   navigate("/educational-guidance-test", {
                        //     state: { data: item },
                        //   })
                        // }
                        onClick={() => {
                          console.log("=====>item", item.youtube_link.length);
                          if (item.youtube_link?.length !== 0) {
                            setTestId(
                              `https://www.youtube.com/embed/${item.youtube_link}`
                            );
                            navigate("/video", {
                              state: {
                                data: item,
                                videoId: `https://www.youtube.com/embed/${item.youtube_link}`,
                              },
                            });
                          } else {
                            navigate("/educational-guidance-test", {
                              state: { data: item },
                            });
                          }
                        }}
                      />
                    ) : (
                      <div>
                        <MyCareerGuidanceButton
                          label="Retake"
                          className="takebutton"
                          type="button"
                          htmlType="button"
                          onClick={() => {
                            if (item.youtube_link?.length !== 0) {
                              setTestId(
                                `https://www.youtube.com/embed/${item.youtube_link}`
                              );
                              navigate("/video", {
                                state: {
                                  data: item,
                                  videoId: `https://www.youtube.com/embed/${item.youtube_link}`,
                                },
                              });
                            } else {
                              navigate("/educational-guidance-test", {
                                state: { data: item },
                              });
                            }
                          }}
                        />
                        <MyCareerGuidanceButton
                          label="View Results"
                          className="viewResultButton"
                          type="button"
                          htmlType="button"
                          onClick={() => showModal(item)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* <Modal
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
      </Modal> */}

      <Modal
        centered
        width={700}
        open={isModalOpen}
        footer={[]}
        closable={true}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            paddingBottom: 5,
            borderBottom: "1px solid #DADADA",
          }}
        >
          <div onClick={() => navigate("/dashboard")}>
            <img src={homeModal} alt="homeModal" />
          </div>
          <div onClick={() => setIsModalOpen(false)}>
            <img src={crossIconModal} alt="crossIconModal" />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="quizHeadingStyle">{singlequizData?.name}</div>
          <div className="circularBarMainDiv">
            <div style={{ width: 130 }}>
              <CircularProgressbarWithChildren
                value={singlequizData?.score}
                minValue={0}
                maxValue={singlequizData?.total_score}
                styles={buildStyles({
                  rotation: 0.99,
                  strokeLinecap: "dashboard",
                  textSize: "19px",
                  pathTransitionDuration: 0.5,
                  pathColor: "#1476B7",
                  textColor: "#263238",
                  trailColor: "#d6d6d6",
                })}
              >
                <div className="welcomeHaddingText">
                  {singlequizData?.total_score}
                </div>
                <div className="cao2ndText">
                  <strong>Points</strong>
                </div>
              </CircularProgressbarWithChildren>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="Youtube Video"
        centered
        open={open}
        footer={[]}
        closable={true}
        onCancel={() => setOpen(false)}
      >
        <iframe
          width="100%"
          height="315"
          src={testId}
          title="YouTube Video"
          frameBorder="0"
          allowFullScreen
        ></iframe>
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <MyCareerGuidanceButton
            label="Continue Test"
            className="resultDataButton"
            type="button"
            htmlType="button"
            onClick={() =>
              navigate("/educational-guidance-test", {
                state: { data: testId },
              })
            }
          />
        </div>
      </Modal>

      <Modal
        centered
        width={700}
        open={openPieChart}
        footer={[]}
        closable={true}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            paddingBottom: 5,
            borderBottom: "1px solid #DADADA",
          }}
        >
          <div onClick={() => navigate("/dashboard")}>
            <img src={homeModal} alt="homeModal" />
          </div>
          <div onClick={() => setOpenPieChart(false)}>
            <img src={crossIconModal} alt="crossIconModal" />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="quizHeadingStyle">{data?.quiz}</div>
          <div className="circularBarMainDiv">
            <div style={{ width: 130 }}>
              <CircularProgressbarWithChildren
                value={data?.obtained_score}
                minValue={0}
                maxValue={data?.total_score}
                styles={buildStyles({
                  rotation: 0.99,
                  strokeLinecap: "dashboard",
                  textSize: "19px",
                  pathTransitionDuration: 0.5,
                  pathColor: "#1476B7",
                  textColor: "#263238",
                  trailColor: "#d6d6d6",
                })}
              >
                <div className="welcomeHaddingText">{data?.total_score}</div>
                <div className="cao2ndText">
                  <strong>Points</strong>
                </div>
              </CircularProgressbarWithChildren>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EducationalGuidance;
