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
  Typography,
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
import html2pdf from "html2pdf.js";
import styles from "./myGuidanceReport.module.css";
import "./MyGuidanceReport.css";

const { Footer } = Layout;
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;
const MyChoices = () => {
  const messageRef = useRef(null);
  const screens = useBreakpoint();
  const inputRef = useRef();
  const [postResponse, setPostResponse] = useState(false);
  const [gptResponse, setGptResponse] = useState("");
  const [isCodeVisible, setIsCodeVisible] = useState(true);
  const [messageArray, setMessageArray] = useState({ questions: [] });
  const [currentAnswerPrint, setCurrentAnswerPrint] = useState(true);
  const [disableFields, setDisableFields] = useState(false);
  const [regenerateAnswerSpinner, setRegenerateAnswerSpinner] = useState(false);
  const [isSpinnerOuter, setIsSpinnerOuter] = useState(false);
  const [showWelcomeText, setShowWelcomeText] = useState(true); // New state
  const [loading, setLoading] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    predictedPointsYes: false,
    predictedPointsNo: false,
    subjectYes: false,
    subjectNo: false,
    myStatedGoalsYes: false,
    myStatedGoalsNo: false,
    otherOption1: false,
    otherOption2: false,
    otherOption3: false,
  });
  const [data, setData] = useState({
    question: "",
    questionId: "",
  });

  const onMessageChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // Fetch initial chatbot welcome message
  // const getChat = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await getApiWithAuth(
  //       `ai-report/generate-guidance-report/`
  //     );
  //     if (response?.data?.data?.success) {
  //       const welcomeMessage = {
  //         question: response?.data?.data?.message,
  //         questionId: 0,
  //         answers: response?.data?.data?.answers || [],
  //         lastAnswer: true,
  //       };
  //       setWelcome(response?.data?.data?.message);
  //       if (welcomeMessage.answers.length > 0) {
  //         setMessageArray({ questions: [welcomeMessage] });
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching chatbot welcome message:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    // getChat(); // Fetch the initial chatbot welcome message when the component mounts
  }, []);

  const regenerateAnswer = async (questionRegenerate) => {
    setRegenerateAnswerSpinner(true);
    try {
      const response = await postApiWithAuth(
        `ai-report/generate-guidance-report/`,
        {
          message: questionRegenerate.question,
          regenerate: true,
        }
      );

      if (response?.data?.data?.success) {
        const regeneratedResponse = response?.data?.data?.response;
        setMessageArray((prevState) => ({
          questions: prevState.questions.map((question) =>
            question.questionId === questionRegenerate.questionId
              ? {
                  ...question,
                  answers: [
                    ...question.answers,
                    { text: `\n${regeneratedResponse}` },
                  ],
                }
              : question
          ),
        }));
      }
    } catch (error) {
      console.error("Error regenerating answer:", error);
    } finally {
      setRegenerateAnswerSpinner(false);
    }
  };

  // Send the user's message to the chatbot and handle response
  const onSend = async (event) => {
    if (data?.question?.length < 1 || disableFields) return;

    setIsSpinnerOuter(true);
    setDisableFields(true);
    setShowWelcomeText(false); // Hide welcome text when sending a message

    try {
      const response = await postApiWithAuth(
        `/ai-report/generate-guidance-report/`,
        {
          ...checkboxes,
          previous_response: gptResponse,
          feedback: data.question,
        }
      );

      if (response?.data?.data?.success) {
        const receivedResponse = response?.data?.data?.gpt_response;
        setGptResponse(receivedResponse);
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
        setPostResponse(receivedResponse);
        message.success(
          "Data submitted successfully,please click download report"
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSpinnerOuter(false);
      setData({ question: "" });
      setDisableFields(false);
    }
  };

  // Function to check if the message contains '\n' or '*' and apply bold styling
  const isBoldMessage = (messageText) => {
    return messageText?.includes("\n") || messageText?.includes("*");
  };
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    // Handle logic for "Predicted Points and Subject" and "My Stated Goals"
    if (name === "predictedPointsYes" || name === "predictedPointsNo") {
      setCheckboxes({
        ...checkboxes,
        predictedPointsYes: name === "predictedPointsYes" ? checked : false,
        predictedPointsNo: name === "predictedPointsNo" ? checked : false,
      });
    } else if (name === "statedGoalsYes" || name === "statedGoalsNo") {
      setCheckboxes({
        ...checkboxes,
        statedGoalsYes: name === "statedGoalsYes" ? checked : false,
        statedGoalsNo: name === "statedGoalsNo" ? checked : false,
      });
    } else {
      // For other checkboxes, allow multiple selections
      setCheckboxes({
        ...checkboxes,
        [name]: checked,
      });
    }
  };

  const formatAllTags = (htmlContent) => {
    // Create a temporary div to hold the raw HTML content
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent; // Assuming htmlContent is the raw HTML from GPT

    // Define styles for different tags
    const styles = {
      h1: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
      },
      h2: {
        fontSize: "22px",
        fontWeight: "bold",
        marginBottom: "18px",
      },
      h3: {
        fontSize: "20px",
        fontWeight: "bold",
        marginBottom: "15px",
      },
      p: {
        fontSize: "16px",
        lineHeight: "1.6",
        marginBottom: "15px",
      },
      ul: {
        fontSize: "16px",
        lineHeight: "1.6",
        marginBottom: "15px",
        paddingLeft: "20px", // Add padding to indent the list
      },
      ol: {
        fontSize: "16px",
        lineHeight: "1.6",
        marginBottom: "15px",
        paddingLeft: "20px", // Add padding to indent the ordered list
      },

      li: {
        fontSize: "16px",
        lineHeight: "1.6",
        marginBottom: "10px",
        paddingLeft: "20px",
        listStyleType: "disc", // Ensure bullets appear
        listStylePosition: "outside",
      },
      blockquote: {
        fontSize: "16px",
        fontStyle: "italic",
        marginBottom: "20px",
        paddingLeft: "20px",
        borderLeft: "3px solid #ccc",
      },
      a: {
        color: "#007bff", // Links with a blue color
        textDecoration: "underline",
      },
      strong: {
        fontWeight: "bold", // Make strong tags bold
      },
      em: {
        fontStyle: "italic", // Italicize <em> tags
      },
      hr: {
        borderTop: "1px solid #ddd",
        margin: "20px 0",
      },
    };

    // // Apply styles to all tags based on the defined styles
    // Object.keys(styles).forEach((tag) => {
    //   const elements = tempDiv.querySelectorAll(tag);
    //   elements.forEach((element) => {
    //     const tagStyles = styles[tag];
    //     for (const [key, value] of Object.entries(tagStyles)) {
    //       element.style[key] = value;
    //     }
    //   });
    // });

    // Apply styles to all tags based on the defined styles
    Object.keys(styles).forEach((tag) => {
      const elements = tempDiv.querySelectorAll(tag);
      elements.forEach((element, index) => {
        const tagStyles = styles[tag];
        for (const [key, value] of Object.entries(tagStyles)) {
          element.style[key] = value;
        }
      });
    });

    // Return the formatted HTML with applied styles
    return tempDiv.innerHTML;
  };
  const handleDownloadPdf = (gptResponse) => {
    console.log(gptResponse, "pdf");
    // Format the HTML content before rendering it in the PDF
    const formattedContent = formatAllTags(gptResponse);

    // Create a container for the HTML content to render
    const element = document.createElement("div");
    // break-inside: auto; break-after: auto; break-before: auto;
    element.style.breakInside = "auto";
    element.style.breakAfter = "auto";
    element.style.breakBefore = "auto";
    element.innerHTML = formattedContent;

    const options = {
      filename: "formatted_report.pdf",
      margin: 1,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2 },
      pagebreak: { mode: "avoid-all", before: "#page2el" },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    // Generate PDF from the HTML content using html2pdf.js
    html2pdf()
      .set(options)
      .from(element) // Pass the element with the formatted HTML
      .save(); // Save the PDF
  };
  const handleReset = () => {
    setGptResponse("");
    setCheckboxes({
      predictedPointsYes: false,
      predictedPointsNo: false,
      subjectYes: false,
      subjectNo: false,
      myStatedGoalsYes: false,
      myStatedGoalsNo: false,
      otherOption1: false,
      otherOption2: false,
      otherOption3: false,
    });
    setIsCodeVisible(true);
  };
  const handleSubmit = async () => {
    setLoading(true);

    if (Boolean(gptResponse)) {
      handleDownloadPdf(gptResponse);
      setLoading(false);
      setIsSpinnerOuter(false);
      return;
    }

    const payload = {
      predicted_points_and_subjects: checkboxes.predictedPointsYes
        ? "Yes"
        : "No",
      my_stated_goals: checkboxes.statedGoalsYes ? "Yes" : "No",
      address: checkboxes.address ? "Yes" : "No",
      personal_statement: checkboxes.personalStatement ? "Yes" : "No",
      work_experience: checkboxes.workExperience ? "Yes" : "No",
      skills: checkboxes.skills ? "Yes" : "No",
      qualities: checkboxes.interests ? "Yes" : "No", // Assuming 'qualities' corresponds to 'interests'
      interest: checkboxes.interests ? "Yes" : "No", // Same here, assuming 'interest' corresponds to 'interests'
      mis: checkboxes.intelligenceScore ? "Yes" : "No", // Assuming 'mis' corresponds to 'intelligenceScore'
      values_assessment: checkboxes.valuesAssessment ? "Yes" : "No",
      interest_assessment: checkboxes.interestAssessment ? "Yes" : "No",
      education_options: [
        checkboxes.level5 ? "level 5(plc)" : null,
        checkboxes.level6_7 ? "level 6/7" : null,
        checkboxes.level8 ? "level 8" : null,
        checkboxes.apprenticeship ? "apprentices" : null,
      ].filter(Boolean), // This filters out any null values
    };

    try {
      const response = await postApiWithAuth(
        `ai-report/generate-guidance-report/`,
        payload
      );

      if (response?.data?.data?.success) {
        message.success("Data submitted successfully!");
        setIsCodeVisible(false);

        const responseGptData = response?.data?.data?.gpt_response;
        setGptResponse(responseGptData); // Update the state
        handleDownloadPdf(responseGptData); // Pass the direct response data
      } else {
        throw new Error("Failed to submit data");
      }
    } catch (error) {
      message.error("Error submitting data");
      console.error("API call failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.educationalGuidanceMainDiv}>
        <div className={styles.educationalGuidanceSecondDiv}>
          <div className="welcomeHaddingText ">Guidance Report</div>
          <Layout>
            <ContentComponent>
              <section
                style={{
                  minHeight: "55vh",
                  paddingTop: 20,
                  height: "100%",
                  // overflow: "auto",
                }}
              >
                <Form layout="vertical">
                  <Row className="justify-between">
                    <Col>
                      <Title level={4}>Please Choose Options Below:</Title>
                      <Text>Choose options to generate the report.</Text>
                    </Col>
                    {isCodeVisible ? (
                      <Col>
                        <Button
                          className="saveData"
                          onClick={handleSubmit}
                          loading={loading}
                        >
                          Generate Report
                        </Button>
                      </Col>
                    ) : (
                      <Col>
                        <Button
                          className="saveData"
                          onClick={handleReset}
                          loading={loading}
                        >
                          Reset Report
                        </Button>
                      </Col>
                    )}
                  </Row>

                  <Row gutter={[16, 16]} style={{ marginTop: "1rem" }}>
                    <Col span={12}>
                      <Title level={5}>Predicted Points and Subject</Title>
                      <Checkbox
                        name="predictedPointsYes"
                        checked={checkboxes.predictedPointsYes}
                        onChange={handleCheckboxChange}
                      >
                        Yes
                      </Checkbox>
                      <Checkbox
                        name="predictedPointsNo"
                        checked={checkboxes.predictedPointsNo}
                        onChange={handleCheckboxChange}
                      >
                        No
                      </Checkbox>
                    </Col>
                    <Col span={12}>
                      <Title level={5}>My Stated Goals</Title>
                      <Checkbox
                        name="statedGoalsYes"
                        checked={checkboxes.statedGoalsYes}
                        onChange={handleCheckboxChange}
                      >
                        Yes
                      </Checkbox>
                      <Checkbox
                        name="statedGoalsNo"
                        checked={checkboxes.statedGoalsNo}
                        onChange={handleCheckboxChange}
                      >
                        No
                      </Checkbox>
                    </Col>
                  </Row>

                  <Title level={5} style={{ marginTop: "1rem" }}>
                    From My CV
                  </Title>
                  <Row gutter={[16, 16]}>
                    <Col span={4}>
                      <Checkbox
                        name="address"
                        checked={checkboxes.address}
                        onChange={handleCheckboxChange}
                      >
                        Address
                      </Checkbox>
                    </Col>
                    <Col span={4}>
                      <Checkbox
                        name="personalStatement"
                        checked={checkboxes.personalStatement}
                        onChange={handleCheckboxChange}
                      >
                        Personal Statement
                      </Checkbox>
                    </Col>
                    <Col span={4}>
                      <Checkbox
                        name="workExperience"
                        checked={checkboxes.workExperience}
                        onChange={handleCheckboxChange}
                      >
                        Work Experience
                      </Checkbox>
                    </Col>
                    <Col span={4}>
                      <Checkbox
                        name="skills"
                        checked={checkboxes.skills}
                        onChange={handleCheckboxChange}
                      >
                        Skills
                      </Checkbox>
                    </Col>
                    <Col span={4}>
                      <Checkbox
                        name="interests"
                        checked={checkboxes.interests}
                        onChange={handleCheckboxChange}
                      >
                        Interests
                      </Checkbox>
                    </Col>
                    <Col span={4}>
                      <Checkbox
                        name="intelligenceScore"
                        checked={checkboxes.intelligenceScore}
                        onChange={handleCheckboxChange}
                      >
                        Multiple Intelligence Score
                      </Checkbox>
                    </Col>
                    <Col span={4}>
                      <Checkbox
                        name="valuesAssessment"
                        checked={checkboxes.valuesAssessment}
                        onChange={handleCheckboxChange}
                      >
                        Values Assessment
                      </Checkbox>
                    </Col>
                    <Col span={4}>
                      <Checkbox
                        name="interestAssessment"
                        checked={checkboxes.interestAssessment}
                        onChange={handleCheckboxChange}
                      >
                        Interest Assessment
                      </Checkbox>
                    </Col>
                  </Row>

                  <Title level={5} style={{ marginTop: "1rem" }}>
                    Choose One or More Education Options
                  </Title>
                  <Row gutter={[16, 16]}>
                    <Col span={4}>
                      <Checkbox
                        name="level5"
                        checked={checkboxes.level5}
                        onChange={handleCheckboxChange}
                      >
                        Level 5 (PLC)
                      </Checkbox>
                    </Col>
                    <Col span={4}>
                      <Checkbox
                        name="level6_7"
                        checked={checkboxes.level6_7}
                        onChange={handleCheckboxChange}
                      >
                        Level 6/7
                      </Checkbox>
                    </Col>
                    <Col span={4}>
                      <Checkbox
                        name="level8"
                        checked={checkboxes.level8}
                        onChange={handleCheckboxChange}
                      >
                        Level 8
                      </Checkbox>
                    </Col>
                    <Col span={4}>
                      <Checkbox
                        name="apprenticeship"
                        checked={checkboxes.apprenticeship}
                        onChange={handleCheckboxChange}
                      >
                        Apprenticeship
                      </Checkbox>
                    </Col>
                  </Row>
                </Form>
              </section>
            </ContentComponent>
            {isCodeVisible ? (
              ""
            ) : (
              <Footer
                style={{
                  background: "rgb(250, 248, 253)",
                  padding: "24px 0px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Row className="align-middle justify-around">
                  <Col className="w-[65rem] mr-3">
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
                            <Spin className="spinStyle" />
                          ) : (
                            <SendOutlined
                              style={{
                                color: "grey",
                              }}
                              onClick={() => onSend()}
                            />
                          )
                        }
                      />
                    </Form>
                  </Col>
                  <Col>
                    {!isCodeVisible ? (
                      <Col>
                        <Button
                          className="saveData"
                          onClick={handleSubmit}
                          loading={loading}
                        >
                          Download Report
                        </Button>
                      </Col>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
                {/* <Row align={"center"} style={{ width: "50%" }} gutter={16}>
                  <Col
                    span={12}
                    xs={
                      messageArray?.questions?.length === 0
                        ? 24
                        : screens.xs
                        ? 20
                        : 18
                    }
                  >
                    <p>Feedback:</p>
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
                            <Spin className="spinStyle" />
                          ) : (
                            <SendOutlined
                              style={{
                                color: "grey",
                              }}
                              onClick={() => onSend()}
                            />
                          )
                        }
                      />
                    </Form>
                  </Col>
                  {!isCodeVisible ? (
                    <Col>
                      <Button
                        className="saveData"
                        onClick={handleSubmit}
                        loading={loading}
                      >
                        Update Report
                      </Button>
                    </Col>
                  ) : (
                    ""
                  )}
                </Row> */}
              </Footer>
            )}
          </Layout>
          {/* {isCodeVisible ? (
            <Layout>
              <ContentComponent>
                <section
                  style={{
                    minHeight: "55vh",
                    paddingTop: 20,
                    height: "100%",
                    // overflow: "auto",
                  }}
                >
                  <Form layout="vertical">
                    <Row className="justify-between">
                      <Col>
                        <Title level={4}>Please Choose Options Below:</Title>
                        <Text>Choose options to generate the report.</Text>
                      </Col>
                      <Col>
                        <Button
                          className="saveData"
                          onClick={handleSubmit}
                          loading={loading}
                        >
                          Generate Report
                        </Button>
                      </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{ marginTop: "1rem" }}>
                      <Col span={12}>
                        <Title level={5}>Predicted Points and Subject</Title>
                        <Checkbox
                          name="predictedPointsYes"
                          checked={checkboxes.predictedPointsYes}
                          onChange={handleCheckboxChange}
                        >
                          Yes
                        </Checkbox>
                        <Checkbox
                          name="predictedPointsNo"
                          checked={checkboxes.predictedPointsNo}
                          onChange={handleCheckboxChange}
                        >
                          No
                        </Checkbox>
                      </Col>
                      <Col span={12}>
                        <Title level={5}>My Stated Goals</Title>
                        <Checkbox
                          name="statedGoalsYes"
                          checked={checkboxes.statedGoalsYes}
                          onChange={handleCheckboxChange}
                        >
                          Yes
                        </Checkbox>
                        <Checkbox
                          name="statedGoalsNo"
                          checked={checkboxes.statedGoalsNo}
                          onChange={handleCheckboxChange}
                        >
                          No
                        </Checkbox>
                      </Col>
                    </Row>

                    <Title level={5} style={{ marginTop: "1rem" }}>
                      From My CV
                    </Title>
                    <Row gutter={[16, 16]}>
                      <Col span={4}>
                        <Checkbox
                          name="address"
                          checked={checkboxes.address}
                          onChange={handleCheckboxChange}
                        >
                          Address
                        </Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox
                          name="personalStatement"
                          checked={checkboxes.personalStatement}
                          onChange={handleCheckboxChange}
                        >
                          Personal Statement
                        </Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox
                          name="workExperience"
                          checked={checkboxes.workExperience}
                          onChange={handleCheckboxChange}
                        >
                          Work Experience
                        </Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox
                          name="skills"
                          checked={checkboxes.skills}
                          onChange={handleCheckboxChange}
                        >
                          Skills
                        </Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox
                          name="interests"
                          checked={checkboxes.interests}
                          onChange={handleCheckboxChange}
                        >
                          Interests
                        </Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox
                          name="intelligenceScore"
                          checked={checkboxes.intelligenceScore}
                          onChange={handleCheckboxChange}
                        >
                          Multiple Intelligence Score
                        </Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox
                          name="valuesAssessment"
                          checked={checkboxes.valuesAssessment}
                          onChange={handleCheckboxChange}
                        >
                          Values Assessment
                        </Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox
                          name="interestAssessment"
                          checked={checkboxes.interestAssessment}
                          onChange={handleCheckboxChange}
                        >
                          Interest Assessment
                        </Checkbox>
                      </Col>
                    </Row>

                    <Title level={5} style={{ marginTop: "1rem" }}>
                      Choose One or More Education Options
                    </Title>
                    <Row gutter={[16, 16]}>
                      <Col span={4}>
                        <Checkbox
                          name="level5"
                          checked={checkboxes.level5}
                          onChange={handleCheckboxChange}
                        >
                          Level 5 (PLC)
                        </Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox
                          name="level6_7"
                          checked={checkboxes.level6_7}
                          onChange={handleCheckboxChange}
                        >
                          Level 6/7
                        </Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox
                          name="level8"
                          checked={checkboxes.level8}
                          onChange={handleCheckboxChange}
                        >
                          Level 8
                        </Checkbox>
                      </Col>
                      <Col span={4}>
                        <Checkbox
                          name="apprenticeship"
                          checked={checkboxes.apprenticeship}
                          onChange={handleCheckboxChange}
                        >
                          Apprenticeship
                        </Checkbox>
                      </Col>
                    </Row>
                  </Form>
                </section>
              </ContentComponent>
              {!gptResponse ? (
                ""
              ) : (
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
                      <p>Feedback:</p>
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
                              <Spin className="spinStyle" />
                            ) : (
                              <SendOutlined
                                style={{
                                  color: "grey",
                                }}
                                onClick={() => onSend()}
                              />
                            )
                          }
                        />
                      </Form>
                    </Col>
                  </Row>
                </Footer>
              )}
            </Layout>
          ) : (
            <Layout>
              <ContentComponent>
                <section
                  style={{
                    minHeight: "30vh",
                    paddingTop: 20,
                    height: "100%",
                    // overflow: "auto",
                  }}
                >
                  <Row className="justify-between">
                    <Col>
                      <Title level={4}>Update Report</Title>
                    </Col>
                    <Col>
                      <Button
                        className="saveData"
                        onClick={handleSubmit}
                        loading={loading}
                      >
                        Generate Report
                      </Button>
                    </Col>
                  </Row>
                </section>
                {/* <div className="text-center ">
                  <p
                    style={{
                      color: "#1476b7",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      marginBottom: "4rem",
                    }}
                  >
                    Please type the feedback to edit report
                  </p>
                </div> *
              </ContentComponent>
              {!gptResponse ? (
                ""
              ) : (
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
                      <p>Feedback:</p>
                      <Form onFinish={onSend}>
                        <MyCareerGuidanceInputField
                          className={styles.messageInput}
                          ref={inputRef}
                          placeholder="Send a feedback"
                          onChange={onMessageChange}
                          name="question"
                          autoFocus
                          inputValue={data.question}
                          suffix={
                            disableFields ? (
                              <Spin className="spinStyle" />
                            ) : (
                              <SendOutlined
                                style={{
                                  color: "grey",
                                }}
                                onClick={() => onSend()}
                              />
                            )
                          }
                        />
                      </Form>
                    </Col>
                  </Row>
                </Footer>
              )}
            </Layout>
          )} */}
        </div>
      </div>
    </>
  );
};

export default MyChoices;
