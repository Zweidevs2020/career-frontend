import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../../utils/constants";
import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { Spin, Modal } from "antd";

const Right = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [educationGuidance, setEducationGuidance] = useState([]);

  useEffect(() => {
    getducationGuidance();
  }, []);

  const getducationGuidance = async () => {
    setLoading(true);
    const response = await getApiWithAuth(API_URL.DASHBOARDTESTTYPES);
    if (response.data.status === 200) {
      setEducationGuidance(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  return (
    <>
      <div class="h-[100%] w-[100%] items-center flex flex-col">
        <div class="h-[30px] w-[98%]  flex items-center md:h-[40px] md:items-end">
          <p class="text-[#474749] mt-3 sm:text-[15px] ml-2 text-[16px] font-bold">
            Self Assessment
          </p>
        </div>
        <div className="flex flex-wrap justify-center ">
          {loading ? (
            <Spin className="spinStyle" />
          ) : educationGuidance.length === 0 ? (
            <div className="quizDetailsStyle">No Data Found</div>
          ) : (
            educationGuidance.map((item) => {
              return (
                <div key={item.id}>
                  <div
                    style={{
                      background: "#EBF5FF",
                      borderRadius: "20px",
                      width: 180,
                      height: 180,
                      display: "flex",
                      justifyContent: "center",
                      margin: 10,
                    }}
                  >
                    <div
                      style={{
                        width: "80%",
                        height: 160,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                      }}
                    >
                      <div
                        style={{
                          color: "#89AEC4",
                          fontSize: "16px",
                          fontWeight: "500",
                        }}
                      >
                        {item.type}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div class="h-7 w-1 bg-[#006Ed3] ml-2 "></div>
                        <div
                          style={{
                            color: "#006ED3",
                            fontSize: "40px",
                            fontWeight: "700",
                          }}
                        >
                          {" "}
                          {item.score?.total ? item.score.total : 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Right;
