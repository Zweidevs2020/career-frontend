import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { API_URL } from "../../utils/constants";
import { getApiWithAuth } from "../../utils/api";
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

import Color from "color";

const EducationalGuidance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizz, setQuizz] = useState([]);
  const [singlequizData, setSinglequizData] = useState({});
  const [testId, setTestId] = useState({});
  const [openPieChart, setOpenPieChart] = useState(false);
  const [open, setOpen] = useState(false);

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
    setLoading(false);
    if (response?.data.status === 200) {
      setQuizz(response.data.data);
    }
  };

  const showModal = (scoreView) => {
    setSinglequizData(scoreView);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const calculateProgressColor = (score) => {
    const hue = (score / singlequizData.total_score) * 120;
    const progressColor = Color.hsl(hue, 100, 50);
    return progressColor.hex();
  };

  useEffect(() => {
    if (data?.obtained_score !== undefined) {
      localStorage.setItem("obtained_score", data.obtained_score);
    }
  }, [data?.obtained_score]);

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
            quizz.map((item) => (
              <div className="quizStyle" key={item.id}>
                <div className="width90">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={bookImage} alt="" />
                    <div style={{ marginLeft: 20 }}>
                      <div className="quizHeadingStyle">{item.name}</div>
                      <div className="quizDetailsStyle">{item.description}</div>
                    </div>
                  </div>
                  {!item.complete ? (
                    <MyCareerGuidanceButton
                      label="Take Test"
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
                  ) : (
                    <div className="retakeChart">
                      <div className="quizBoard">
                        <CircularProgressbarWithChildren
                          value={singlequizData?.score}
                          minValue={0}
                          maxValue={data?.total_score}
                          styles={buildStyles({
                            pathColor: calculateProgressColor(
                              localStorage.getItem("obtained_score") || 0
                            ),
                            pathColor: "#1476b7",
                            rotation: 0.99,
                            strokeLinecap: "dashboard",
                            textSize: "19px",
                            pathTransitionDuration: 0.5,
                            textColor: "#263238",
                            trailColor: "#d6d6d6",
                          })}
                        >
                          <div className="welcomeHaddingText">
                            {localStorage.getItem("obtained_score") || 0}/10
                          </div>
                          <div className="cao2ndText">
                            <strong>Points</strong>
                          </div>
                        </CircularProgressbarWithChildren>
                      </div>
                      <div className="retake">
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
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for quiz results */}
      <Modal
        centered
        width={700}
        open={isModalOpen}
        footer={[]}
        closable={true}
        onCancel={handleCancel}
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
          <div className="crossContainer" onClick={() => setIsModalOpen(false)}>
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
          <div className="retakeButton">
            <div style={{ width: 130 }}>
              <CircularProgressbarWithChildren
                value={singlequizData?.score}
                minValue={0}
                maxValue={singlequizData?.total_score}
                styles={buildStyles({
                  // Use the dynamically calculated progress color
                  pathColor: calculateProgressColor(singlequizData?.score),
                  pathColor: "#1476b7",
                  rotation: 0.99,
                  strokeLinecap: "dashboard",
                  textSize: "19px",
                  pathTransitionDuration: 0.5,
                  textColor: "#263238",
                  trailColor: "#d6d6d6",
                })}
              >
                <div className="welcomeHaddingText">
                  {singlequizData?.score} /{singlequizData?.total_score}
                </div>
                <div className="cao2ndText">
                  <strong>Points</strong>
                </div>
              </CircularProgressbarWithChildren>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal for YouTube video */}
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

      {/* Modal for pie chart */}
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
          <div
            className="crossContainer"
            onClick={() => setOpenPieChart(false)}
          >
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
                  // Use the dynamically calculated progress color
                  pathColor: calculateProgressColor(data?.obtained_score),
                  pathColor: "#1476b7",
                  rotation: 0.99,
                  strokeLinecap: "dashboard",
                  textSize: "19px",
                  pathTransitionDuration: 0.5,
                  textColor: "#263238",
                  trailColor: "#d6d6d6",
                })}
              >
                <div className="welcomeHaddingText">
                  {data?.obtained_score}/{data?.total_score}
                </div>
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
