import React, { useState, useEffect } from "react";
import { Input, Button, DatePicker, Row, Col, Radio, message } from "antd";
import { postApiWithoutAuth } from "../../utils/api"; // Assuming you have a helper for API calls
import { API_URL } from "../../utils/constants"; // Assuming API_URL is defined
import moment from "moment"; // To handle date format

const DaySix = () => {
  // Load saved data from localStorage or set initial values
  const savedFormData = JSON.parse(localStorage.getItem("daySixFormData")) || {
    date: null,
    feeling: "",
    jobs: ["", "", "", "", ""],
    taskLevel: "",
    taskExplanation: "",
    thoughtsAndFeelings: "",
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
      const updatedJobs = [...formData.jobs];
      updatedJobs[index] = value;
      setFormData({ ...formData, jobs: updatedJobs });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  // Handle radio button change for task level
  const handleRadioChange = (e) => {
    setFormData({ ...formData, taskLevel: e.target.value });
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
        question: "How did you feel going in to work?",
        answer: formData.feeling,
      },
      {
        question:
          "Are you given tasks equal, above, or below your skill level?",
        answer: formData.taskLevel,
      },
      {
        question:
          "Explain why you feel tasks are equal, above, or below your skill level",
        answer: formData.taskExplanation,
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
        day: "Day 6", // Send Day 6 in the payload
        date: formData.date,
        questionsAndAnswers: questionsAndAnswers,
      },
    ];

    try {
      const apiUrl = API_URL.WORK_DIARY; // Assuming your API URL is in this constant
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
      feeling: "",
      jobs: ["", "", "", "", ""],
      taskLevel: "",
      taskExplanation: "",
      thoughtsAndFeelings: "",
    };
    setFormData(initialFormData);
    localStorage.setItem("daySixFormData", JSON.stringify(initialFormData)); // Reset localStorage
  };

  // Save form data to localStorage when formData changes
  useEffect(() => {
    localStorage.setItem("daySixFormData", JSON.stringify(formData));
  }, [formData]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2 className="font-bold text-lg">Day 6</h2>
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

        {/* Feeling */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            How did you feel going in to work?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.feeling}
            onChange={(e) => handleInputChange(e, "feeling")}
            placeholder="Describe how you felt going in to work"
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

        {/* Task Level */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Are you given tasks equal, above, or below your skill level?
          </label>
          <Radio.Group
            onChange={handleRadioChange}
            value={formData.taskLevel}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "8px",
            }}
          >
            <Radio value="Equal">Equal</Radio>
            <Radio value="Above">Above</Radio>
            <Radio value="Below">Below</Radio>
          </Radio.Group>
        </Col>

        {/* Task Explanation */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Explain:
          </label>
          <Input.TextArea
            rows={3}
            value={formData.taskExplanation}
            onChange={(e) => handleInputChange(e, "taskExplanation")}
            placeholder="Explain why you feel tasks are equal, above, or below your skill level"
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
            placeholder="Share your thoughts and feelings about the day"
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
          <Button type="default" onClick={handleReset}>
            Reset
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default DaySix;
