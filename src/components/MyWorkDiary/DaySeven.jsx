import React, { useState, useEffect } from "react";
import { Input, Button, DatePicker, Row, Col, message } from "antd";
import { postApiWithoutAuth } from "../../utils/api"; // Assuming you have a helper for API calls
import { API_URL } from "../../utils/constants"; // Assuming API_URL is defined
import moment from "moment"; // To handle date format

const DaySeven = () => {
  // Load saved data from localStorage or set initial values
  const savedFormData = JSON.parse(
    localStorage.getItem("daySevenFormData")
  ) || {
    date: null,
    jobs: ["", "", "", "", ""],
    skillsNeeded: "",
    skillsFit: "",
    furtherEducation: "",
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

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);

    const questionsAndAnswers = [
      ...formData.jobs.map((job, index) => ({
        question: `Job ${index + 1}`,
        answer: job,
      })),
      {
        question: "What skills are needed for your job?",
        answer: formData.skillsNeeded,
      },
      {
        question: "Do your skills fit this line of work? Why?",
        answer: formData.skillsFit,
      },
      {
        question: "Do you think you need further education?",
        answer: formData.furtherEducation,
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
        day: "Day 7", // Send Day 7 in the payload
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
      jobs: ["", "", "", "", ""],
      skillsNeeded: "",
      skillsFit: "",
      furtherEducation: "",
      thoughtsAndFeelings: "",
    };
    setFormData(initialFormData);
    localStorage.setItem("daySevenFormData", JSON.stringify(initialFormData)); // Reset localStorage
  };

  // Save form data to localStorage when formData changes
  useEffect(() => {
    localStorage.setItem("daySevenFormData", JSON.stringify(formData));
  }, [formData]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2 className="font-bold text-lg">Day 7</h2>
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

        {/* Skills Needed */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What skills are needed for your job?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.skillsNeeded}
            onChange={(e) => handleInputChange(e, "skillsNeeded")}
            placeholder="Describe the skills needed for your job"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Skills Fit */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Do your skills fit this line of work? Why?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.skillsFit}
            onChange={(e) => handleInputChange(e, "skillsFit")}
            placeholder="Explain if your skills fit this line of work and why"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Further Education */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Do you think you need further education?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.furtherEducation}
            onChange={(e) => handleInputChange(e, "furtherEducation")}
            placeholder="Explain if you think you need further education"
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

export default DaySeven;
