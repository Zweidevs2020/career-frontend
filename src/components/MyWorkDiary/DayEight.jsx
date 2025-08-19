import React, { useState, useEffect } from "react";
import { Input, Button, DatePicker, Row, Col, Radio, message } from "antd";
import {
  getApiWithAuth,
  postApiWithoutAuth,
  putApiWithAuth,
} from "../../utils/api"; // Assuming you have a helper for API calls
import { API_URL } from "../../utils/constants"; // Assuming API_URL is defined
import moment from "moment"; // To handle date format

const DayEight = () => {
  const savedFormData = {
    date: null,
    jobDemands: "",
    workImportance: "",
    enjoyablePart: "",
    worstPart: "",
    technologyChange: "",
    specificSkills: ["", "", ""],
    tradeUnion: null,
    industrialProblem: null,
    industrialProblemExplanation: "",
    trainingOpportunities: "",
    promotionEase: "",
    careerOpportunities: "",
    recommendedTraining: "",
  };

  const [formData, setFormData] = useState(savedFormData);
  const [loading, setLoading] = useState(false);

  // Handle date change
  const handleDateChange = (date, dateString) => {
    setFormData({ ...formData, date: dateString });
  };

  // Handle input changes for both text and job fields
  const handleInputChange = (e, field, index = null) => {
    const value = e.target.value;
    if (index !== null) {
      const updatedSkills = [...formData.specificSkills];
      updatedSkills[index] = value;
      setFormData({ ...formData, specificSkills: updatedSkills });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  // Handle radio button change
  const handleRadioChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const populateForm = async (data) => {
    const updatedFormData = { ...formData };
    if (
      !data[0]?.date &&
      (!data[0]?.questionsAndAnswers || !data[0]?.questionsAndAnswers.length)
    ) {
      // POST default data if no existing data
      try {
        const payload = [
          {
            day: formData.day,
            date: "",
            questionsAndAnswers: [],
          },
        ];
        await postApiWithoutAuth(API_URL.WORK_DIARY, payload);
        return;
      } catch (error) {
        message.error("Error creating default entry.");
        console.error("Error:", error);
        return;
      }
    }

    // Populate form with existing data
    if (data[0]?.date) {
      updatedFormData.date = moment(data[0]?.date).format("YYYY-MM-DD");
    }

    data[0]?.questionsAndAnswers?.forEach(({ question, answer }) => {
      switch (question) {
        case "The demands of the job":
          updatedFormData.jobDemands = answer;
          break;
        case "What is important to them in their work?":
          updatedFormData.workImportance = answer;
          break;
        case "What is the most enjoyable part of their job?":
          updatedFormData.enjoyablePart = answer;
          break;
        case "What is the worst part of their work?":
          updatedFormData.worstPart = answer;
          break;
        case "How has technology changed their job over the last five years?":
          updatedFormData.technologyChange = answer;
          break;
        case "Specific Skill 1":
          updatedFormData.specificSkills[0] = answer;
          break;
        case "Specific Skill 2":
          updatedFormData.specificSkills[1] = answer;
          break;
        case "Specific Skill 3":
          updatedFormData.specificSkills[2] = answer;
          break;
        case "Are the employees in a trade union?":
          updatedFormData.tradeUnion = answer;
          break;
        case "Has there ever been an industrial relations problem?":
          updatedFormData.industrialProblem = answer;
          break;
        case "If yes, why? (Explain the industrial relations problem)":
          updatedFormData.industrialProblemExplanation = answer;
          break;
        case "Are there opportunities for in-house training?":
          updatedFormData.trainingOpportunities = answer;
          break;
        case "Can you get promotion easily?":
          updatedFormData.promotionEase = answer;
          break;
        case "Can you identify possible career opportunities in this organisation?":
          updatedFormData.careerOpportunities = answer;
          break;
        case "What formal training or further education would you recommend?":
          updatedFormData.recommendedTraining = answer;
          break;
        default:
          break;
      }
    });

    setFormData(updatedFormData);
  };

  // Fetch existing diary data
  const fetchDiary = async () => {
    try {
      const response = await getApiWithAuth(`${API_URL.WORK_DIARY}?day=Day8`);
      if (response?.data?.data) {
        populateForm(response.data.data);
      }
    } catch (error) {
      message.error("Error fetching diary data.");
      console.error("Error:", error);
    }
  };

  // Handle form submission - Updated to allow submission with empty fields
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Prepare the questions and answers array - no validation required
    const questionsAndAnswers = [
      {
        question: "The demands of the job",
        answer: formData.jobDemands || "",
      },
      {
        question: "What is important to them in their work?",
        answer: formData.workImportance || "",
      },
      {
        question: "What is the most enjoyable part of their job?",
        answer: formData.enjoyablePart || "",
      },
      {
        question: "What is the worst part of their work?",
        answer: formData.worstPart || "",
      },
      {
        question:
          "How has technology changed their job over the last five years?",
        answer: formData.technologyChange || "",
      },
      ...formData.specificSkills.map((skill, index) => ({
        question: `Specific Skill ${index + 1}`,
        answer: skill || "",
      })),
      {
        question: "Are the employees in a trade union?",
        answer: formData.tradeUnion || "",
      },
      {
        question: "Has there ever been an industrial relations problem?",
        answer: formData.industrialProblem || "",
      },
      formData.industrialProblem === "Yes" && {
        question: "If yes, why? (Explain the industrial relations problem)",
        answer: formData.industrialProblemExplanation || "",
      },
      {
        question: "Are there opportunities for in-house training?",
        answer: formData.trainingOpportunities || "",
      },
      {
        question: "Can you get promotion easily?",
        answer: formData.promotionEase || "",
      },
      {
        question:
          "Can you identify possible career opportunities in this organisation?",
        answer: formData.careerOpportunities || "",
      },
      {
        question:
          "What formal training or further education would you recommend?",
        answer: formData.recommendedTraining || "",
      },
    ].filter(Boolean); // Remove any undefined entries (like for the 'If yes' conditions)

    // Prepare the payload for POST or PUT
    const payload = [
      {
        day: "Day8", // Adjust the day dynamically as needed
        date: formData.date || "", // Default empty date if not provided
        questionsAndAnswers: questionsAndAnswers,
      },
    ];

    const updatePayload = {
      day: "Day8", // Adjust the day dynamically as needed
      date: formData.date || "", // Default empty date if not provided
      questionsAndAnswers: questionsAndAnswers,
    };

    // Submit data regardless of field completion
    try {
      const apiUrl = API_URL.WORK_DIARY;
      await postApiWithoutAuth(apiUrl, payload);
     
    } catch (error) {
      message.error("Something went wrong while submitting data.");
      console.error("Error:", error);
    }

    // Try to update existing data
    try {
      const url = `${API_URL.WORK_DIARY}update-day/?day=Day8`;
      await putApiWithAuth(url, updatePayload);
      console.log("Updated data:", updatePayload);
      message.success("Data updated successfully!");
    } catch (error) {
      message.error("Something went wrong while updating data.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    const initialFormData = {
      date: null,
      jobDemands: "",
      workImportance: "",
      enjoyablePart: "",
      worstPart: "",
      technologyChange: "",
      specificSkills: ["", "", ""],
      tradeUnion: null,
      industrialProblem: null,
      industrialProblemExplanation: "",
      trainingOpportunities: "",
      promotionEase: "",
      careerOpportunities: "",
      recommendedTraining: "",
    };
    setFormData(initialFormData);
    localStorage.setItem("dayEightFormData", JSON.stringify(initialFormData)); // Reset localStorage
  };

  useEffect(() => {
    fetchDiary();
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2 className="font-bold text-lg">Day 8 - The Interview</h2>
      <Row gutter={[16, 16]}>
        {/* Date */}
        <Col span={24}>
          <label style={{ fontWeight: "bold" }}>Date:</label>
          <DatePicker
            style={{ width: "100%", marginTop: "8px" }}
            onChange={handleDateChange}
            value={formData.date ? moment(formData.date) : null}
          />
        </Col>

        {/* Job Demands */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            The demands of the job:
          </label>
          <Input.TextArea
            rows={3}
            value={formData.jobDemands}
            onChange={(e) => handleInputChange(e, "jobDemands")}
            placeholder="Describe the demands of the job"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Work Importance */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What is important to them in their work?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.workImportance}
            onChange={(e) => handleInputChange(e, "workImportance")}
            placeholder="Describe what is important to them in their work"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Enjoyable Part */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What is the most enjoyable part of their job?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.enjoyablePart}
            onChange={(e) => handleInputChange(e, "enjoyablePart")}
            placeholder="Describe the most enjoyable part of their job"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Worst Part */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What is the worst part of their work?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.worstPart}
            onChange={(e) => handleInputChange(e, "worstPart")}
            placeholder="Describe the worst part of their work"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Technology Change */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            How has technology changed their job over the last five years?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.technologyChange}
            onChange={(e) => handleInputChange(e, "technologyChange")}
            placeholder="Describe how technology has changed their job"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Specific Skills */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What job-specific skills do they have?
          </label>
          <div style={{ marginTop: "8px" }}>
            {formData.specificSkills.map((skill, index) => (
              <div key={index} style={{ marginBottom: "8px" }}>
                <label>Skill {index + 1}:</label>
                <Input
                  value={skill}
                  onChange={(e) =>
                    handleInputChange(e, "specificSkills", index)
                  }
                  placeholder={`Enter skill ${index + 1}`}
                  style={{ marginTop: "4px" }}
                />
              </div>
            ))}
          </div>
        </Col>

        {/* Trade Union */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Are the employees in a trade union?
          </label>
          <Radio.Group
            onChange={(e) => handleRadioChange(e, "tradeUnion")}
            value={formData.tradeUnion}
            style={{ marginTop: "8px" }}
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </Radio.Group>
        </Col>

        {/* Industrial Relations Problem */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Has there ever been an industrial relations problem?
          </label>
          <Radio.Group
            onChange={(e) => handleRadioChange(e, "industrialProblem")}
            value={formData.industrialProblem}
            style={{ marginTop: "8px" }}
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </Radio.Group>
        </Col>

        {/* Industrial Problem Explanation */}
        {formData.industrialProblem === "Yes" && (
          <Col span={24}>
            <label style={{ fontWeight: "bold", marginTop: "16px" }}>
              If yes, why?
            </label>
            <Input.TextArea
              rows={3}
              value={formData.industrialProblemExplanation}
              onChange={(e) =>
                handleInputChange(e, "industrialProblemExplanation")
              }
              placeholder="Explain the industrial relations problem"
              style={{ marginTop: "8px" }}
            />
          </Col>
        )}

        {/* Training Opportunities */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Are there opportunities for in-house training?
          </label>
          <Input.TextArea
            rows={2}
            value={formData.trainingOpportunities}
            onChange={(e) => handleInputChange(e, "trainingOpportunities")}
            placeholder="Describe the opportunities for in-house training"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Promotion Ease */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Can you get promotion easily?
          </label>
          <Input.TextArea
            rows={2}
            value={formData.promotionEase}
            onChange={(e) => handleInputChange(e, "promotionEase")}
            placeholder="Describe if promotion is easily attainable"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Career Opportunities */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Can you identify possible career opportunities in this organisation?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.careerOpportunities}
            onChange={(e) => handleInputChange(e, "careerOpportunities")}
            placeholder="Describe possible career opportunities in the organisation"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Recommended Training */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What formal training or further education would you recommend?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.recommendedTraining}
            onChange={(e) => handleInputChange(e, "recommendedTraining")}
            placeholder="Describe recommended training or further education"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Submit Button */}
        <Col span={24} style={{ textAlign: "right", marginTop: "16px" }}>
          <Button
            className="border-blue-500"
            onClick={handleSubmit}
            loading={loading}
            style={{ marginRight: "8px" }}
          >
            Submit
          </Button>
          <Button onClick={handleReset}>Reset</Button>
        </Col>
      </Row>
    </div>
  );
};

export default DayEight;