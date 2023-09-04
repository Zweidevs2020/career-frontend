import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { API_URL } from "../../utils/constants";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
import { MyCareerGuidanceButton } from "../../components/commonComponents";
import bookImage from "../../assets/bookImage.png";
import winningCup from "../../assets/winningCup.svg";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import './Selfassesment.css'

const Selfassesment = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [psychometricTest, setPsychometricTest] = useState([]);
  const [singlequizData, setSinglequizData] = useState({});

  useEffect(() => {
    getPsychometricTest();
  }, []);

  const options = {
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: 20,
        barHeight: "50%",
        colors: {

          backgroundBarColors: ["white"],
        },
      },
    },

    chart: {
      id: "basic-bar",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val
        },
        title: {
          formatter: function (seriesName) {
            return ''
          }
        }
      }
    }
  };

  const getPsychometricTest = async () => {
    setLoading(true);
    const response = await getApiWithAuth(API_URL.GETPSYCHOMETRICTEST);

    if (response?.data?.status === 200) {
      const psychometricTestData = response.data.data;

      psychometricTestData.forEach((testData) => {
        if (testData?.test_results?.length > 0) {
          testData.test_results[0].question_scores.sort(
            (a, b) => b.score - a.score
          );
        }
      });

      setPsychometricTest(psychometricTestData);
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
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });


  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  
  return (
    <>
      <div className="educationalGuidanceMainDiv">
        <div className="welcomeHaddingText ">Self Assessment Results</div>

        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {psychometricTest?.map((mapData, index) => {
            let chartColor;
       
            if (mapData.name == 'Occupational Values Assesment') {
           
              chartColor = '#87aded';
            } else if (mapData.name == 'Occupational Interest Assesment') {
              chartColor = '#b9bab8';
            } else {
              chartColor = '#a4eba9'; 
            }
            let chartOptions;
            if (mapData?.test_results?.length > 0) {
              const labels = mapData?.test_results[0]?.question_scores?.map(
                (score) => score.question.split("/")
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
                colors: [chartColor],
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
                <div key={mapData.id} className={`ms-3 mt-5`}>
                  <div
                    className={`${!mapData.complete ? 'grayed-out-container' : ''
                      }`}
                  >
                 
                    <Chart
                      options={chartOptions}
                      series={chartOptions.series}
                      type="bar"
                      width={screenSize.width > '748' ? '450' : '330'}
                      height={320}
                    />
               
                  </div>
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
        </div >
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

              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Selfassesment;
