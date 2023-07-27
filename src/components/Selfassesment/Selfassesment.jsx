import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { API_URL } from "../../utils/constants";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
import { MyCareerGuidanceButton } from "../../components/commonComponents";
import bookImage from "../../assets/bookImage.png";
import winningCup from "../../assets/winningCup.svg";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";

const Selfassesment = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [psychometricTest, setPsychometricTest] = useState([]);
  const [singlequizData, setSinglequizData] = useState({});

  useEffect(() => {
    getPsychometricTest();
  }, []);
  console.log("====goatttttttt unicorn", psychometricTest);
  const options = {
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: 20, // Adjust the width as per your requirement
        barHeight: "50%", // Set the fixed height for the bars (adjust the value as needed)
        colors: {
          // backgroundBarColors: ["rgba(0, 0, 0, 0.1)", "#1984FF"],
          backgroundBarColors: ["white"],
        },
      },
    },
    colors: ["#8BBDDB"],
    chart: {
      id: "basic-bar",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    // Rest of your options and data
  };

  const getPsychometricTest = async () => {
    setLoading(true);
    const response = await getApiWithAuth(API_URL.GETPSYCHOMETRICTEST);
    console.log("=======================", response);
    if (response?.data?.status === 200) {
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
        <div className="welcomeHaddingText ">Self Assessment Results</div>
        {/* <div className="textStyle18 pt-1 pb-3">
          Lorem ipsum is a placeholder text commonly used to demonstrate
        </div> */}
        <div style={{ display: "flex", flexWrap: "wrap", margin: 10 }}>
          {psychometricTest?.map((mapData, index) => {
            let chartOptions;
            if (mapData?.test_results?.length > 0) {
              const labels = mapData?.test_results[0]?.question_scores?.map(
                (score) => score.question
              );
              const series = mapData?.test_results[0]?.question_scores?.map(
                (score) => score.score
              );
              const title = mapData.name;
              chartOptions = {
                ...options,
                labels,
                series: [{ data: series }],
                title: { text: title },
              };
            } else {
              chartOptions = {
                ...options,
                labels: [0, 0, 0],
                series: [{ data: [0, 0, 0] }],
                title: { text: mapData?.name },
              };
            }
            return (
              <>
                <div key={mapData.id} className="ms-3 mt-5">
                  <Chart
                    options={chartOptions}
                    series={chartOptions.series}
                    type="bar"
                    width={450}
                    height={320}
                  />
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {!mapData.complete ? (
                      <MyCareerGuidanceButton
                        label="Take Test"
                        className="takebutton"
                        type="button"
                        htmlType="button"
                        onClick={() =>
                          navigate("/self-assesment-test", {
                            state: { data: mapData },
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
                              state: { data: mapData },
                            })
                          }
                        />
                        <MyCareerGuidanceButton
                          label="View Results"
                          className="viewResultButton"
                          type="button ms-3"
                          htmlType="button"
                          onClick={() =>
                            navigate("/occupation", {
                              state: { data: mapData },
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            );
          })}
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
