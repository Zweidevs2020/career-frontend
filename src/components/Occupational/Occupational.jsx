import React, { useEffect, useState } from "react";
import { Spin, message, Radio, Button, Row, Col } from "antd";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
import { MyCareerGuidanceButton } from "../commonComponents";
import Chart from "react-apexcharts";
import { useNavigate, useLocation } from "react-router-dom";
import "./Occupational.css";
const btnOptions = [
  {
    path: "career-idea",
    name: "Career Ideas",
  },
  {
    path: "choice-idea",
    name: "Subject Choices Ideas",
  },
  {
    path: "study-tips",
    name: "5 Study Tips",
  },
];
const Occupational = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [educationGuidance, setEducationGuidance] = useState([]);

  const { data } = location.state || {};

  useEffect(() => {
    if (data.name || data.test_name) {
      getViewResult(data);
    } else {
      getQuizData();
    }
  }, [data]);

  const getViewResult = async (data) => {
    setLoading(true);
    if (data.name) {
      const response = await getApiWithAuth(
        `/psychometric/result?name=${data.name}`
      );
      if (response.data.status === 200) {
        let sortedData = response.data.data.sort((a, b) => b.score - a.score);

        setEducationGuidance(sortedData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } else if (data.test_name) {
      const response1 = await getApiWithAuth(
        `/psychometric/result?name=${data.test_name}`
      );
      if (response1.data.status === 200) {
        let sortedData = response1.data.data.sort((a, b) => b.score - a.score);

        setEducationGuidance(sortedData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const getQuizData = async () => {
    setLoading(true);
    const response = await getApiWithAuth(`/psychometric/result/${data}/`);
    if (response.data.status === 200) {
      let sortedData = response.data.data.sort((a, b) => b.score - a.score);
      setEducationGuidance(sortedData);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  // const sortByScoreDescending = (a, b) => b.score - a.score;
  // const sortedData = educationGuidance.slice().sort(sortByScoreDescending);

  const scores = educationGuidance.map((item) => item.score);
  const questionTypes = educationGuidance.map((item) => item.question_type);
  const BAR_COLORS = ['#5CC85A', '#FF9800', '#E91E8C', '#3949AB', '#00BCD4', '#9C27B0', '#FF5722', '#795548'];

  const series = [{ data: scores }];

  const options = {
    chart: {
      id: "bar",
      toolbar: { show: false },
      dropShadow: { enabled: true, top: 3, left: 1, blur: 5, opacity: 0.12 },
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
    dataLabels: { enabled: false },
    xaxis: { categories: questionTypes, labels: { show: true } },
    colors: BAR_COLORS,
    series: [{ data: scores }],
    title: { text: educationGuidance[0]?.test_name, align: "center" },
    legend: { show: false },
    yaxis: {
      labels: {
        show: true,
        style: { fontSize: '12px', fontWeight: 500, colors: ['#474749'] },
        offsetY: 4,
      },
    },
    tooltip: { enabled: false },
  };

  return (
    <>
      <div className="mySelf occupationPageShell ">
        {loading ? (
          <div className="occupationPageCard occupationLoadingCard">
            <Spin className="spinStyle" />
          </div>
        ) : educationGuidance?.length === 0 ? (
          <div className="occupationPageCard occupationLoadingCard">
            <div className="quizDetailsStyle">No Data Found</div>
          </div>
        ) : (
          <div className="occupationPageCard">
            <div className="occupationPageTopRow">
              <Button
                className="skillsButton"
                type="primary"
                onClick={() => {
                  if (data.test_name) {
                    navigate("/dashboard");
                  } else {
                    navigate("/self-assesment");
                  }
                }}
                >
                  Back
                </Button>
            </div>
            <div className="welcomeHaddingText occupationPageTitle">
              {educationGuidance[0]?.test_name}
            </div>

            <div className="occupationResultsSurface">
              <div
                style={{
                  backgroundColor: "white",
                  width: "100%",
                  padding: 15,
                  borderRadius: 18,
                  boxShadow: "0 12px 28px rgba(0, 0, 0, 0.06)",
                  border: "1px solid rgba(20, 118, 183, 0.08)",
                }}
              >
                <Chart
                  options={options}
                  series={options.series}
                  type="bar"
                  width={"100%"}
                  height={Math.max(220, scores.length * 30 + 50)}
                />
              </div>
              <div className="mt-5 pt-5">
                {educationGuidance?.map((item) => {
                  return (
                    <div>
                      <div
                        className="textStyle18 pt-1 pb-3"
                        style={{ color: "#030303", fontWeight: 600 }}
                      >
                        {item.question_type}
                      </div>
                      <div className="textStyle18 pt-1 pb-3"
                      style={{ color: "#363636" }}>
                        {item.description}
                      </div>
                      <div>
                        <Row
                          gutter={[4, 8]}
                          className="occupationOptionBackground"
                        >
                          {btnOptions.map((buttonitem, index) => (
                            <Col span={24} md={8} key={buttonitem.path}>
                              <Button
                                className="skillsButton"
                                type="primary"
                                key={index}
                                style={{ width: "100%" }}
                                // onClick={() => {
                                //   navigate(`/occupation/}/${buttonitem.name}/${buttonitem.path}/${item.id}`, {
                                //     preventScrollReset: true,
                                //   });
                                // }}

                                onClick={() =>
                                  navigate(`/occupation/${buttonitem.path}`, {
                                    state: {
                                      item: item,
                                      buttonitem: buttonitem,
                                    },
                                    preventScrollReset: true,
                                  })
                                }
                              >
                                {buttonitem.name}
                              </Button>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Occupational;
