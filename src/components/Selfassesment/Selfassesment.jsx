import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { API_URL } from "../../utils/constants";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
import { MyCareerGuidanceButton } from "../../components/commonComponents";
import bookImage from "../../assets/bookImage.png";
import winningCup from "../../assets/winningCup.svg";
import { useNavigate } from "react-router-dom";

const Selfassesment = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [psychometricTest, setPsychometricTest] = useState([]);
  const [singlequizData, setSinglequizData] = useState({});

  useEffect(() => {
    getPsychometricTest();
  }, []);

  const getPsychometricTest = async () => {
    setLoading(true);
    const response = await getApiWithAuth(API_URL.GETPSYCHOMETRICTEST);
    console.log("===========================te", response);
    if (response.data.status === 200) {
      setPsychometricTest(response.data.data);
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
        <div className="welcomeHaddingText ">Psychometric Test</div>
        <div className="textStyle18 pt-1 pb-3">
          Lorem ipsum is a placeholder text commonly used to demonstrate
        </div>

        <div className="educationalGuidanceSecondDiv">
          {loading ? (
            <Spin className="spinStyle" />
          ) : psychometricTest.length === 0 ? (
            <div className="quizDetailsStyle">No Data Found</div>
          ) : (
            psychometricTest.map((item) => {
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
                        onClick={() =>
                          navigate("/self-assesment-test", {
                            state: { data: item },
                          })
                        }
                      />
                    ) : (
                      <div>
                        <MyCareerGuidanceButton
                          label="Retake"
                          className="takebutton"
                          type="button"
                          htmlType="button"
                          onClick={() =>
                            navigate("/self-assesment-test", {
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
                label={`${singlequizData.score ? singlequizData.score : 0}`}
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

export default Selfassesment;
