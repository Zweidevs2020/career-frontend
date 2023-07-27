import React, { useEffect, useState } from "react";
import { Spin, message, Radio, Button } from "antd";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
import { MyCareerGuidanceButton } from "../commonComponents";
import Chart from "react-apexcharts";
import { useNavigate, useLocation } from "react-router-dom";

const Occupational = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [educationGuidance, setEducationGuidance] = useState([]);

  const { data } = location.state || {};
  useEffect(() => {
    if (data.name) {
      getViewResult();
    } else {
      getQuizData();
    }
  }, [data]);

  const getViewResult = async () => {
    setLoading(true);
    const response = await getApiWithAuth(
      `/psychometric/result?name=${data.name}`
    );
    if (response.data.status === 200) {
      setEducationGuidance(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const getQuizData = async () => {
    setLoading(true);
    const response = await getApiWithAuth(`/psychometric/result/${data}/`);
    if (response.data.status === 200) {
      setEducationGuidance(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  console.log("===========edddd", educationGuidance);

  // Custom sorting function to sort the data in ascending order based on 'score'
  // const sortByScore = (a, b) => a.score - b.score;

  // Sort the data based on the 'score' field in ascending order
  // const sortedData = educationGuidance.slice().sort(sortByScore);
  // console.log("=====22222", sortedData);

  // const options = {
  //   chart: {
  //     id: "bar",
  //     toolbar: {
  //       show: false,
  //     },
  //     height: 350,
  //   },
  //   plotOptions: {
  //     bar: {
  //       horizontal: true,
  //       columnWidth: "50%",
  //       colors: {
  //         backgroundBarColors: ["rgba(0, 0, 0, 0.1)", "#8BBDDB"], // Set the background color of the bars
  //       },
  //     },
  //   },
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   // xaxis: {
  //   //   categories: educationGuidance.map((item) => item.question_type).flat(),
  //   // },
  //   xaxis: {
  //     categories: sortedData.map((item) => item.question_type),
  //   },
  //   colors: ["#8BBDDB"],
  //   series: [
  //     {
  //       data: sortedData.map((item) => item.score),
  //     },
  //   ],
  //   title: {
  //     text: educationGuidance[0]?.test_name,
  //     align: "center",
  //   },
  //   tooltip: {
  //     y: {
  //       formatter: (value) => value, // Show the exact value in the tooltip
  //     },
  //   },
  // };
  // Custom sorting function to sort the data in ascending order based on 'score'
  const sortByScore = (a, b) => a.score - b.score;

  // Sort the data based on the 'score' field in ascending order
  const sortedData = educationGuidance.slice().sort(sortByScore);

  // Extract scores and question types separately from the sortedData
  const scores = sortedData.map((item) => item.score);
  const questionTypes = sortedData.map((item) => item.question_type);

  // Now you can use the sorted data directly in the ApexCharts series data
  const series = [
    {
      data: scores,
    },
  ];

  const options = {
    chart: {
      id: "bar",
      toolbar: {
        show: false,
      },
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "50%",
        colors: {
          // backgroundBarColors: ["rgba(0, 0, 0, 0.1)", "#8BBDDB"],
          backgroundBarColors: ["white"],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: questionTypes,
    },
    colors: ["#8BBDDB"],
    series: [
      {
        data: scores,
      },
    ],
    title: {
      text: educationGuidance[0]?.test_name,
      align: "center",
    },
    tooltip: {
      y: {
        formatter: (value) => value,
      },
    },
  };
  return (
    <>
      <div className="educationalGuidanceMainDiv">
        {loading ? (
          <Spin className="spinStyle" />
        ) : educationGuidance?.length === 0 ? (
          <div className="quizDetailsStyle">No Data Found</div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                className="viewResultButton"
                type="primary"
                onClick={() => navigate("/self-assesment")}
                style={{ color: "white" }}
              >
                BACK
              </Button>
            </div>
            <div className="welcomeHaddingText ">
              {educationGuidance[0]?.test_name}
            </div>
            <div className="textStyle18 pt-1 pb-3">
              Lorem ipsum is a placeholder text commonly used to demonstrate
            </div>

            <div className="educationalGuidanceSecondDiv">
              <div
                style={{
                  backgroundColor: "white",
                  height: 410,
                  width: "95%",
                  padding: 15,
                  border: 20,
                }}
              >
                <Chart
                  options={options}
                  series={options.series}
                  type="bar"
                  width={"100%"}
                  height={350}
                />
              </div>
              <div className="mt-5 pt-5">
                {educationGuidance.map((item) => {
                  return (
                    <div>
                      <div
                        className="textStyle18 pt-1 pb-3"
                        style={{ color: "#1476B7", fontWeight: 600 }}
                      >
                        {item.question_type}
                      </div>
                      <div className="textStyle18 pt-1 pb-3">
                        {item.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Occupational;
