import React, { useEffect, useState } from "react";
import { Spin, message, Radio, Space } from "antd";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
import { MyCareerGuidanceButton } from "../commonComponents";
import { useNavigate, useLocation } from "react-router-dom";

const TakeSelfTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [quizResult, setQuizResult] = useState([]);
  const [quizData, setQuizData] = useState({});
  // const [spinnerLoading1, setSpinnerLoading1] = useState(false);
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);
  // const [unattemptedQuestionError, setUnattemptedQuestionError] =
  //   useState(false);
  const { data } = location.state || {};
  const [spinnerLoading, setSpinnerLoading] = useState(false);
  // console.log("===quiz data", quizData);
  // console.log("===quiz result", quizResult);

  // const onChange = (e) => {
  //   const { name, value } = e.target;
  //   let temp = quizResult.filter((item) => item.question_id !== name);
  //   temp.push({ question_id: name, answer_id: value });
  //   setQuizResult(temp);
  // };

  const checkUnattemptQuestions = () => {
    // console.log("====ressss", quizResult);
    // const quizdatamap = quizData.questions?.map((item) => {
    //   console.log("====itemmmmmmmmmmmmmm", item);

    // });
    const filterData = quizData?.questions?.filter((item) => {
      const filterResult = quizResult.filter((item1) => {
        // console.log("====lolllll", item.question_id === item1.question_id);
      });
    });
  };

  useEffect(() => {
    checkUnattemptQuestions();
  }, [quizData, quizResult]);

  useEffect(() => {
    getQuizData();
  }, [data]);

  // useEffect(() => {
  //   // console.log("=====unattempt", unattemptedQuestionError);
  // }, [unattemptedQuestionError]);

  const getQuizData = async () => {
    // console.log("===innnnn");
    setLoading(true);
    // console.log("===data iddddds", data);
    const response = await getApiWithAuth(
      `/psychometric/psychometric/${data.id}/`
    );
    // console.log("=====reseeeeeeepomseeeeee", response);
    if (response?.data?.status === 200) {
      setQuizData(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  // const saveQuizData = async () => {
  //   if (quizResult.length !== quizData.questions?.length) {
  //     message.error("PLease complete all questions");
  //   } else {
  //     setSpinnerLoading(true);
  //     const response = await postApiWithAuth(`/psychometric/take-test/`, {
  //       test: data.id,
  //       answers: quizResult,
  //     });
  //     if (response.data.status === 200) {
  //       message.success("Quiz taken successfully");
  //       navigate("/occupation", {
  //         state: { data: response.data.data.test_id },
  //       });

  //       setSpinnerLoading(false);
  //     } else {
  //       setSpinnerLoading(false);
  //     }
  //   }
  // };
  // useEffect(() => {
  //   // Ensure quizData.questions is an array before using map
  //   if (Array.isArray(quizData.questions)) {
  //     const quizdata = quizData.questions.map((item) =>
  //       console.log("=====iiii", item)
  //     );
  //   } else {
  //     console.error("quizData.questions is not an array!");
  //   }
  // }, []);
  const onChange = (e) => {
    const { name, value } = e.target;
    const existingIndex = quizResult.findIndex(
      (item) => item.question_id === name
    );

    if (existingIndex !== -1) {
      const updatedResult = [...quizResult];
      updatedResult[existingIndex].answer_id = value;
      setQuizResult(updatedResult);
    } else {
      setQuizResult([...quizResult, { question_id: name, answer_id: value }]);
    }
  };

  const saveQuizData = async () => {
    setSubmitButtonClicked(true); // Set the flag to true when the "Submit" button is clicked.

    if (quizResult.length !== quizData.questions?.length) {
      message.error("Please complete all questions");
    } else {
      setSpinnerLoading(true);
      const response = await postApiWithAuth(`/psychometric/take-test/`, {
        test: data.id,
        answers: quizResult,
      });

      if (response.data.status === 200) {
        message.success("Quiz taken successfully");
        navigate("/occupation", {
          state: { data: response.data.data.test_id },
        });
      }

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
              {/* {quizData.questions?.map((item, index) => {
                const isQuestionAnswered = quizResult.some(
                  (result) => result.question_id === item.question_id
                );

                return (
                  <div className="quizBoxStyle" key={item.question_id}>
                    <div style={{ display: "flex" }}>
                      <div style={{ marginRight: 15 }}>{index + 1}</div>
                      <div>
                        <div
                          style={{ color: "#1476b7", fontWeight: "bold" }}
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
                          {isQuestionAnswered ? null : (
                            <p style={{ color: "red" }}>
                              Please select an option
                            </p>
                          )}
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
                  // disabled={quizResult.length !== quizData.questions?.length}
                  onClick={saveQuizData}
                  loading={spinnerLoading}
                /> */}
              {quizData.questions?.map((item, index) => {
                const isQuestionAnswered = quizResult.some(
                  (result) => result.question_id === item.question_id
                );

                return (
                  <div className="quizBoxStyle" key={item.question_id}>
                    <div style={{ display: "flex" }}>
                      <div style={{ marginRight: 15 }}>{index + 1}</div>
                      <div>
                        <div
                          style={{ color: "#1476b7", fontWeight: "bold" }}
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
                              {item.answers?.map((options) => (
                                <Radio
                                  value={options.answer_id}
                                  key={options.answer_id}
                                >
                                  {options.answer}
                                </Radio>
                              ))}
                            </Space>
                          </Radio.Group>
                          {submitButtonClicked && !isQuestionAnswered && (
                            <p style={{ color: "red" }}>
                              Please select an option
                            </p>
                          )}
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
                  onClick={saveQuizData}
                  loading={spinnerLoading}
                />
                <MyCareerGuidanceButton
                  label="Cancel"
                  className="viewResultButton"
                  type="button"
                  htmlType="button"
                  onClick={() => navigate("/self-assesment")}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TakeSelfTest;
