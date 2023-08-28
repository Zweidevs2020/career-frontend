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
  console.log("===prev data",data)
  useEffect(() => {
    if (data.name || data.test_name) {
      console.log("===in ifff")
      getViewResult(data);
    } 
    else {
      console.log("===in elses")
      getQuizData();
    }
  }, [data]);


  const getViewResult = async (data) => {
    setLoading(true);
    if(data.name){
    const response = await getApiWithAuth(
      `/psychometric/result?name=${data.name}`
    );
    if (response.data.status === 200) {
      setEducationGuidance(response?.data?.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
    }
    else if(data.test_name){
      const response1 = await getApiWithAuth(
        `/psychometric/result?name=${data.test_name}`
      );
      if (response1.data.status === 200) {
        setEducationGuidance(response1?.data?.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }

    // console.log("====resssss",response)

  };

  const getQuizData = async () => {
    console.log("==innn")
    setLoading(true);
    const response = await getApiWithAuth(`/psychometric/result/${data}/`);   
    if (response.data.status === 200) {
      setEducationGuidance(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
 

  const sortByScoreDescending = (a, b) => b.score - a.score;
  const sortedData = educationGuidance.slice().sort(sortByScoreDescending);

  const scores = sortedData.map((item) => item.score);
  const questionTypes = sortedData.map((item) => item.question_type);
  let chartColor;

  if (educationGuidance[0]?.test_name == 'Occupational Values Assesment') {
   
    chartColor = '#87aded';
  } else if (educationGuidance[0]?.test_name == 'Occupational Interest Assesment') {
    chartColor = '#b9bab8';
  } else {
    chartColor = '#a4eba9'; 
  }
 
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
    colors: [chartColor],
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
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <Button
                className="viewResultButton"
                type="primary"
                onClick={() => {
                  if(data.test_name){
                    navigate("/dashboard")
                  }
                  else{
                    navigate("/self-assesment")
                  }
                }}
                style={{ color: "white" }}
              >
                Back
              </Button>
            </div>
            <div className="welcomeHaddingText ">
              {educationGuidance[0]?.test_name}
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
