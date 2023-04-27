import React, { useEffect, useState } from "react";
import { Button, Modal, Spin, Input, Radio, Space } from "antd";
import { API_URL } from "../../utils/constants";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
import { MyCareerGuidanceButton } from "../commonComponents";
import bookImage from "../../assets/bookImage.png";
import winningCup from "../../assets/winningCup.svg";
import { useNavigate, useLocation } from "react-router-dom";
import "./TakeTest.css";

const TakeTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizResult, setQuizResult] = useState([]);
  const [quizData, setQuizData] = useState({});
  const { data } = location.state || {};
  console.log("======================data", data);
  const [value, setValue] = useState(1);
  const onChange = (e) => {
    console.log("======================radio checked", e.target);
    setValue(e.target.value);
  };
  useEffect(() => {
    getQuizData();
  }, [data]);

  const getQuizData = async () => {
    setLoading(true);
    const response = await getApiWithAuth(`education/quiz/${data.id}/`);
    console.log("=====================", response);
    if (response.data.status === 200) {
      setQuizData(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="educationalGuidanceMainDiv">
        <div className="educationalGuidanceSecondDiv">
          <div className="welcomeHaddingText">
            {data.complete ? "Retake Test " : "Take Test "}
            {quizData.name}
          </div>
          {loading ? (
            <Spin />
          ) : quizData.question?.length === 0 ? (
            <div className="quizDetailsStyle">No Data Found</div>
          ) : (
            quizData.question?.map((item, index) => {
              return (
                <div className="quizBoxStyle" key={item.id}>
                  <div style={{ display: "flex" }}>
                    <div style={{ marginRight: 15 }}>{index + 1}</div>
                    <div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.question,
                        }}
                      ></div>
                      <div className="mt-3">
                        <Radio.Group
                          onChange={onChange}
                          name="answer"
                          // value={value}
                        >
                          <Space direction="vertical">
                            {item.answer?.map((options) => {
                              return (
                                <Radio value={options.answer}>
                                  {options.answer}
                                </Radio>
                              );
                            })}
                          </Space>
                        </Radio.Group>
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

export default TakeTest;
