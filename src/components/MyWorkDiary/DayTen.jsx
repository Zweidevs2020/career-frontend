import React, { useState, useEffect } from "react";
import { Input, Button, DatePicker, Row, Col, Radio, message } from "antd";
import {
  getApiWithAuth,
  postApiWithoutAuth,
  putApiWithAuth,
} from "../../utils/api"; // Assuming you have a helper for API calls
import { API_URL } from "../../utils/constants"; // Assuming API_URL is defined
import moment from "moment"; // To handle date format

const DayTen = () => {
  const savedFormData = {
    date: null,
    selfLearning: "",
    demonstratedSkills: ["", "", ""],
    goalsAchieved: null,
    goalsAchievedExplanation: "",
    worstExperience: "",
    bestExperience: "",
    performanceRatings: {
      attendance: null,
      timeKeeping: null,
      supervisorRelation: null,
      coworkersRelation: null,
      jobAbility: null,
      jobInterest: null,
    },
    supervisorComparison: null,
    comparisonDifference: "",
  };

  const [formData, setFormData] = useState(savedFormData);
  const [loading, setLoading] = useState(false);

  // Handle date change
  const handleDateChange = (date, dateString) => {
    setFormData({ ...formData, date: dateString });
  };

  // Handle input changes for both text and skill fields
  const handleInputChange = (e, field, index = null) => {
    const value = e.target.value;
    if (index !== null) {
      const updatedSkills = [...formData.demonstratedSkills];
      updatedSkills[index] = value;
      setFormData({ ...formData, demonstratedSkills: updatedSkills });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  // Handle radio button changes for yes/no fields
  const handleRadioChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  // Handle performance rating changes
  const handlePerformanceChange = (value, field) => {
    setFormData({
      ...formData,
      performanceRatings: { ...formData.performanceRatings, [field]: value },
    });
  };

  // Handle form reset
  const handleReset = () => {
    const initialFormData = {
      date: null,
      selfLearning: "",
      demonstratedSkills: ["", "", ""],
      goalsAchieved: null,
      goalsAchievedExplanation: "",
      worstExperience: "",
      bestExperience: "",
      performanceRatings: {
        attendance: null,
        timeKeeping: null,
        supervisorRelation: null,
        coworkersRelation: null,
        jobAbility: null,
        jobInterest: null,
      },
      supervisorComparison: null,
      comparisonDifference: "",
    };
    setFormData(initialFormData);
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
        case "What have you learned about yourself during the ten days?":
          updatedFormData.selfLearning = answer;
          break;
        case "List all the skills you demonstrated during your work experience:":
          updatedFormData.demonstratedSkills = answer.split(", ");
          break;
        case "Did you achieve your goals?":
          updatedFormData.goalsAchieved = answer;
          break;
        case "Why?":
          updatedFormData.goalsAchievedExplanation = answer;
          break;
        case "What was the worst thing about the ten days?":
          updatedFormData.worstExperience = answer;
          break;
        case "What was the best experience?":
          updatedFormData.bestExperience = answer;
          break;
        case "Rate your performance in various areas":
          updatedFormData.performanceRatings = JSON.parse(answer);
          break;
        case "Compare this to how your supervisor rated you. Are they similar?":
          updatedFormData.supervisorComparison = answer;
          break;
        case "If no, why do you think there is a diference?":
          updatedFormData.comparisonDifference = answer;
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
      const response = await getApiWithAuth(`${API_URL.WORK_DIARY}?day=Day10`);
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
        question: "What have you learned about yourself during the ten days?",
        answer: formData.selfLearning || "", // Use empty string if no answer
      },
      {
        question:
          "List all the skills you demonstrated during your work experience:",
        answer: formData.demonstratedSkills.join(", "), // Join skills into a single string
      },
      {
        question: "Did you achieve your goals?",
        answer: formData.goalsAchieved || "",
      },
      formData.goalsAchieved === "No" && {
        question: "Why?",
        answer: formData.goalsAchievedExplanation || "",
      },
      {
        question: "What was the worst thing about the ten days?",
        answer: formData.worstExperience || "",
      },
      {
        question: "What was the best experience?",
        answer: formData.bestExperience || "",
      },
      {
        question: "Rate your performance in various areas",
        answer: JSON.stringify(formData.performanceRatings),
      },
      {
        question:
          "Compare this to how your supervisor rated you. Are they similar?",
        answer: formData.supervisorComparison || "",
      },
      formData.supervisorComparison === "No" && {
        question: "If no, why do you think there is a difference?",
        answer: formData.comparisonDifference || "",
      },
    ].filter(Boolean); // Remove any undefined values (e.g., "Why?" or "Comparison" if hidden)

    const payload = [
      {
        day: "Day10", // Adjust day as needed
        date: formData.date || "", // Default empty date if not provided
        questionsAndAnswers: questionsAndAnswers,
      },
    ];

    const updatePayload = {
      day: "Day10",
      date: formData.date || "", // Default empty date if not provided
      questionsAndAnswers: questionsAndAnswers,
    };

    // Submit data regardless of field completion
    try {
      const apiUrl = API_URL.WORK_DIARY;
      await postApiWithoutAuth(apiUrl, payload);
    } catch (error) {
      message.error("Something went wrong while submitting the data.");
      console.error("Error:", error);
    }

    // Try to update existing data
    try {
      const url = `${API_URL.WORK_DIARY}update-day/?day=Day10`;
      const response = await putApiWithAuth(url, updatePayload);
      console.log("Updated data:", updatePayload);
      message.success("Data updated successfully!");
    } catch (error) {
      message.error("Something went wrong while updating data.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiary();
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2 className="font-bold text-lg">Day 10</h2>
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

        {/* Self-Learning */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What have you learned about yourself during the ten days?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.selfLearning}
            onChange={(e) => handleInputChange(e, "selfLearning")}
            placeholder="Describe what you have learned about yourself"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Demonstrated Skills */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            List all the skills you demonstrated during your work experience:
          </label>
          <div style={{ marginTop: "8px" }}>
            {formData.demonstratedSkills.map((skill, index) => (
              <div key={index} style={{ marginBottom: "8px" }}>
                <label>Skill {index + 1}:</label>
                <Input
                  value={skill}
                  onChange={(e) =>
                    handleInputChange(e, "demonstratedSkills", index)
                  }
                  placeholder={`Enter skill ${index + 1}`}
                  style={{ marginTop: "4px" }}
                />
              </div>
            ))}
          </div>
        </Col>

        {/* Goals Achieved */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Did you achieve your goals?
          </label>
          <Radio.Group
            onChange={(e) => handleRadioChange(e, "goalsAchieved")}
            value={formData.goalsAchieved}
            style={{ marginTop: "8px" }}
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </Radio.Group>
        </Col>

        {/* Goals Achieved Explanation (Only visible if "No" is selected) */}
        {formData.goalsAchieved === "No" && (
          <Col span={24}>
            <label style={{ fontWeight: "bold", marginTop: "16px" }}>
              Why?
            </label>
            <Input.TextArea
              rows={3}
              value={formData.goalsAchievedExplanation}
              onChange={(e) => handleInputChange(e, "goalsAchievedExplanation")}
              placeholder="Explain why you did or did not achieve your goals"
              style={{ marginTop: "8px" }}
            />
          </Col>
        )}

        {/* Worst Experience */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What was the worst thing about the ten days?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.worstExperience}
            onChange={(e) => handleInputChange(e, "worstExperience")}
            placeholder="Describe the worst experience of the ten days"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Best Experience */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What was the best experience?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.bestExperience}
            onChange={(e) => handleInputChange(e, "bestExperience")}
            placeholder="Describe the best experience of the ten days"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Performance Ratings */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Rate your performance in various areas:
          </label>
          <Row gutter={[16, 16]} style={{ marginTop: "8px" }}>
            {Object.keys(formData.performanceRatings).map((field) => (
              <Col span={12} key={field}>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </label>
                <Radio.Group
                  onChange={(e) =>
                    handlePerformanceChange(e.target.value, field)
                  }
                  value={formData.performanceRatings[field]}
                  style={{ display: "flex", gap: "10px" }}
                >
                  <Radio value="Excellent">Excellent</Radio>
                  <Radio value="Good">Good</Radio>
                  <Radio value="Fair">Fair</Radio>
                </Radio.Group>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Supervisor Comparison */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Compare this to how your supervisor rated you. Are they similar?
          </label>
          <Radio.Group
            onChange={(e) => handleRadioChange(e, "supervisorComparison")}
            value={formData.supervisorComparison}
            style={{ marginTop: "8px" }}
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </Radio.Group>
        </Col>

        {/* Comparison Explanation (Only visible if "No" is selected) */}
        {formData.supervisorComparison === "No" && (
          <Col span={24}>
            <label style={{ fontWeight: "bold", marginTop: "16px" }}>
              If no, why do you think there is a difference?
            </label>
            <Input.TextArea
              rows={3}
              value={formData.comparisonDifference}
              onChange={(e) => handleInputChange(e, "comparisonDifference")}
              placeholder="Explain why you think there is a difference"
              style={{ marginTop: "8px" }}
            />
          </Col>
        )}

        {/* Submit and Reset Buttons */}
        <Col span={24} style={{ textAlign: "right", marginTop: "16px" }}>
          <Button
            className="border-blue-500"
            onClick={handleSubmit}
            loading={loading}
            style={{ marginRight: "10px" }}
          >
            Submit
          </Button>
          <Button onClick={handleReset}>Reset</Button>
        </Col>
      </Row>
    </div>
  );
};

export default DayTen;