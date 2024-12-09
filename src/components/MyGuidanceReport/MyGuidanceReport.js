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
import { Document, Page } from "react-pdf";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ContentComponent from "../layoutComponents/contentComponent";
import { MyCareerGuidanceInputField } from "../../components/commonComponents";
import { SendOutlined } from "@ant-design/icons";
import html2pdf from "html2pdf.js";
import styles from "./myGuidanceReport.module.css";
import "./MyGuidanceReport.css";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

const { Footer } = Layout;
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const backgroundStyle = {
  background: "linear-gradient(135deg, #ffffff, rgb(212 226 239))", // White to soft silver gradient
  padding: "20px", // Padding inside the container
  borderRadius: "12px", // Rounded corners
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)", // Subtle shadow
  maxWidth: "100%", // Prevent overflow
  wordWrap: "break-word", // Wrap long words
  color: "#333", // Text color for readability
  fontFamily: "'Arial', sans-serif", // Clean font family
  fontSize: "16px", // Font size for readability
  lineHeight: "1.6", // Line height for better spacing
};
// Button background style to match the background gradient
// Button base style to match the background gradient
const buttonStyle = {
  background: "linear-gradient(135deg, #3788d8, #C0C0C0)", // Same gradient as background
  color: "#3788d8", // Text color (dark gray)
  border: "1px solid #3788d8", // Silver border to match background
  padding: "10px 20px", // Padding inside the button
  borderRadius: "8px", // Slightly rounded corners
  fontSize: "16px", // Font size
  fontWeight: "bold", // Bold text
  cursor: "pointer", // Pointer cursor on hover
  transition: "background 0.3s ease, transform 0.2s, color 0.3s", // Smooth transitions
};

const MyChoices = () => {
  const contentRef = useRef();
  const screens = useBreakpoint();
  const inputRef = useRef();
  const [documentUrl, setDocumentUrl] = useState(null);
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
  // State to manage hover effect
  const [isHovered, setIsHovered] = useState(false);

  // Button hover style
  const buttonHoverStyle = {
    background: isHovered
      ? "linear-gradient(135deg, #C0C0C0, #3788d8)"
      : "linear-gradient(135deg, #ffffff, #3788d8)", // Reverse gradient on hover
    color: isHovered ? "#fff" : "#333", // Change text color on hover (light text on dark background)
    transform: isHovered ? "scale(1.05)" : "scale(1)", // Slight scale effect on hover
  };

  // Handle mouse enter (hover)
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const onMessageChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

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
        marginBottom: "10px",
      },
      h2: {
        fontSize: "22px",
        fontWeight: "bold",
        // marginBottom: "5px",
      },
      h3: {
        fontSize: "20px",
        fontWeight: "bold",
        marginBottom: "10px",
      },
      p: {
        fontSize: "16px",
        lineHeight: "1.6",
        marginBottom: "5px",
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
        // marginBottom: "10px",
        paddingLeft: "20px",
        listStyleType: "disc", // Ensure bullets appear
        listStylePosition: "outside",
      },
      blockquote: {
        fontSize: "16px",
        fontStyle: "italic",
        // marginBottom: "20px",
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
  const DownloadReort = () => {
    if (Boolean(gptResponse)) {
      handleDownloadPdf(gptResponse);

      setLoading(false);
      setIsSpinnerOuter(false);
      return;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    // if (Boolean(gptResponse)) {
    //   handleDownloadPdf(gptResponse);

    //   setLoading(false);
    //   setIsSpinnerOuter(false);
    //   return;
    // }

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
        // handleDownloadPdf(responseGptData); // Pass the direct response data
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

  const additionalContent = "<hr/>";
  const updatedResponse = additionalContent + gptResponse + additionalContent;

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
                }}
              >
                {/* <Form layout="vertical">
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
                </Form> */}
                <Form layout="vertical">
                  <Row className="justify-between">
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <Title level={4}>Please Choose Options Below:</Title>
                      <Text>Choose options to generate the report.</Text>
                    </Col>
                    {isCodeVisible ? (
                      <Col
                        xs={24}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        className="text-right"
                      >
                        <Button
                          className="saveData"
                          onClick={handleSubmit}
                          loading={loading}
                        >
                          Generate Report
                        </Button>
                      </Col>
                    ) : (
                      <Col
                        xs={24}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        className="text-right"
                      >
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
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
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
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
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
                    <Col xs={24} sm={8} md={8} lg={4} xl={4}>
                      <Checkbox
                        name="address"
                        checked={checkboxes.address}
                        onChange={handleCheckboxChange}
                      >
                        Address
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={4} xl={4}>
                      <Checkbox
                        name="personalStatement"
                        checked={checkboxes.personalStatement}
                        onChange={handleCheckboxChange}
                      >
                        Personal Statement
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={4} xl={4}>
                      <Checkbox
                        name="workExperience"
                        checked={checkboxes.workExperience}
                        onChange={handleCheckboxChange}
                      >
                        Work Experience
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={4} xl={4}>
                      <Checkbox
                        name="skills"
                        checked={checkboxes.skills}
                        onChange={handleCheckboxChange}
                      >
                        Skills
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={4} xl={4}>
                      <Checkbox
                        name="interests"
                        checked={checkboxes.interests}
                        onChange={handleCheckboxChange}
                      >
                        Interests
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={4} xl={4}>
                      <Checkbox
                        name="intelligenceScore"
                        checked={checkboxes.intelligenceScore}
                        onChange={handleCheckboxChange}
                      >
                        Multiple Intelligence Score
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={4} xl={4}>
                      <Checkbox
                        name="valuesAssessment"
                        checked={checkboxes.valuesAssessment}
                        onChange={handleCheckboxChange}
                      >
                        Values Assessment
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={4} xl={4}>
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
                    <Col xs={24} sm={12} md={6} lg={4} xl={4}>
                      <Checkbox
                        name="level5"
                        checked={checkboxes.level5}
                        onChange={handleCheckboxChange}
                      >
                        Level 5 (PLC)
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4} xl={4}>
                      <Checkbox
                        name="level6_7"
                        checked={checkboxes.level6_7}
                        onChange={handleCheckboxChange}
                      >
                        Level 6/7
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4} xl={4}>
                      <Checkbox
                        name="level8"
                        checked={checkboxes.level8}
                        onChange={handleCheckboxChange}
                      >
                        Level 8
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4} xl={4}>
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
              <>
                <Row className="p-1 bg-none" style={backgroundStyle}>
                  <Col span={20}>
                    <div
                      ref={contentRef}
                      className={styles.gptResponse}
                      // style={backgroundStyle}
                      dangerouslySetInnerHTML={{ __html: updatedResponse }}
                    ></div>
                  </Col>
                  <Col>
                    {/* <Button
                      className="saveData"
                      onClick={DownloadReort}
                      style={{
                        marginTop: "20px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                      }}
                    >
                      Download
                    </Button> */}
                    <Button
                      className="saveData"
                      onClick={DownloadReort}
                      style={{ ...buttonStyle, ...buttonHoverStyle }} // Merge both styles (base + hover)
                      onMouseEnter={handleMouseEnter} // Handle mouse enter event
                      onMouseLeave={handleMouseLeave} // Handle mouse leave event
                    >
                      Download
                    </Button>
                  </Col>
                </Row>

                {/* Download Button */}

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
                      {!isCodeVisible
                        ? // <Col>
                          //   <Button
                          //     className="saveData"
                          //     onClick={DownloadReort}
                          //     loading={loading}
                          //   >
                          //     Download Report
                          //   </Button>
                          // </Col>
                          ""
                        : ""}
                    </Col>
                  </Row>
                </Footer>
              </>
            )}
          </Layout>
        </div>
      </div>
    </>
  );
};

export default MyChoices;
