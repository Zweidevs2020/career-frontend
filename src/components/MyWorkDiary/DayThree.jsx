import React, { useState, useEffect } from "react";
import { Input, Button, DatePicker, Row, Col, message } from "antd";
import { postApiWithoutAuth } from "../../utils/api"; // Assuming this is a utility for API calls
import { API_URL } from "../../utils/constants";
import moment from "moment"; // For date handling

const DayThree = () => {
  const savedFormData = JSON.parse(
    localStorage.getItem("dayThreeFormData")
  ) || {
    date: null,
    feelings: "",
    jobs: ["", "", "", "", ""],
    healthAndSafetyRules: "",
    employeeResponsibilities: "",
    thoughtsAndFeelings: "",
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
      {
        question: "How did you feel going into work?",
        answer: formData.feelings,
      },
      ...formData.jobs.map((job, index) => ({
        question: `Job ${index + 1}`,
        answer: job,
      })),
      {
        question: "Are there any Health & Safety rules?",
        answer: formData.healthAndSafetyRules,
      },
      {
        question: "What responsibilities do you have for Health & Safety?",
        answer: formData.employeeResponsibilities,
      },
      {
        question: "What were your thoughts and feelings about the day?",
        answer: formData.thoughtsAndFeelings,
      },
    ];

    if (questionsAndAnswers.length === 0) {
      message.error("At least one question must have an answer.");
      setLoading(false);
      return;
    }

    const payload = [
      {
        day: "Day 3", // Send Day 3 in the payload
        date: formData.date,
        questionsAndAnswers: questionsAndAnswers,
      },
    ];
    console.log(payload);
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
      feelings: "",
      jobs: ["", "", "", "", ""],
      healthAndSafetyRules: "",
      employeeResponsibilities: "",
      thoughtsAndFeelings: "",
    };
    setFormData(initialFormData);
    localStorage.setItem("dayThreeFormData", JSON.stringify(initialFormData)); // Reset localStorage
  };

  // Save form data to localStorage when formData changes
  useEffect(() => {
    localStorage.setItem("dayThreeFormData", JSON.stringify(formData));
  }, [formData]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2 className="font-bold text-lg">Day 3</h2>
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

        {/* Feelings */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            How did you feel going into work?
          </label>
          <Input.TextArea
            rows={4}
            value={formData.feelings}
            onChange={(e) => handleInputChange(e, "feelings")}
            placeholder="Describe your feelings"
            style={{ marginTop: "8px" }}
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

        {/* Health and Safety Rules */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Are there any Health & Safety rules?
          </label>
          <Input.TextArea
            rows={4}
            value={formData.healthAndSafetyRules}
            onChange={(e) => handleInputChange(e, "healthAndSafetyRules")}
            placeholder="Enter health and safety rules"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Employee Responsibilities */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What responsibilities as an employee do you have for Health &
            Safety?
          </label>
          <Input.TextArea
            rows={4}
            value={formData.employeeResponsibilities}
            onChange={(e) => handleInputChange(e, "employeeResponsibilities")}
            placeholder="Describe your responsibilities"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Thoughts and Feelings */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What were your thoughts and feelings about the day?
          </label>
          <Input.TextArea
            rows={4}
            value={formData.thoughtsAndFeelings}
            onChange={(e) => handleInputChange(e, "thoughtsAndFeelings")}
            placeholder="Describe your thoughts and feelings"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Submit and Reset Buttons */}
        <Col span={24} style={{ textAlign: "right", marginTop: "16px" }}>
          <Button
            type="primary"
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

export default DayThree;
