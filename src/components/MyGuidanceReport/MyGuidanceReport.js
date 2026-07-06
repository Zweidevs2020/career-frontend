"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { getApiWithAuth, postApiWithAuth } from "../../utils/api"
import {
  Button,
  Form,
  Layout,
  Row,
  Col,
  Grid,
  message,
  Spin,
  Typography,
  Progress,
  Card,
  Space,
} from "antd"
import ContentComponent from "../layoutComponents/contentComponent"
import { MyCareerGuidanceInputField } from "../../components/commonComponents"
import { SendOutlined, ArrowLeftOutlined, ArrowRightOutlined, CheckCircleOutlined } from "@ant-design/icons"
import html2pdf from "html2pdf.js"
import styles from "./myGuidanceReport.module.css"
import "./MyGuidanceReport.css"

const { useBreakpoint } = Grid
const { Title, Text } = Typography

// Enhanced professional report styling
const backgroundStyle = {
  background: "#ffffff",
  padding: "40px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  maxWidth: "100%",
  wordWrap: "break-word",
  color: "#333",
  fontFamily: "'Arial', 'Helvetica', sans-serif",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "20px 0",
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
  const [showWelcomeText, setShowWelcomeText] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingRecentReport, setLoadingRecentReport] = useState(false)
  const [checkingInitialReport, setCheckingInitialReport] = useState(true)
  const [hasExistingReport, setHasExistingReport] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const [checkboxes, setCheckboxes] = useState({
    predictedPointsYes: false,
    predictedPointsNo: false,
    statedGoalsYes: false,
    statedGoalsNo: false,
    misYes: false,
    misNo: false,
    valuesYes: false,
    valuesNo: false,
    interestYes: false,
    interestNo: false,
    exemptIrishYes: false,
    exemptIrishNo: false,
    exemptThirdLanguageYes: false,
    exemptThirdLanguageNo: false,
    useCVYes: false,
    useCVNo: false,
    level8: false,
    level6_7: false,
    level5: false,
    apprenticeship: false,
    tertiaryDegrees: false,
    ucas: false,
    dublin: false,
    leinster: false,
    munster: false,
    connacht: false,
    ulster: false,
    // Legacy mapping support
    skills: false,
    interest: false,
    qualities: false,
    values_assessment: false,
    interest_assessment: false,
    mis: false,
  })

  const questions = [
    {
      title: "Subjects & Predicted Results",
      question: "Do you want your subjects and predicted results to be considered?",
      type: "yesno",
      names: { yes: "predictedPointsYes", no: "predictedPointsNo" },
    },
    {
      title: "Goals",
      question: "Do you want us to consider your goals?",
      type: "yesno",
      names: { yes: "statedGoalsYes", no: "statedGoalsNo" },
    },
    {
      title: "Multiple Intelligence",
      question: "Will we include your multiple intelligence score?",
      type: "yesno",
      names: { yes: "misYes", no: "misNo" },
    },
    {
      title: "Values Score",
      question: "Will we include your values score?",
      type: "yesno",
      names: { yes: "valuesYes", no: "valuesNo" },
    },
    {
      title: "Occupation Interest",
      question: "Will we include your occupation Interest score?",
      type: "yesno",
      names: { yes: "interestYes", no: "interestNo" },
    },
    {
      title: "Irish Language",
      question: "Are you exempt from Irish?",
      type: "yesno",
      names: { yes: "exemptIrishYes", no: "exemptIrishNo" },
    },
    {
      title: "3rd Language",
      question: "Are you exempt from a 3rd Language?",
      type: "yesno",
      names: { yes: "exemptThirdLanguageYes", no: "exemptThirdLanguageNo" },
    },
    {
      title: "C.V. Information",
      question: "Will we use information from your C. V. ?",
      type: "yesno",
      names: { yes: "useCVYes", no: "useCVNo" },
    },
    {
      title: "Qualification Type",
      question: "Select (one or many) the type of qualification you want suggestions from.",
      type: "multiple",
      options: [
        { label: "Level 8", name: "level8" },
        { label: "Level 6/7", name: "level6_7" },
        { label: "Level 5 PLC", name: "level5" },
        { label: "Apprenticeships", name: "apprenticeship" },
        { label: "Tertiary Degrees", name: "tertiaryDegrees" },
        { label: "UCAS in Northern Ireland", name: "ucas" },
      ],
    },
    {
      title: "Study Location",
      question: "Select (one or many) where would you like to study or train?",
      type: "multiple",
      options: [
        { label: "Dublin", name: "dublin" },
        { label: "Leinster", name: "leinster" },
        { label: "Munster", name: "munster" },
        { label: "Connacht", name: "connacht" },
        { label: "Ulster", name: "ulster" },
      ],
    },
  ]

  const [data, setData] = useState({
    question: "",
    questionId: "",
  })
  const onMessageChange = (e) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const onSend = async (event) => {
    if (data?.question?.length < 1 || disableFields) return

    setIsSpinnerOuter(true)
    setDisableFields(true)
    setShowWelcomeText(false)

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
        message.success("Data submitted successfully, please click download report")
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
    setCheckboxes({
      ...checkboxes,
      [name]: checked,
    })
  }

  const handleYesNoChange = (name, otherName) => {
    setCheckboxes({
      ...checkboxes,
      [name]: true,
      [otherName]: false,
    })
    // Auto advance for YES/NO questions
    setTimeout(() => {
      handleNext()
    }, 300)
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const formatAllTags = (htmlContent) => {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = htmlContent

    const styles = {
      title: {
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "20px",
        marginTop: "30px",
        textAlign: "center",
        color: "#2c3e50",
        borderBottom: "2px solid #3498db",
        paddingBottom: "10px",
      },
      h1: {
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "20px",
        marginTop: "30px",
        textAlign: "center",
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

    Object.keys(styles).forEach((tag) => {
      const elements = tempDiv.querySelectorAll(tag)
      elements.forEach((element) => {
        const tagStyles = styles[tag]
        for (const [key, value] of Object.entries(tagStyles)) {
          element.style[key] = value
        }
      })
    })

    tempDiv.style.maxWidth = "100%"
    tempDiv.style.margin = "0 auto"
    tempDiv.style.backgroundColor = "#ffffff"
    tempDiv.style.padding = "0"
    tempDiv.style.fontFamily = "'Arial', 'Helvetica', sans-serif"

    return tempDiv.innerHTML
  }

  const handleDownloadPdf = (gptResponse) => {
    const formattedContent = formatAllTags(gptResponse)
    const element = document.createElement("div")
    element.style.breakInside = "auto"
    element.style.breakAfter = "auto"
    element.style.breakBefore = "auto"
    element.innerHTML = formattedContent

    const options = {
      filename: "career_guidance_report.pdf",
      margin: [0.75, 0.75, 0.75, 0.75],
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

    html2pdf().set(options).from(element).save()
  }

  const handleReset = () => {
    setGptResponse("")
    setHasExistingReport(false)
    setCheckboxes({
      predictedPointsYes: false,
      predictedPointsNo: false,
      statedGoalsYes: false,
      statedGoalsNo: false,
      misYes: false,
      misNo: false,
      valuesYes: false,
      valuesNo: false,
      interestYes: false,
      interestNo: false,
      exemptIrishYes: false,
      exemptIrishNo: false,
      exemptThirdLanguageYes: false,
      exemptThirdLanguageNo: false,
      useCVYes: false,
      useCVNo: false,
      level8: false,
      level6_7: false,
      level5: false,
      apprenticeship: false,
      tertiaryDegrees: false,
      ucas: false,
      dublin: false,
      leinster: false,
      munster: false,
      connacht: false,
      ulster: false,
      skills: false,
      interest: false,
      qualities: false,
      values_assessment: false,
      interest_assessment: false,
      mis: false,
    })
    setIsCodeVisible(true)
    setCurrentStep(0)
  }

  const DownloadReort = () => {
    if (Boolean(gptResponse)) {
      handleDownloadPdf(gptResponse)
      setLoading(false)
      setIsSpinnerOuter(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    const payload = {
      predicted_points_and_subjects: checkboxes.predictedPointsYes ? "Yes" : "No",
      my_stated_goals: checkboxes.statedGoalsYes ? "Yes" : "No",
      skills: checkboxes.useCVYes ? "Yes" : "No",
      interest: checkboxes.useCVYes ? "Yes" : "No",
      qualities: checkboxes.useCVYes ? "Yes" : "No",
      mis: checkboxes.misYes ? "Yes" : "No",
      values_assessment: checkboxes.valuesYes ? "Yes" : "No",
      interest_assessment: checkboxes.interestYes ? "Yes" : "No",
      education_options: [
        checkboxes.level5 ? "level 5(plc)" : null,
        checkboxes.level6_7 ? "level 6/7" : null,
        checkboxes.level8 ? "level 8" : null,
        checkboxes.apprenticeship ? "apprentices" : null,
        checkboxes.tertiaryDegrees ? "tertiary degrees" : null,
        checkboxes.ucas ? "UCAS" : null,
      ].filter(Boolean),
      locations: [
        checkboxes.leinster ? "Leinster" : null,
        checkboxes.munster ? "Munster" : null,
        checkboxes.connacht ? "Connacht" : null,
        checkboxes.ulster ? "Ulster" : null,
        checkboxes.dublin ? "Greater Dublin" : null,
      ].filter(Boolean),
      exempt_irish: checkboxes.exemptIrishYes ? "Yes" : "No",
      exempt_third_language: checkboxes.exemptThirdLanguageYes ? "Yes" : "No",
    }

    try {
      const response = await postApiWithAuth(`ai-report/generate-guidance-report/`, payload)
      if (response?.data?.data?.success) {
        message.success("Data submitted successfully!")
        setIsCodeVisible(false)
        const responseGptData = response?.data?.data?.message
        setGptResponse(responseGptData)
        setHasExistingReport(true)
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

  const handleShowRecentReport = useCallback(async ({ silentIfMissing = false, showSuccessMessage = true } = {}) => {
    setLoadingRecentReport(true)
    try {
      const response = await getApiWithAuth(`ai-report/get-generated-guidance-report/`)
      if (response?.data?.data?.success && response?.data?.data?.message) {
        if (showSuccessMessage) {
          message.success("Recent report loaded successfully!")
        }
        setIsCodeVisible(false)
        setGptResponse(response?.data?.data?.message)
        setHasExistingReport(true)
        return true
      } else {
        setHasExistingReport(false)
        if (!silentIfMissing) {
          message.info("No recent report found. Please generate a new report.")
        }
        return false
      }
    } catch (error) {
      if (!silentIfMissing) {
        message.error("Error loading recent report")
      }
      console.error("API call failed:", error)
      return false
    } finally {
      setLoadingRecentReport(false)
    }
  }, [])

  useEffect(() => {
    const loadMostRecentReport = async () => {
      setCheckingInitialReport(true)
      await handleShowRecentReport({ silentIfMissing: true, showSuccessMessage: false })
      setCheckingInitialReport(false)
    }

    loadMostRecentReport()
  }, [handleShowRecentReport])

  const updatedResponse = gptResponse

  const renderQuestion = () => {
    const question = questions[currentStep]
    return (
      <Card
        className="mainWizardCard"
        style={{
          borderRadius: "20px",
          boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
          maxWidth: "850px",
          margin: "20px auto",
          background: "#FFFFFF",
          border: "none",
        }}
      >
        {/* Progress Indicator */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <Text strong style={{ color: "#1476B7" }}>Question {currentStep + 1} of {questions.length}</Text>
            <Text type="secondary">{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</Text>
          </div>
          <Progress
            percent={Math.round(((currentStep + 1) / questions.length) * 100)}
            showInfo={false}
            strokeColor="#1476B7"
            trailColor="#E5E7EB"
            strokeWidth={10}
          />
        </div>

        {/* Question Header */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <Title level={2} style={{ color: "#1476B7", fontWeight: "700", marginBottom: "15px" }}>
            {question.title}
          </Title>
          <Text style={{ fontSize: "20px", color: "#4B5563", display: "block", maxWidth: "600px", margin: "0 auto" }}>
            {question.question}
          </Text>
        </div>

        {/* Selection Area */}
        <div style={{ minHeight: "220px", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "50px" }}>
          {question.type === "yesno" ? (
            <Space size={30}>
              <Button
                size="large"
                className={checkboxes[question.names.yes] ? "wizardBtnActive" : "wizardBtnDefault"}
                onClick={() => handleYesNoChange(question.names.yes, question.names.no)}
                style={{ width: "160px", height: "60px", fontSize: "18px", borderRadius: "12px" }}
              >
                YES
              </Button>
              <Button
                size="large"
                className={checkboxes[question.names.no] ? "wizardBtnActive" : "wizardBtnDefault"}
                onClick={() => handleYesNoChange(question.names.no, question.names.yes)}
                style={{ width: "160px", height: "60px", fontSize: "18px", borderRadius: "12px" }}
              >
                NO
              </Button>
            </Space>
          ) : (
            <Row gutter={[20, 20]} style={{ width: "100%", maxWidth: "700px" }}>
              {question.options.map((opt) => (
                <Col xs={24} sm={12} key={opt.name}>
                  <div
                    onClick={() => handleCheckboxChange({ target: { name: opt.name, checked: !checkboxes[opt.name] } })}
                    className={checkboxes[opt.name] ? "optionCardActive" : "optionCardDefault"}
                  >
                    <div className="selectionCircle">
                      {checkboxes[opt.name] && <div className="selectionInner" />}
                    </div>
                    <Text strong style={{ color: checkboxes[opt.name] ? "#FFFFFF" : "#374151", fontSize: "15px" }}>
                      {opt.label}
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* Navigation Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F3F4F6", paddingTop: "30px" }}>
          <Button
            onClick={handleBack}
            disabled={currentStep === 0}
            icon={<ArrowLeftOutlined />}
            size="large"
            className="navBtnSecondary"
          >
            Back
          </Button>

          <Space size={15}>
            {question.type === "multiple" && (
              <>
                <Button
                  onClick={handleSkip}
                  size="large"
                  className="navBtnSecondary"
                >
                  Skip
                </Button>
                <Button
                  type="primary"
                  onClick={handleNext}
                  loading={loading && currentStep === questions.length - 1}
                  size="large"
                  className="navBtnPrimary"
                  icon={currentStep === questions.length - 1 ? <CheckCircleOutlined /> : <ArrowRightOutlined />}
                  iconPosition="right"
                >
                  {currentStep === questions.length - 1 ? "Generate Report" : "Next"}
                </Button>
              </>
            )}
          </Space>
        </div>
      </Card>
    )
  }

  return (
    <div className={styles.educationalGuidanceMainDiv}>
      <div className={styles.educationalGuidanceSecondDiv}>
        <div className="welcomeHaddingText !text-white">My Report (AI)  </div>
        <Layout style={{ background: "transparent" }}>
          <ContentComponent>
            <section
              style={{
                minHeight: "75vh",
                padding: "10px",
                background: "#7C8791",
              }}
            >
              {checkingInitialReport ? (
                <div className="initialReportLoader">
                  <Spin size="large" />
                  <Text style={{ marginTop: "12px", color: "#4B5563" }}>Loading your most recent report...</Text>
                </div>
              ) : isCodeVisible ? (
                <div style={{ animation: "fadeIn 0.5s ease-in-out" }}>
                  <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <Title level={3} style={{ color: "#374151" }}>Help us create your best guidance report</Title>
                  </div>
                  
                  {renderQuestion()}

                  <div style={{ textAlign: "center", marginTop: "40px" }}>
                    <Button
                      onClick={handleShowRecentReport}
                      loading={loadingRecentReport}
                      type="text"
                      className="recentReportBtn  "
                    >
                      View your most recent report
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="reportTopActionBar">
                    <Button
                      onClick={handleReset}
                      className="createNewReportBtn"
                    >
                      Create a New Report
                    </Button>
                  </div>
                  <Row className="justify-between" style={{ marginBottom: "20px" }}>
                  <Col>
  <Title level={4} style={{ color: "#fff" }}>
    {hasExistingReport ? "Most Recent Report" : "Generated Report"}
  </Title>
</Col>
                    <Col>
                      <Space>
                        <Button
                          onClick={handleShowRecentReport}
                          loading={loadingRecentReport}
                          style={{ borderRadius: "10px" }}
                          className="border border-gray-600 "
                        >
                          Recent Report
                        </Button>
                      </Space>
                    </Col>
                  </Row>

                  <Row className="p-1 bg-none" style={backgroundStyle}>
                    <Col span={24}>
                      <div
                        ref={contentRef}
                        className={styles.gptResponse}
                        dangerouslySetInnerHTML={{ __html: updatedResponse }}
                      ></div>
                    </Col>
                  </Row>

                  <div className="reportActionInputRow">
                    <div className="reportActionInputCol">
                      <Form onFinish={onSend}>
                        <MyCareerGuidanceInputField
                          className={styles.messageInput}
                          ref={inputRef}
                          placeholder="Ask a follow-up question or provide feedback..."
                          onChange={onMessageChange}
                          name="question"
                          autoFocus
                          inputValue={data.question}
                          suffix={
                            disableFields ? (
                              <Spin />
                            ) : (
                              <SendOutlined
                                style={{ color: "#1476B7", cursor: "pointer" }}
                                onClick={() => onSend()}
                              />
                            )
                          }
                        />
                      </Form>
                    </div>
                    <div className="reportActionButtonCol">
                      <Button
                        className="createNewReportBtn"
                        onClick={DownloadReort}
                      >
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </section>
          </ContentComponent>
        </Layout>
      </div>
    </div>
  )
}

export default MyChoices
