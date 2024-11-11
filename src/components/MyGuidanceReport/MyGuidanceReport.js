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

  const [messageArray, setMessageArray] = useState({ questions: [] });
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

  // Fetch initial chatbot welcome message
  const getChat = async () => {
    setIsLoading(true);
    try {
      const response = await getApiWithAuth(`ai-report/chatbot/`);
      if (response?.data?.data?.success) {
        const welcomeMessage = {
          question: response?.data?.data?.message,
          questionId: 0,
          answers: [],
          lastAnswer: true,
        };
        setMessageArray({ questions: [welcomeMessage] });
      }
    } catch (error) {
      console.error("Error fetching chatbot welcome message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getChat(); // Fetch the initial chatbot welcome message when the component mounts
  }, []);

  const regenerateAnswer = async (questionRegenerate) => {
    // Implement the logic for regenerating the answer
  };

  // Send the user's message to the chatbot and handle response
  const onSend = async (event) => {
    // event.preventDefault(); // Prevent form submission
    if (data?.question?.length < 1 || disableFields) return; // Ensure valid input

    setIsSpinnerOuter(true); // Show loading spinner
    setDisableFields(true); // Disable fields while processing

    try {
      const response = await postApiWithAuth(`ai-report/chatbot/`, {
        message: data.question,
      });

      if (response?.data?.data?.success) {
        const receivedResponse = response?.data?.data?.response;

        // Update messageArray with the new question and response
        setMessageArray((prevState) => ({
          questions: [
            ...prevState.questions,
            {
              question: data.question,
              questionId: prevState.questions.length + 1,
              answers: [{ text: receivedResponse }],
              lastAnswer: true,
            },
          ],
        }));

        // Set the received response for display
        setPostResponse(receivedResponse);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSpinnerOuter(false); // Hide loading spinner
      setData({ question: "" }); // Clear input field
    }
  };

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
                          messageArray?.questions?.length - 1 === index
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
                          messageArray?.questions[
                            messageArray?.questions.length - 1
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
