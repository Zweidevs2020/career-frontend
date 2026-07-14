import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../../utils/constants";
import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { Spin, Modal } from "antd";
import Chart from "react-apexcharts";
import "./Right.css";

const Right = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [educationGuidance, setEducationGuidance] = useState([]);
  const [psychometricTestName, setPsychometricTestName] = useState([]);
  const [psychometricTestResult, setPsychometricTestResult] = useState([]);


  useEffect(() => {
    getducationGuidance();
    getPsychometricTestNames();
  }, []);

  const getducationGuidance = async () => {
    setLoading(true);
    const response = await getApiWithAuth("psychometric/calculate/");
  
    if (response?.data?.status === 200) {
      const testScore = response.data.data

      testScore.forEach((testData) => {
        if (testData?.scores?.length > 0) {
          testData.scores.sort(
            (a, b) => b.score - a.score
          );
        }
      });
    
      setEducationGuidance(response.data.data);


      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const getPsychometricTestNames = async () => {
    const response = await getApiWithAuth(API_URL.GETPSYCHOMETRICTEST);
   
    setPsychometricTestResult(response?.data?.data || [])
    if (response?.data?.status === 200) {
      const filterSCore = response.data.data.filter(
        (item) => item.score === null

      );
     
     
      setPsychometricTestName(filterSCore);

    }
  };


  const options = {
    chart: {
      id: "basic-bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "20%",
        barHeight: "50%",
        colors: {
          backgroundBarColors: ["rgba(0, 0, 0, 0.1)", "#1984FF"],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    
    labels: educationGuidance.map((item) => item.scores.map((score) => score.name))
      .flat(),
    // colors: ["#440542", "#592422"],
    series: [
      {
        data: educationGuidance
          .map((item) => item.scores.map((score) => score.score))
          .flat(),
      },
   
    ],
   
  };

  useEffect(() => {

  }, [educationGuidance]);

  useEffect(() => {
   
  }, [psychometricTestName]);

  // green is first → always applied to index 0 (highest value, data is sorted descending)
  const BAR_COLORS = ['#5CC85A', '#FF9800', '#E91E8C', '#3949AB', '#00BCD4', '#9C27B0', '#FF5722', '#795548'];
  return (
    <>
      <div
        className="w-[100%] flex flex-col rightContainerStyle"
        style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}

      >
        <div className="w-[90%]">
          <div className="dashboardRightDivv">
            <h1 className="dashboardRightHeadingDiv">Psychometric Tests</h1>
          </div>
          <div className="psychometricTestDes">
            <p>3 self assessment tests to help you discover your strengths. </p>
          </div>
          {loading ? (
            <Spin className="spinStyle" />
          ) : educationGuidance.length === 0 ? (
            psychometricTestName.map((item) => (
              <div className="dashboardRightDiv">
                <div className="parentRightDashboardDiv">
                  <div className="parentRightDashboardDivTextDiv">
                    <h1>{item.name}</h1>
                  </div>
                  <div className="parentRightDashboardDivBtnDiv">
                    <button
                      onClick={() =>
                        navigate("/self-assesment-test", {
                          state: { data: item },
                        })
                      }
                    >
                      Take Test
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>
              {educationGuidance.map((item, index) => {
                //  {psychometricTestResult.map((item1, index1) => {
                const labels = item.scores.map((score) => score.name.split("/"));
                const series = item.scores.map((score) => score.score);
                const chartOptions = {
                  ...options,
                  labels,
                  series: [{ data: series }],
                  chart: {
                    ...options.chart,
                    dropShadow: {
                      enabled: true,
                      top: 3,
                      left: 1,
                      blur: 5,
                      opacity: 0.12,
                    },
                  },
                  plotOptions: {
                    bar: {
                      horizontal: true,
                      barHeight: '50%',
                      distributed: true,
                      borderRadius: 8,
                      borderRadiusApplication: 'end',
                      colors: {
                        backgroundBarColors: ['#e8e8e8'],
                        backgroundBarOpacity: 1,
                        backgroundBarRadius: 8,
                      },
                    },
                  },
                  fill: {
                    type: 'gradient',
                    gradient: {
                      type: 'vertical',
                      shadeIntensity: 0.3,
                      opacityFrom: 1,
                      opacityTo: 1,
                      shade: 'light',
                      stops: [0, 100],
                    },
                  },
                  grid: {
                    xaxis: { lines: { show: true } },
                    yaxis: { lines: { show: false } },
                    strokeDashArray: 5,
                    borderColor: '#d5d5d5',
                  },
                  colors: BAR_COLORS,
                  legend: { show: false },
                  yaxis: {
                    labels: {
                      show: true,
                      style: {
                        fontSize: '12px',
                        fontWeight: 500,
                        colors: ['#474749'],
                      },
                      offsetY: 9,
                    },
                  },
                  xaxis: {
                    ...options.xaxis,
                    labels: { show: true },
                  },
                  tooltip: { enabled: false },
                };

                return (
                  <div key={index} className="ms-3 chart-labels-container">
                    <div className="h-[30px] flex justify-between items-center mt-5 chartHeadingwBtn">
                      {/* {psychometricTestName.map((item) => ( */}
                      <div className="leftGraphBtn">
                        
                        <button
                          onClick={() =>
                            navigate("/occupation", {
                              state: { data: item },
                            })
                          }
                        >
                          View Result
                        </button>
                      
                      </div>
                      {/* ))} */}
                      <p className="text-[#474749] mt-3 sm:text-[15px text-[16px] font-bold chartHeading">
                        {item.test_name}
                      </p>
                      <div className="rightGraphBtn">
                        <button
                          onClick={() =>
                            navigate("/self-assesment-test", {
                              state: { data: item },
                            })
                          }
                        >
                          Re-take Test
                        </button>
                      </div>
                    </div>
                    <div key={index} className="chart-container">
                      <Chart
                        options={chartOptions}
                        series={chartOptions.series}
                        type="bar"
                        width="100%"
                        height={Math.max(220, series.length * 30 + 50)}
                      />
                    </div>
                    <hr />
                  </div>
                );
              })}
              {/* })} */}
              {psychometricTestName.map((item) => (
                <div className="dashboardRightDiv">
                  <div className="parentRightDashboardDiv">
                    <div className="parentRightDashboardDivTextDiv">
                      <h1>{item.name}</h1>
                    </div>
                    <div className="parentRightDashboardDivBtnDiv">
                      <button
                        onClick={() =>
                          navigate("/self-assesment-test", {
                            state: { data: item },
                          })
                        }
                        style={{ width: 120 }}
                      >
                        Take Test
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Right;
