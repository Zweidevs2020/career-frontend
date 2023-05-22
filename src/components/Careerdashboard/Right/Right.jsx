import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../../utils/constants";
import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { Spin, Modal } from "antd";
import Chart from "react-apexcharts";

const Right = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [educationGuidance, setEducationGuidance] = useState([]);

  useEffect(() => {
    getducationGuidance();
  }, []);

  const getducationGuidance = async () => {
    setLoading(true);
    const response = await getApiWithAuth("psychometric/calculate/");
    console.log("========================res", response);
    if (response.data.status === 200) {
      setEducationGuidance(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const options = {
    // plotOptions: {
    //   bar: {
    //     horizontal: true
    //   }
    // },
    chart: {
      id: "basic-bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: 20,
        colors: {
          backgroundBarColors: ["rgba(0, 0, 0, 0.1)", "#1984FF"], // Set the background color of the bars
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    labels: educationGuidance
      .map((item) => item.scores.map((score) => score.name))
      .flat(),
    colors: ["#1984FF"],
    series: [
      {
        data: educationGuidance
          .map((item) => item.scores.map((score) => score.score))
          .flat(),
      },
    ],
  };

  return (
    <>
      <div class="h-[100%] w-[100%]  flex flex-col">
        {loading ? (
          <Spin className="spinStyle" />
        ) : educationGuidance.length === 0 ? (
          <div className="quizDetailsStyle spinStyle">No Data Found</div>
        ) : (
          <div>
            {educationGuidance.map((item, index) => {
              const labels = item.scores.map((score) => score.name);
              const series = item.scores.map((score) => score.score);

              const chartOptions = {
                ...options,
                labels,
                series: [{ data: series }],
              };

              return (
                <div key={index} className="ms-3">
                  <div class="h-[30px]">
                    <p class="text-[#474749] mt-3 sm:text-[15px text-[16px] font-bold">
                      {item.test_name}
                    </p>
                  </div>
                  <Chart
                    options={chartOptions}
                    series={chartOptions.series}
                    type="bar"
                    width={380}
                    height={320}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Right;
