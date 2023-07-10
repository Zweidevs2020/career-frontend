import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { API_URL } from "../../utils/constants";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
import { MyCareerGuidanceButton } from "../../components/commonComponents";
import bookImage from "../../assets/bookImage.png";
import winningCup from "../../assets/winningCup.svg";
import "./EducationalGuidance.css";
import { useNavigate } from "react-router-dom";

const EducationalGuidance = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizz, setQuizz] = useState([]);
  const [singlequizData, setSinglequizData] = useState({});
  const [open, setOpen] = useState(false);
  const [testId, setTestId] = useState({});

  useEffect(() => {
    getQuiz();
  }, []);

  const getQuiz = async () => {
    setLoading(true);
    const response = await getApiWithAuth(API_URL.GETGOALS);
    if (response.data.status === 200) {
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
                          setTestId(item);
                          setOpen(true);
                        }}
                      />
                    ) : (
                      <div>
                        <MyCareerGuidanceButton
                          label="Retake"
                          className="takebutton"
                          type="button"
                          htmlType="button"
                          onClick={() =>
                            navigate("/educational-guidance-test", {
                              state: { data: item },
                            })
                          }
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
      <Modal
        title="Youtube"
        centered
        open={open}
        footer={[]}
        closable={true}
        onCancel={() => setOpen(false)}
      >
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${22}`}
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
    </>
  );
};

export default EducationalGuidance;
