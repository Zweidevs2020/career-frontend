import React, { useState, useEffect } from "react";
import { Input, Button, DatePicker, Row, Col, message } from "antd";
import { postApiWithoutAuth } from "../../utils/api"; // Assuming this is a utility for API calls
import { API_URL } from "../../utils/constants"; // Assuming API_URL is correctly defined
import moment from "moment"; // For date handling

const DayFour = () => {
  // Load saved data from localStorage or set initial values
  const savedFormData = JSON.parse(localStorage.getItem("dayFourFormData")) || {
    date: null,
    jobs: ["", "", "", "", ""],
    workHours: "",
    missingDayConsequences: "",
    coworkerInteractions: "",
    thoughtsAndFeelings: "",
    improvementSuggestions: "",
  };

  const [formData, setFormData] = useState(savedFormData);
  const [loading, setLoading] = useState(false);

  // Handle date change
  const handleDateChange = (date, dateString) => {
    setFormData({ ...formData, date: dateString });
  };

  // Handle input change for both text and job fields
  const handleInputChange = (e, field, index = null) => {
    const value = e.target.value;
    if (index !== null) {
      const updatedJobs = [...formData.jobs];
      updatedJobs[index] = value;
      setFormData({ ...formData, jobs: updatedJobs });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);

    const questionsAndAnswers = [
      ...formData.jobs.map((job, index) => ({
        question: `Job ${index + 1}`,
        answer: job,
      })),
      {
        question: "What hours do people work in the company?",
        answer: formData.workHours,
      },
      {
        question: "What happens if you miss a day?",
        answer: formData.missingDayConsequences,
      },
      {
        question: "How are you getting on with the people you work with?",
        answer: formData.coworkerInteractions,
      },
      {
        question: "What were your thoughts and feelings about the day?",
        answer: formData.thoughtsAndFeelings,
      },
      {
        question:
          "What could you do differently to improve your work experience?",
        answer: formData.improvementSuggestions,
      },
    ];

    if (questionsAndAnswers.length === 0) {
      message.error("At least one question must have an answer.");
      setLoading(false);
      return;
    }

    const payload = [
      {
        day: "Day 4", // Send Day 4 in the payload
        date: formData.date,
        questionsAndAnswers: questionsAndAnswers,
      },
    ];

    try {
      const apiUrl = API_URL.WORK_DIARY;
      const response = await postApiWithoutAuth(apiUrl, payload);
      message.success("Data submitted successfully!");
    } catch (error) {
      message.error("Something went wrong. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    const initialFormData = {
      date: null,
      jobs: ["", "", "", "", ""],
      workHours: "",
      missingDayConsequences: "",
      coworkerInteractions: "",
      thoughtsAndFeelings: "",
      improvementSuggestions: "",
    };
    setFormData(initialFormData);
    localStorage.setItem("dayFourFormData", JSON.stringify(initialFormData)); // Reset localStorage
  };

  // Save form data to localStorage when formData changes
  useEffect(() => {
    localStorage.setItem("dayFourFormData", JSON.stringify(formData));
  }, [formData]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2 className="font-bold text-lg">Day 4</h2>
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

        {/* Jobs */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            List the jobs you did:
          </label>
          <div style={{ marginTop: "8px" }}>
            {formData.jobs.map((job, index) => (
              <div key={index} style={{ marginBottom: "8px" }}>
                <label>Job {index + 1}:</label>
                <Input
                  value={job}
                  onChange={(e) => handleInputChange(e, "jobs", index)}
                  placeholder={`Enter job ${index + 1}`}
                  style={{ marginTop: "4px" }}
                />
              </div>
            ))}
          </div>
        </Col>

        {/* Work Hours */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What hours do people work in the company?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.workHours}
            onChange={(e) => handleInputChange(e, "workHours")}
            placeholder="Describe work hours in the company"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Missing a Day */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What happens if you miss a day?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.missingDayConsequences}
            onChange={(e) => handleInputChange(e, "missingDayConsequences")}
            placeholder="Explain the consequences of missing a day"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Coworker Interactions */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            How are you getting on with the people you work with?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.coworkerInteractions}
            onChange={(e) => handleInputChange(e, "coworkerInteractions")}
            placeholder="Describe your interactions with coworkers"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Thoughts and Feelings */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What were your thoughts and feelings about the day?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.thoughtsAndFeelings}
            onChange={(e) => handleInputChange(e, "thoughtsAndFeelings")}
            placeholder="Share your thoughts and feelings"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Improvement Suggestions */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What could you do differently to improve your work experience?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.improvementSuggestions}
            onChange={(e) => handleInputChange(e, "improvementSuggestions")}
            placeholder="Suggest improvements for your work experience"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Submit and Reset Buttons */}
        <Col span={24} style={{ textAlign: "right", marginTop: "16px" }}>
          <Button
            className="border-blue-500"
            onClick={handleSubmit}
            loading={loading}
            style={{ marginRight: "8px" }}
          >
            Submit
          </Button>
          <Button type="default" onClick={handleReset}>
            Reset
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default DayFour;
