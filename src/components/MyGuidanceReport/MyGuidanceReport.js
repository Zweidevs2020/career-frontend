import React, { useState, useEffect, useRef } from "react";
import { API_URL } from "../../utils/constants";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Layout,
  Row,
  Col,
  Grid,
  Drawer,
  message,
  Spin,
} from "antd";

import { useNavigate } from "react-router-dom";
import ContentComponent from "../layoutComponents/contentComponent";
import HelperComponent from "./helper";
import {
  MyCareerGuidanceButton,
  MyCareerGuidanceInputField,
} from "../../components/commonComponents";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  EllipsisOutlined,
  SendOutlined,
  SyncOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import styles from "./myGuidanceReport.module.css";
import "./MyGuidanceReport.css";

const { Footer } = Layout;
const { useBreakpoint } = Grid;

const MyChoices = () => {
  const messageRef = useRef(null);
  const screens = useBreakpoint();
  const inputRef = useRef();
  const [postResponse, setPostResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [messageArray, setMessageArray] = useState({ questions: [] });
  // const [messageArray, setMessageArray] = useState({
  //   questions: [
  //     {
  //       question: "What is React?",
  //       questionId: 1,
  //       answers: [
  //         {
  //           text: "It is maintained by Facebook and a community of individual developers and companies.",
  //         },
  //       ],
  //       lastAnswer: false,
  //     },
  //     {
  //       question: "What is a component in React?",
  //       questionId: 2,
  //       answers: [
  //         {
  //           text: "Components are the building blocks of a React application's UI.",
  //         },
  //         { text: "They can be either class-based or functional." },
  //       ],
  //       lastAnswer: false,
  //     },
  //     {
  //       question: "What is state in React?",
  //       questionId: 3,
  //       answers: [
  //         {
  //           text: "State is an object that determines how that component renders & behaves.",
  //         },
  //         {
  //           text: "It is managed within the component similar to variables declared within a function. It is managed within the component similar to variables declared within a function. It is managed within the component similar to variables declared within a function. It is managed within the component similar to variables declared within a function.",
  //         },
  //       ],
  //       lastAnswer: true,
  //     },
  //   ],
  // });
  const [messageArray, setMessageArray] = useState({});
  const [currentAnswerPrint, setCurrentAnswerPrint] = useState(true);
  const [disableFields, setDisableFields] = useState(false);
  const [regenerateAnswerSpinner, setRegenerateAnswerSpinner] = useState(false);
  const [isSpinnerOuter, setIsSpinnerOuter] = useState(false);

  const [data, setData] = useState({
    question: "",
    questionId: "",
  });
  const onMessageChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const getChat = async () => {
    setIsLoading(true);
    try {
      const response = await getApiWithAuth(`ai-report/chatbot/`);
      console.log("[getChats]", response?.data?.data);
      if (response?.data?.data?.success) {
        console.log("[object]", response);
        const welcomeMessage = {
          question: response?.data?.data?.message,
          questionId: 0,
          answers: [],
          lastAnswer: false,
        };
        console.log("[welcome]", welcomeMessage);
        setMessageArray({
          questions: [welcomeMessage],
        });
        // setGetChats(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching chatbot welcome message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getChat();
  }, []);

  const regenerateAnswer = async (questionRegenerate) => {
    // setDisableFields(true);
    // setRegenerateAnswerSpinner(true);
    // const response = await postApiWithAuth(API_URL.QUESTION_ANSWER, {
    //   question: questionRegenerate.question,
    //   chatroom: myParamValue,
    //   questionId: questionRegenerate.questionId,
    // });
    // if (response.data.data.success) {
    //   const updatedQuestions = messageArray.questions.map((question) => {
    //     if (question.questionId === response.data.data.data.questionId) {
    //       return {
    //         ...question,
    //         answers: response.data.data.data.answers,
    //         lastAnswer: true,
    //       };
    //     } else {
    //       return question;
    //     }
    //   });
    //   const updatedMessageArray = {
    //     ...messageArray,
    //     questions: updatedQuestions,
    //   };
    //   setMessageArray(updatedMessageArray);
    //   setRegenerateAnswerSpinner(false);
    // } else {
    //   setRegenerateAnswerSpinner(false);
    // }
  };

  const onSend = async (event) => {
    console.log(
      "=====================messageArray",
      messageArray,
      data?.question
    );

    try {
      const response = await postApiWithAuth(`ai-report/chatbot/`, {
        message: data.question,
      });
      console.log("post", response);
      if (response?.data?.data?.success) {
        console.log("[object]", response?.data?.data?.response);
        setPostResponse(response?.data?.data?.response);
        const welcomeMessage = {
          question: response?.data?.data?.message,
          questionId: 0,
          answers: [],
          lastAnswer: false,
        };
        setMessageArray({
          questions: [welcomeMessage],
        });
        // setGetChats(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching chatbot welcome message:", error);
    }

    if (data?.question?.length < 1 || disableFields) return;
    if (inputRef.current) {
      inputRef.current.blur();
    }
    setIsSpinnerOuter(true);
    setDisableFields(true);
    setMessageArray({
      ...messageArray,
      questions: [
        ...messageArray.questions,
        {
          question: data.question,
          questionId: messageArray.questions.length + 1,
          answers: [{ text: postResponse }],

          lastAnswer: true,
        },
      ],
    });

    // setMessageArray({
    //   ...messageArray,
    //   questions: [
    //     ...messageArray.questions,
    //     {
    //       ...response.data.data.data,
    //       lastAnswer: true,
    //     },
    //   ],
    // });

    setData({
      question: "",
    });

    setIsSpinnerOuter(false);

    // const response = await postApiWithAuth(API_URL.QUESTION_ANSWER, {
    //   data,
    // });
    // if (response.data.data.success) {
    //   setMessageArray({
    //     ...messageArray,
    //     questions: [
    //       ...messageArray.questions,
    //       {
    //         ...response.data.data.data,
    //         lastAnswer: true,
    //       },
    //     ],
    //   });

    //   setData({
    //     question: "",
    //   });
    //   setIsSpinnerOuter(false);
    // } else {
    //   setIsSpinnerOuter(false);
    // }
  };
  useEffect(() => {
    console.log("=====================messageArray", messageArray);
  }, [messageArray]);
  return (
    <>
      <div className={styles.educationalGuidanceMainDiv}>
        <div className={styles.educationalGuidanceSecondDiv}>
          <div className="welcomeHaddingText pb-3">Choices</div>
          <Layout>
            <ContentComponent>
              <section
                style={{
                  minHeight: "55vh",
                  paddingTop: 20,
                  height: "100%",
                  overflow: "auto",
                }}
              >
                <div className={styles.contentComponentSection}>
                  {isLoading ? (
                    <Spin
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "60vh",
                      }}
                    />
                  ) : (
                    messageArray?.questions?.map((item, index) => (
                      <HelperComponent
                        key={index}
                        index={index}
                        messageRef={messageRef}
                        item={item}
                        setCurrentAnswerPrint={setCurrentAnswerPrint}
                        currentAnswerPrint={currentAnswerPrint}
                        setDisableFields={setDisableFields}
                        userEmail={"A"}
                        isLastIndexChat={
                          messageArray.questions?.length - 1 === index
                        }
                      />
                    ))
                  )}
                </div>
              </section>
            </ContentComponent>
            <Footer
              style={{
                background: "rgb(250, 248, 253)",
                padding: "24px 0px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Row align={"center"} style={{ width: "90%" }} gutter={16}>
                <Col
                  xs={
                    messageArray?.questions?.length === 0
                      ? 24
                      : screens.xs
                      ? 20
                      : 18
                  }
                >
                  <Form onFinish={onSend}>
                    <MyCareerGuidanceInputField
                      className={styles.messageInput}
                      ref={inputRef}
                      placeholder="Send a message"
                      onChange={onMessageChange}
                      name="question"
                      autoFocus
                      inputValue={data.question}
                      suffix={
                        disableFields ? (
                          <EllipsisOutlined />
                        ) : (
                          <SendOutlined
                            style={{
                              color: data.question.length < 1 ? "grey" : "red",
                            }}
                            onClick={() => onSend()}
                          />
                        )
                      }
                    />
                  </Form>
                </Col>
                {messageArray?.questions?.length > 0 && (
                  <Col xs={screens.xs ? 4 : 6}>
                    <MyCareerGuidanceButton
                      className={styles.responseButton}
                      showSpinner={regenerateAnswerSpinner}
                      disabled={disableFields}
                      onClick={() => {
                        regenerateAnswer(
                          messageArray.questions[
                            messageArray.questions.length - 1
                          ]
                        );
                      }}
                      label={
                        <span>
                          <SyncOutlined spin={false} />{" "}
                          {!screens.xs && "Regenerate"}
                        </span>
                      }
                    />
                  </Col>
                )}
              </Row>
            </Footer>
          </Layout>
        </div>
      </div>
    </>
  );
};

export default MyChoices;
