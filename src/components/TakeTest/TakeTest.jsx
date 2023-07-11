import React, { useEffect, useState } from "react";
import { Spin, message, Radio, Space, Modal } from "antd";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
import { MyCareerGuidanceButton } from "../commonComponents";
import { useNavigate, useLocation } from "react-router-dom";
import "./TakeTest.css";

const TakeTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [quizResult, setQuizResult] = useState([]);
  const [quizData, setQuizData] = useState({});
  const { data } = location.state || {};
  const [spinnerLoading, setSpinnerLoading] = useState(false);
  const onChange = (e) => {
    const { name, value } = e.target;
    let temp = quizResult.filter((item) => item.question_id !== name);
    temp.push({ question_id: name, answer_id: value });
    setQuizResult(temp);
  };

  useEffect(() => {
    getQuizData();
  }, [data]);

  const getQuizData = async () => {
    setLoading(true);
    const response = await getApiWithAuth(`education/quiz/${data.id}/`);
    if (response.data.status === 200) {
      setQuizData(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const saveQuizData = async () => {
    setSpinnerLoading(true);
    const response = await postApiWithAuth(`/education/quiz-result/`, {
      quiz: data.id,
      answers: quizResult,
    });
    console.log("============res", response);
    if (response.data.status === 200) {
      message.success("Quiz taken successfully");
      navigate("/educational-guidance", {
        state: { data: response.data.data },
      });
      setSpinnerLoading(false);
    } else {
      setSpinnerLoading(false);
    }
  };

  return (
    <>
      <div className="educationalGuidanceMainDiv">
        <div className="welcomeHaddingText pb-4">{quizData.name}</div>
        <div className="educationalGuidanceSecondDiv">
          {loading ? (
            <Spin className="spinStyle" />
          ) : quizData.questions?.length === 0 ? (
            <div className="quizDetailsStyle">No Data Found</div>
          ) : (
            <>
              {quizData.questions?.map((item, index) => {
                return (
                  <div className="quizBoxStyle" key={item.question_id}>
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
                            name={item.question_id}
                            // value={value}
                          >
                            <Space direction="vertical">
                              {item.answers?.map((options) => {
                                return (
                                  <Radio value={options.answer_id}>
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
              })}
              <div className="mt-3">
                <MyCareerGuidanceButton
                  label="Submit"
                  className="takebutton"
                  type="button"
                  htmlType="button"
                  disabled={quizResult.length !== quizData.questions?.length}
                  onClick={saveQuizData}
                  loading={spinnerLoading}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TakeTest;
