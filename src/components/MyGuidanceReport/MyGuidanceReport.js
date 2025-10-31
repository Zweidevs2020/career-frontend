"use client"

import { useState, useRef } from "react"
import { getApiWithAuth, postApiWithAuth } from "../../utils/api"
import { Button, Checkbox, Form, Layout, Row, Col, Grid, message, Spin, Typography } from "antd"
import ContentComponent from "../layoutComponents/contentComponent"
import { MyCareerGuidanceInputField } from "../../components/commonComponents"
import { SendOutlined } from "@ant-design/icons"
import html2pdf from "html2pdf.js"
import styles from "./myGuidanceReport.module.css"
import "./MyGuidanceReport.css"

const { Footer } = Layout
const { useBreakpoint } = Grid
const { Title, Text } = Typography

// Enhanced professional report styling
const backgroundStyle = {
  background: "#ffffff", // Clean white background like the reference images
  padding: "40px", // More generous padding
  borderRadius: "8px", // Subtle rounded corners
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Professional shadow
  maxWidth: "100%",
  wordWrap: "break-word",
  color: "#333",
  fontFamily: "'Arial', 'Helvetica', sans-serif", // Professional font stack
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "20px 0",
}

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
}

const MyChoices = () => {
  const contentRef = useRef()
  const screens = useBreakpoint()
  const inputRef = useRef()
  const [documentUrl, setDocumentUrl] = useState(null)
  const [postResponse, setPostResponse] = useState(false)
  const [gptResponse, setGptResponse] = useState("")
  const [isCodeVisible, setIsCodeVisible] = useState(true)
  const [messageArray, setMessageArray] = useState({ questions: [] })
  const [currentAnswerPrint, setCurrentAnswerPrint] = useState(true)
  const [disableFields, setDisableFields] = useState(false)
  const [regenerateAnswerSpinner, setRegenerateAnswerSpinner] = useState(false)
  const [isSpinnerOuter, setIsSpinnerOuter] = useState(false)
  const [showWelcomeText, setShowWelcomeText] = useState(true) // New state
  const [loading, setLoading] = useState(false)
  const [loadingRecentReport, setLoadingRecentReport] = useState(false)
  const [checkboxes, setCheckboxes] = useState({
    predictedPointsYes: false,
    predictedPointsNo: false,
    statedGoalsYes: false,
    statedGoalsNo: false,
    // From My CV (keeping previous field names)
    skills: false,
    interest: false, // Changed from 'interests' to 'interest' to match previous payload
    qualities: false, // Added to match previous payload (was 'interests' in UI)
    // From My Self Assessment (keeping previous field names)
    values_assessment: false,
    interest_assessment: false,
    mis: false, // Changed from 'intelligenceScore' to 'mis' to match previous payload
    // Education options (keeping previous structure)
    level5: false,
    level6_7: false,
    level8: false,
    apprenticeship: false,
    otherOptions: false, // New option
    // Where Do I Want To Go (new section)
    leinster: false,
    munster: false,
    connacht: false,
    ulster: false,
    greaterDublin: false,
  })
  const [data, setData] = useState({
    question: "",
    questionId: "",
  })
  // State to manage hover effect
  const [isHovered, setIsHovered] = useState(false)

  // Button hover style
  const buttonHoverStyle = {
    background: isHovered ? "linear-gradient(135deg, #C0C0C0, #3788d8)" : "linear-gradient(135deg, #ffffff, #3788d8)", // Reverse gradient on hover
    color: isHovered ? "#fff" : "#333", // Change text color on hover (light text on dark background)
    transform: isHovered ? "scale(1.05)" : "scale(1)", // Slight scale effect on hover
  }

  // Handle mouse enter (hover)
  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const onMessageChange = (e) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const onSend = async (event) => {
    if (data?.question?.length < 1 || disableFields) return

    setIsSpinnerOuter(true)
    setDisableFields(true)
    setShowWelcomeText(false) // Hide welcome text when sending a message

    try {
      const response = await postApiWithAuth(`/ai-report/generate-guidance-report/`, {
        ...checkboxes,
        previous_response: gptResponse,
        feedback: data.question,
      })

      if (response?.data?.data?.success) {
        const receivedResponse = response?.data?.data?.message
        setGptResponse(receivedResponse)
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
        }))
        setPostResponse(receivedResponse)
        message.success("Data submitted successfully,please click download report")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSpinnerOuter(false)
      setData({ question: "" })
      setDisableFields(false)
    }
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target

    // Handle logic for "Predicted Points and Subject" and "My Stated Goals"
    if (name === "predictedPointsYes" || name === "predictedPointsNo") {
      setCheckboxes({
        ...checkboxes,
        predictedPointsYes: name === "predictedPointsYes" ? checked : false,
        predictedPointsNo: name === "predictedPointsNo" ? checked : false,
      })
    } else if (name === "statedGoalsYes" || name === "statedGoalsNo") {
      setCheckboxes({
        ...checkboxes,
        statedGoalsYes: name === "statedGoalsYes" ? checked : false,
        statedGoalsNo: name === "statedGoalsNo" ? checked : false,
      })
    } else {
      // For other checkboxes, allow multiple selections
      setCheckboxes({
        ...checkboxes,
        [name]: checked,
      })
    }
  }

  const formatAllTags = (htmlContent) => {
    // Create a temporary div to hold the raw HTML content
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = htmlContent

    // Enhanced professional styling to match the reference images
    const styles = {
       title: {
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "20px",
        marginTop: "30px",
        color: "#2c3e50",
        borderBottom: "2px solid #3498db",
        paddingBottom: "10px",
      },
      h1: {
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "20px",
        marginTop: "30px",
        color: "#2c3e50",
        borderBottom: "2px solid #3498db",
        paddingBottom: "10px",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      },
      h2: {
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "8px",
        marginTop: "40px",
        color: "black",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      },
      h3: {
        
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "8px",
        marginTop: "8px",
        color: "black",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      },
      h4: {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "10px",
        marginTop: "15px",
        color: "#34495e",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      },
      h5: {
        fontSize: "16px",
        fontWeight: "bold",
        marginBottom: "8px",
        marginTop: "12px",
        color: "#34495e",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      },
      p: {
        fontSize: "16px",
        lineHeight: "1.7",
        marginBottom: "12px",
        color: "#2c3e50",
        textAlign: "justify",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      },
      ul: {
        fontSize: "16px",
        lineHeight: "1.7",
        marginBottom: "20px",
        paddingLeft: "25px",
        color: "#2c3e50",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      },
      ol: {
        fontSize: "16px",
        lineHeight: "1.7",
        marginBottom: "20px",
        paddingLeft: "25px",
        color: "#2c3e50",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      },
      li: {
        fontSize: "16px",
        lineHeight: "1.7",
        marginBottom: "8px",
        color: "#2c3e50",
        listStyleType: "disc",
        listStylePosition: "outside",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      },
      blockquote: {
        fontSize: "16px",
        fontStyle: "italic",
        marginBottom: "20px",
        paddingLeft: "20px",
        borderLeft: "4px solid #3498db",
        backgroundColor: "#f8f9fa",
        padding: "15px 20px",
        color: "#34495e",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      },
      a: {
        color: "#3498db",
        textDecoration: "underline",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      },
      strong: {
        fontWeight: "bold",
        color: "#2c3e50",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      },
      em: {
        fontStyle: "italic",
        color: "#34495e",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      },
      hr: {
        borderTop: "2px solid #bdc3c7",
        margin: "30px 0",
        border: "none",
        height: "2px",
        backgroundColor: "#bdc3c7",
      },
      table: {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      },
      th: {
        backgroundColor: "#3498db",
        color: "white",
        padding: "12px",
        textAlign: "left",
        fontWeight: "bold",
        borderBottom: "2px solid #2980b9",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      },
      td: {
        padding: "10px 12px",
        borderBottom: "1px solid #bdc3c7",
        color: "#2c3e50",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      },
    }

    // Apply styles to all tags
    Object.keys(styles).forEach((tag) => {
      const elements = tempDiv.querySelectorAll(tag)
      elements.forEach((element) => {
        const tagStyles = styles[tag]
        for (const [key, value] of Object.entries(tagStyles)) {
          element.style[key] = value
        }
      })
    })

    // Add professional document styling to the container
    tempDiv.style.maxWidth = "100%"
    tempDiv.style.margin = "0 auto"
    tempDiv.style.backgroundColor = "#ffffff"
    tempDiv.style.padding = "0"
    tempDiv.style.fontFamily = "'Arial', 'Helvetica', sans-serif"

    return tempDiv.innerHTML
  }

  const handleDownloadPdf = (gptResponse) => {
    console.log(gptResponse, "pdf")
    // Format the HTML content before rendering it in the PDF
    const formattedContent = formatAllTags(gptResponse)

    // Create a container for the HTML content to render
    const element = document.createElement("div")
    element.style.breakInside = "auto"
    element.style.breakAfter = "auto"
    element.style.breakBefore = "auto"
    element.innerHTML = formattedContent

    const options = {
      filename: "career_guidance_report.pdf",
      margin: [0.75, 0.75, 0.75, 0.75], // Professional margins
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
      },
      pagebreak: { mode: "avoid-all", before: "#page2el" },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
        compress: true,
      },
    }

    // Generate PDF from the HTML content using html2pdf.js
    html2pdf().set(options).from(element).save()
  }

  const handleReset = () => {
    setGptResponse("")
    setCheckboxes({
      predictedPointsYes: false,
      predictedPointsNo: false,
      statedGoalsYes: false,
      statedGoalsNo: false,
      skills: false,
      interest: false,
      qualities: false,
      values_assessment: false,
      interest_assessment: false,
      mis: false,
      level5: false,
      level6_7: false,
      level8: false,
      apprenticeship: false,
      otherOptions: false,
      leinster: false,
      munster: false,
      connacht: false,
      ulster: false,
      greaterDublin: false,
    })
    setIsCodeVisible(true)
  }

  const DownloadReort = () => {
    if (Boolean(gptResponse)) {
      handleDownloadPdf(gptResponse)
      setLoading(false)
      setIsSpinnerOuter(false)
      return
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    const payload = {
      predicted_points_and_subjects: checkboxes.predictedPointsYes ? "Yes" : "No",
      my_stated_goals: checkboxes.statedGoalsYes ? "Yes" : "No",
      skills: checkboxes.skills ? "Yes" : "No",
      interest: checkboxes.interest ? "Yes" : "No",
      qualities: checkboxes.qualities ? "Yes" : "No",
      mis: checkboxes.mis ? "Yes" : "No",
      values_assessment: checkboxes.values_assessment ? "Yes" : "No",
      interest_assessment: checkboxes.interest_assessment ? "Yes" : "No",
      education_options: [
        checkboxes.level5 ? "level 5(plc)" : null,
        checkboxes.level6_7 ? "level 6/7" : null,
        checkboxes.level8 ? "level 8" : null,
        checkboxes.apprenticeship ? "apprentices" : null,
        checkboxes.otherOptions ? "other options" : null,
      ].filter(Boolean),
      locations: [
        checkboxes.leinster ? "Leinster" : null,
        checkboxes.munster ? "Munster" : null,
        checkboxes.connacht ? "Connacht" : null,
        checkboxes.ulster ? "Ulster" : null,
        checkboxes.greaterDublin ? "Greater Dublin" : null,
      ].filter(Boolean),
    }

    try {
      const response = await postApiWithAuth(`ai-report/generate-guidance-report/`, payload)
      if (response?.data?.data?.success) {
        message.success("Data submitted successfully!")
        setIsCodeVisible(false)
        const responseGptData = response?.data?.data?.message
        setGptResponse(responseGptData)
      } else {
        throw new Error("Failed to submit data")
      }
    } catch (error) {
      message.error("Error submitting data")
      console.error("API call failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleShowRecentReport = async () => {
    setLoadingRecentReport(true)

    try {
      const response = await getApiWithAuth(`ai-report/get-generated-guidance-report/`)
      if (response?.data?.data?.success && response?.data?.data?.message) {
        message.success("Recent report loaded successfully!")
        setIsCodeVisible(false)
        setGptResponse(response?.data?.data?.message)
      } else {
        message.info("No recent report found. Please generate a new report.")
      }
    } catch (error) {
      message.error("Error loading recent report")
      console.error("API call failed:", error)
    } finally {
      setLoadingRecentReport(false)
    }
  }

  const additionalContent = ""
  const updatedResponse = additionalContent + gptResponse + additionalContent

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
                  background: "#E0E0E0",
                }}
              >
                <Form layout="vertical">
                  <Row className="justify-between">
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <Title level={4}>Please Choose Options Below:</Title>
                      <Text>Choose options to generate the report.</Text>
                    </Col>
                    {isCodeVisible ? (
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} className="text-right">
                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                          <Button
                            className="saveData"
                            onClick={handleShowRecentReport}
                            loading={loadingRecentReport}
                            style={{ marginBottom: "8px" }}
                          >
                            Recent Report
                          </Button>
                          <Button
                            className="saveData"
                            onClick={handleSubmit}
                            loading={loading}
                            type="primary"
                            style={{ marginBottom: "8px" }}
                          >
                            Generate Report
                          </Button>
                        </div>
                      </Col>
                    ) : (
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} className="text-right">
                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                          <Button
                            className="saveData"
                            onClick={handleShowRecentReport}
                            loading={loadingRecentReport}
                            style={{ marginBottom: "8px" }}
                          >
                            Recent Report
                          </Button>
                          <Button
                            className="saveData"
                            onClick={handleReset}
                            loading={loading}
                            style={{ marginBottom: "8px" }}
                          >
                            Reset Report
                          </Button>
                        </div>
                      </Col>
                    )}
                  </Row>

                  <Row gutter={[16, 16]} style={{ marginTop: "1rem" }}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <Title level={5}>Predicted Points and Subjects</Title>
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
                      <Checkbox name="statedGoalsNo" checked={checkboxes.statedGoalsNo} onChange={handleCheckboxChange}>
                        No
                      </Checkbox>
                    </Col>
                  </Row>

                  <Title level={5} style={{ marginTop: "1rem" }}>
                    From My CV
                  </Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                      <Checkbox name="skills" checked={checkboxes.skills} onChange={handleCheckboxChange}>
                        Skills
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                      <Checkbox name="interest" checked={checkboxes.interest} onChange={handleCheckboxChange}>
                        Interests
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                      <Checkbox name="qualities" checked={checkboxes.qualities} onChange={handleCheckboxChange}>
                        Qualities
                      </Checkbox>
                    </Col>
                  </Row>

                  <Title level={5} style={{ marginTop: "1rem" }}>
                    From My Self Assessment
                  </Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                      <Checkbox
                        name="values_assessment"
                        checked={checkboxes.values_assessment}
                        onChange={handleCheckboxChange}
                      >
                        Values Assessment
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                      <Checkbox
                        name="interest_assessment"
                        checked={checkboxes.interest_assessment}
                        onChange={handleCheckboxChange}
                      >
                        Occupation Interest Assessment
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                      <Checkbox name="mis" checked={checkboxes.mis} onChange={handleCheckboxChange}>
                        Multiple Intelligence
                      </Checkbox>
                    </Col>
                  </Row>

                  <Title level={5} style={{ marginTop: "1rem" }}>
                    What Type of Courses Do You Require
                  </Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                      <Checkbox name="level8" checked={checkboxes.level8} onChange={handleCheckboxChange}>
                        Level 8 Hons Degrees
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                      <Checkbox name="level6_7" checked={checkboxes.level6_7} onChange={handleCheckboxChange}>
                        Level 6/7 Ord Degrees of Higher Cert
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                      <Checkbox name="level5" checked={checkboxes.level5} onChange={handleCheckboxChange}>
                        Level 5 PLC/ Further Ed
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                      <Checkbox
                        name="apprenticeship"
                        checked={checkboxes.apprenticeship}
                        onChange={handleCheckboxChange}
                      >
                        Level 5/6/7 or 8 Apprenticeships
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                      <Checkbox name="otherOptions" checked={checkboxes.otherOptions} onChange={handleCheckboxChange}>
                        Other Options
                      </Checkbox>
                    </Col>
                  </Row>

                  <Title level={5} style={{ marginTop: "1rem" }}>
                    Where Do I Want To Go?
                  </Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                      <Checkbox name="leinster" checked={checkboxes.leinster} onChange={handleCheckboxChange}>
                        Leinster
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                      <Checkbox name="munster" checked={checkboxes.munster} onChange={handleCheckboxChange}>
                        Munster
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                      <Checkbox name="connacht" checked={checkboxes.connacht} onChange={handleCheckboxChange}>
                        Connacht
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                      <Checkbox name="ulster" checked={checkboxes.ulster} onChange={handleCheckboxChange}>
                        Ulster
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                      <Checkbox name="greaterDublin" checked={checkboxes.greaterDublin} onChange={handleCheckboxChange}>
                        Greater Dublin
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
                      dangerouslySetInnerHTML={{ __html: updatedResponse }}
                    ></div>
                  </Col>
                  <Col>
                    <Button
                      className="saveData"
                      onClick={DownloadReort}
                      style={{ ...buttonStyle, ...buttonHoverStyle }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      Download
                    </Button>
                  </Col>
                </Row>

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
                  </Row>
                </Footer>
              </>
            )}
          </Layout>
        </div>
      </div>
    </>
  )
}

export default MyChoices
