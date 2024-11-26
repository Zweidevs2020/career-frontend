import React, { useState, useEffect } from "react";
import { Row, Col, Button, Input, Radio, DatePicker, message } from "antd";
import { postApiWithoutAuth } from "../../utils/api"; // Assuming this is a utility for API calls
import { API_URL } from "../../utils/constants";
import moment from "moment"; // For date handling

const DayTwo = () => {
  // Initialize form data with the values from localStorage (if any)
  const savedFormData = JSON.parse(localStorage.getItem("dayTwoFormData")) || {
    day: "Day 2",
    onTime: "",
    reasonForLateness: "",
    whoMetOnArrival: "",
    supervisorName: "",
    peopleCount: "",
    jobs: ["", "", "", "", ""],
    ableToDoTasks: "",
    breakTimes: "",
    lunchActivity: "",
    date: "",
  };

  const [formData, setFormData] = useState(savedFormData);
  const [loading, setLoading] = useState(false);

  // Handle input changes (both text inputs and arrays)
  const handleInputChange = (event, index = null, fieldGroup = null) => {
    const { name, value } = event.target;
    if (index !== null && fieldGroup) {
      const updatedGroup = [...formData[fieldGroup]];
      updatedGroup[index] = value;
      setFormData({ ...formData, [fieldGroup]: updatedGroup });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle date change
  const handleDateChange = (date, dateString) => {
    setFormData({ ...formData, date: dateString });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const questionsAndAnswers = [
      { question: "Were you on time?", answer: formData.onTime },
      formData.onTime === "No" && {
        question: "Why were you late?",
        answer: formData.reasonForLateness,
      },
      {
        question: "Who did you meet on arrival?",
        answer: formData.whoMetOnArrival,
      },
      { question: "Supervisor Name", answer: formData.supervisorName },
      {
        question: "Number of People Working With",
        answer: formData.peopleCount,
      },
      ...formData.jobs.map((job, index) => ({
        question: `Job ${index + 1}`,
        answer: job,
      })),
      {
        question: "Were you able to do the tasks? Why?",
        answer: formData.ableToDoTasks,
      },
      { question: "Break Times", answer: formData.breakTimes },
      {
        question: "What did you do at lunchtime?",
        answer: formData.lunchActivity,
      },
    ].filter(Boolean); // Filter out undefined answers (e.g., when reasonForLateness is not provided)

    if (questionsAndAnswers.length === 0) {
      message.error("At least one question must have an answer.");
      setLoading(false);
      return;
    }

    // Prepare the payload
    const payload = [
      {
        day: "Day 2",
        date: formData.date,
        questionsAndAnswers: questionsAndAnswers,
      },
    ];
    console.log(payload);
    try {
      const apiUrl = API_URL.WORK_DIARY;
      const response = await postApiWithoutAuth(
        apiUrl,
        payload // Sending the array of one day
      );
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
      onTime: "",
      reasonForLateness: "",
      whoMetOnArrival: "",
      supervisorName: "",
      peopleCount: "",
      jobs: ["", "", "", "", ""],
      ableToDoTasks: "",
      breakTimes: "",
      lunchActivity: "",
      date: "",
    };
    setFormData(initialFormData);
    localStorage.setItem("dayTwoFormData", JSON.stringify(initialFormData)); // Reset localStorage
  };

  // UseEffect to save form data to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem("dayTwoFormData", JSON.stringify(formData));
  }, [formData]);

  return (
    <form
      onSubmit={handleSubmit}
      style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <h3 className="font-bold text-lg">Day 2</h3>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <label style={{ fontWeight: "bold" }}>Date:</label>
          <DatePicker
            style={{ width: "100%", marginTop: "8px" }}
            onChange={handleDateChange}
            value={formData.date ? moment(formData.date) : null}
          />
        </Col>

        {/* Were you on time? */}
        <Col span={24}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Were you on time?
          </label>
          <Radio.Group
            name="onTime"
            value={formData.onTime}
            onChange={handleInputChange}
            style={{ display: "flex", gap: "16px" }}
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </Radio.Group>
        </Col>

        {/* Reason for Lateness if "No" */}
        {formData.onTime === "No" && (
          <Col span={24}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Why were you late?
            </label>
            <Input.TextArea
              name="reasonForLateness"
              value={formData.reasonForLateness}
              onChange={handleInputChange}
              rows={4}
              placeholder="Provide an explanation"
            />
          </Col>
        )}

        {/* Who did you meet on arrival? */}
        <Col span={24}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Who did you meet on arrival?
          </label>
          <Input
            name="whoMetOnArrival"
            value={formData.whoMetOnArrival}
            onChange={handleInputChange}
            placeholder="Who did you meet?"
          />
        </Col>

        {/* Supervisor Name */}
        <Col span={24}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Supervisor Name:
          </label>
          <Input
            name="supervisorName"
            value={formData.supervisorName}
            onChange={handleInputChange}
            placeholder="Enter supervisor's name"
          />
        </Col>

        {/* Number of People Working With */}
        <Col span={24}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Number of People Working With:
          </label>
          <Input
            name="peopleCount"
            value={formData.peopleCount}
            onChange={handleInputChange}
            placeholder="Enter the number of people working with you"
          />
        </Col>

        {/* Jobs Done */}
        <Col span={24}>
          <fieldset style={{ border: "1px solid #d9d9d9", padding: "16px" }}>
            <legend>List the Jobs You Did:</legend>
            <Row gutter={[16, 16]}>
              {formData.jobs.map((job, index) => (
                <Col span={12} key={index}>
                  <label>Job {index + 1}:</label>
                  <Input
                    type="text"
                    value={job}
                    onChange={(e) => handleInputChange(e, index, "jobs")}
                    placeholder={`Job ${index + 1}`}
                  />
                </Col>
              ))}
            </Row>
          </fieldset>
        </Col>

        {/* Were you able to do the tasks? */}
        <Col span={24}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Were you able to do the tasks? Why?
          </label>
          <Input.TextArea
            name="ableToDoTasks"
            value={formData.ableToDoTasks}
            onChange={handleInputChange}
            rows={4}
            placeholder="Explain why you were able or not able to do the tasks"
          />
        </Col>

        {/* Break Times */}
        <Col span={24}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Break Times:
          </label>
          <Input
            name="breakTimes"
            value={formData.breakTimes}
            onChange={handleInputChange}
            placeholder="Describe your break times"
          />
        </Col>

        {/* Lunchtime Activity */}
        <Col span={24}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            What did you do at lunchtime?
          </label>
          <Input.TextArea
            name="lunchActivity"
            value={formData.lunchActivity}
            onChange={handleInputChange}
            rows={4}
            placeholder="Describe what you did at lunchtime"
          />
        </Col>

        {/* Submit and Reset Buttons */}
        <Col span={24} style={{ textAlign: "end", marginTop: "16px" }}>
          <Button
            className="border-blue-500"
            htmlType="submit"
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
    </form>
  );
};

export default DayTwo;
