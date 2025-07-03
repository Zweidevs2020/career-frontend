import React, { useState, useEffect } from "react";
import { Input, Button, DatePicker, Row, Col, message } from "antd";
import {
  getApiWithAuth,
  postApiWithoutAuth,
  putApiWithAuth,
} from "../../utils/api"; // Assuming you have a helper for API calls
import { API_URL } from "../../utils/constants"; // Assuming API_URL is defined
import moment from "moment"; // To handle date format

const DayNine = () => {
  // Load saved data from localStorage or set initial values
  const savedFormData = {
    date: null,
    jobs: ["", "", "", "", ""],
    goalAchievePlan: "",
    lastDayImplementation: "",
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

  // Handle form reset
  const handleReset = () => {
    const initialFormData = {
      date: null,
      jobs: ["", "", "", "", ""],
      goalAchievePlan: "",
      lastDayImplementation: "",
      thoughtsAndFeelings: "",
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
        case "What haven't you done that you'd like to do to achieve your goal?":
          updatedFormData.goalAchievePlan = answer;
          break;
        case "How will you implement this on your last day?":
          updatedFormData.lastDayImplementation = answer;
          break;
        case "What were your thoughts and feelings about the day?":
          updatedFormData.thoughtsAndFeelings = answer;
          break;
        case "Jobs performed":
          updatedFormData.jobs = answer.split(", ");
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
      const response = await getApiWithAuth(`${API_URL.WORK_DIARY}?day=Day9`);
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
        question: "Jobs performed",
        answer: formData.jobs.join(", "), // Join all job entries into a string
      },
      {
        question:
          "What haven't you done that you'd like to do to achieve your goal?",
        answer: formData.goalAchievePlan || "",
      },
      {
        question: "How will you implement this on your last day?",
        answer: formData.lastDayImplementation || "",
      },
      {
        question: "What were your thoughts and feelings about the day?",
        answer: formData.thoughtsAndFeelings || "",
      },
    ];

    // Prepare the payload for POST or PUT
    const payload = [
      {
        day: "Day9", // Adjust the day dynamically as needed
        date: formData.date || "", // Default empty date if not provided
        questionsAndAnswers: questionsAndAnswers,
      },
    ];

    const updatePayload = {
      day: "Day9",
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
      const url = `${API_URL.WORK_DIARY}update-day/?day=Day9`;
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

  useEffect(() => {
    fetchDiary();
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2 className="font-bold text-lg">Day 9</h2>
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

        {/* Goal Achievement Plan */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Is there anything you haven't done that you would like to do to
            achieve your goal?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.goalAchievePlan}
            onChange={(e) => handleInputChange(e, "goalAchievePlan")}
            placeholder="Describe what you would like to do to achieve your goal"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Last Day Implementation */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            How are you going to implement this on your last day?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.lastDayImplementation}
            onChange={(e) => handleInputChange(e, "lastDayImplementation")}
            placeholder="Describe how you will implement this on your last day"
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
          <Button onClick={handleReset}>Reset</Button>
        </Col>
      </Row>
    </div>
  );
};

export default DayNine;