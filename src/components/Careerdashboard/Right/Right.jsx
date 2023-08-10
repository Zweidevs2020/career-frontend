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
 

  useEffect(() => {
    getducationGuidance();
    getPsychometricTestNames();
  }, []);

  const getducationGuidance = async () => {
    setLoading(true);
    const response = await getApiWithAuth("psychometric/calculate/");
   
    if (response?.data?.status === 200) {
      setEducationGuidance(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const getPsychometricTestNames = async () => {
    const response = await getApiWithAuth(API_URL.GETPSYCHOMETRICTEST);
 
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
    labels: educationGuidance
      .map((item) => item.scores.map((score) => score.name))
      .flat(),
    colors: ["#8BBDDB"],
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

 
  return (
    <>
      <div
        className="h-[100%] w-[100%]  flex flex-col rightContainerStyle"
       
      >
        <div className="w-[90%]">
          <div className="dashboardRightDivv">
            <h1 className="dashboardRightHeadingDiv">Psychometric Tests</h1>
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
                const labels = item.scores.map((score) => score.name);
                const series = item.scores.map((score) => score.score);

                const chartOptions = {
                  ...options,
                  labels,
                  series: [{ data: series }],
                  plotOptions: {
                    bar: {
                      horizontal: true,
                    },
                  },
                  
                };
              
                return (
                  <div key={index} className="ms-3">
                    <div className="h-[30px] flex justify-between items-center mt-5 chartHeadingwBtn">
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
                      height={320}
                    />
                    </div>
                    <hr />
                  </div>
                );
              })}
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
