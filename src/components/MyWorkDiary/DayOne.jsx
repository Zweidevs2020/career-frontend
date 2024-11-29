import React, { useEffect, useState } from "react";
import { Row, Col, Button, Input, Radio, message, DatePicker } from "antd";
import {
  getApiWithAuth,
  postApiWithoutAuth,
  putApiWithAuth,
} from "../../utils/api";
import { API_URL } from "../../utils/constants";
import moment from "moment";

const DayOne = () => {
  const [formData, setFormData] = useState({
    day: "Day1",
    date: "",
    onTime: "",
    supervisorName: "",
    peopleCount: "",
    jobs: ["", "", "", "", ""],
    ableToDoTasks: "",
    breakTimes: "",
    lunchActivity: "",
    thoughts: "",
    reasonForLateness: "",
    whoMetOnArrival: "",
  });
  const [loading, setLoading] = useState(false);

  const populateForm = async (data) => {
    const updatedFormData = { ...formData };

    // Check if the data is completely empty
    const isEmptyData =
      !data[0]?.date && // Check if the date is missing
      (!data[0]?.questionsAndAnswers ||
        data[0]?.questionsAndAnswers.length === 0); // Check if questionsAndAnswers is empty or doesn't exist

    if (isEmptyData) {
      // If data is empty, call the POST API with default empty data
      try {
        const payload = [
          {
            day: formData.day,
            date: formData.date || "", // Default to empty if not available
            questionsAndAnswers: [],
          },
        ];

        const apiUrl = API_URL.WORK_DIARY;
        await postApiWithoutAuth(apiUrl, payload);
        message.info(
          "No data from backend. Created a new entry with default values."
        );
      } catch (error) {
        message.error("Failed to create a new entry. Please try again.");
        console.error("Error posting default data:", error);
      }
      return; // Exit the function as there's no data to populate
    }

    // If data is available, process it and populate the form
    if (data[0]?.date) {
      // Parse and store the date separately
      updatedFormData.date = moment(data[0]?.date).format("YYYY-MM-DD");
    }

    data[0]?.questionsAndAnswers?.forEach(({ question, answer }) => {
      switch (question) {
        case "Were you on time?":
          updatedFormData.onTime = answer;
          break;
        case "Why were you late?":
          updatedFormData.reasonForLateness = answer;
          break;
        case "Who did you meet on arrival?":
          updatedFormData.whoMetOnArrival = answer;
          break;
        case "Supervisor Name":
          updatedFormData.supervisorName = answer;
          break;
        case "Number of People Working With":
          updatedFormData.peopleCount = answer;
          break;
        case "Were you able to do the tasks? Why?":
          updatedFormData.ableToDoTasks = answer;
          break;
        case "Break Times":
          updatedFormData.breakTimes = answer;
          break;
        case "What did you do at lunchtime?":
          updatedFormData.lunchActivity = answer;
          break;
        case "Additional Thoughts":
          updatedFormData.thoughts = answer;
          break;
        default:
          if (question.startsWith("Job")) {
            const jobIndex = parseInt(question.replace("Job ", "")) - 1;
            if (jobIndex >= 0 && jobIndex < updatedFormData.jobs.length) {
              updatedFormData.jobs[jobIndex] = answer;
            }
          }
          break;
      }
    });

    // Save the updated data to the backend using PATCH

    // Finally, set the populated form data
    setFormData(updatedFormData);
  };

  // Fetch diary data from API
  const fetchDiary = async () => {
    let url = `${API_URL.WORK_DIARY}?day=${formData.day}`;
    url = decodeURIComponent(url);

    try {
      const response = await getApiWithAuth(url);

      if (response?.data?.data) {
        populateForm(response.data?.data);
      }
    } catch (error) {
      console.error("Error fetching diary data:", error);
      message.error("Failed to load diary data.");
    }
  };

  // Submit the form data
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Check if the data is empty (e.g., no questionsAndAnswers or date)
    const isEmpty =
      !formData.date &&
      !formData.onTime &&
      !formData.supervisorName &&
      !formData.peopleCount &&
      !formData.ableToDoTasks &&
      !formData.breakTimes &&
      !formData.lunchActivity &&
      formData.jobs.every((job) => !job); // Check if all jobs are empty
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
    ].filter(Boolean);

    const payload = [
      {
        day: formData.day,
        date: formData.date || "", // Default empty date if not provided
        questionsAndAnswers: questionsAndAnswers,
      },
    ];
    const updatePayload = {
      day: formData.day,
      date: formData.date || "", // Default empty date if not provided
      questionsAndAnswers: questionsAndAnswers,
    };
    if (isEmpty) {
      // If data is empty, post a default payload
      try {
        const apiUrl = API_URL.WORK_DIARY;
        await postApiWithoutAuth(apiUrl, payload);
        message.success("Empty data submitted successfully!");
      } catch (error) {
        message.error("Something went wrong while submitting empty data.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
      return; // Exit the function as we have handled the empty case
    }

    // Check if data exists (patch case)
    try {
      const url = `${API_URL.WORK_DIARY}update-day/?day=Day1`;
      const respose = await putApiWithAuth(url, updatePayload);

      message.success("Data updated successfully!");
    } catch (error) {
      message.error("Something went wrong while updating data.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset the form data to initial state
  const handleReset = () => {
    setFormData({
      day: "Day1",
      date: "",
      onTime: "",
      supervisorName: "",
      peopleCount: "",
      jobs: ["", "", "", "", ""],
      ableToDoTasks: "",
      breakTimes: "",
      lunchActivity: "",
      thoughts: "",
      reasonForLateness: "",
      whoMetOnArrival: "",
    });
  };

  useEffect(() => {
    fetchDiary();
  }, [formData.day]);

  return (
    <form
      onSubmit={handleSubmit}
      style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <h3 className="font-bold text-lg">Day 1</h3>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <label style={{ fontWeight: "bold" }}>Date:</label>
          <DatePicker
            style={{ width: "100%", marginTop: "8px" }}
            onChange={(date, dateString) =>
              setFormData({ ...formData, date: dateString })
            }
            value={formData.date ? moment(formData.date) : null}
          />
        </Col>

        <Col span={24}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Were you on time?
          </label>
          <Radio.Group
            name="onTime"
            value={formData.onTime}
            onChange={(e) =>
              setFormData({ ...formData, onTime: e.target.value })
            }
            style={{ display: "flex", gap: "16px" }}
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </Radio.Group>
        </Col>

        {formData.onTime === "No" && (
          <Col span={24}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Why were you late?
            </label>
            <Input
              type="text"
              name="reasonForLateness"
              value={formData.reasonForLateness}
              onChange={(e) =>
                setFormData({ ...formData, reasonForLateness: e.target.value })
              }
              placeholder="Explain the reason for lateness"
            />
          </Col>
        )}

        <Col span={24}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Who did you meet on arrival?
          </label>
          <Input
            type="text"
            name="whoMetOnArrival"
            value={formData.whoMetOnArrival}
            onChange={(e) =>
              setFormData({ ...formData, whoMetOnArrival: e.target.value })
            }
            placeholder="Enter the name of the person you met"
          />
        </Col>

        {/* Supervisor Name */}
        <Col span={24}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Supervisor Name:
          </label>
          <Input
            type="text"
            name="supervisorName"
            value={formData.supervisorName}
            onChange={(e) =>
              setFormData({ ...formData, supervisorName: e.target.value })
            }
            placeholder="Enter supervisor's name"
          />
        </Col>

        {/* People Count */}
        <Col span={24}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Number of People Working With:
          </label>
          <Input
            type="number"
            name="peopleCount"
            value={formData.peopleCount}
            onChange={(e) =>
              setFormData({ ...formData, peopleCount: e.target.value })
            }
            placeholder="Enter the number"
          />
        </Col>

        {/* Jobs Done */}
        <Col span={24}>
          <fieldset style={{ border: "1px solid #d9d9d9", padding: "16px" }}>
            <legend>Jobs Done on First Day:</legend>
            <Row gutter={[16, 16]}>
              {formData.jobs.map((job, index) => (
                <Col span={12} key={index}>
                  <label>Job {index + 1}:</label>
                  <Input
                    type="text"
                    value={job}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jobs: formData.jobs.map((j, idx) =>
                          idx === index ? e.target.value : j
                        ),
                      })
                    }
                    placeholder={`Job ${index + 1}`}
                  />
                </Col>
              ))}
            </Row>
          </fieldset>
        </Col>
        {/* Able to Do Tasks */}
        <Col span={24}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Were you able to do them? Why?
          </label>
          <Input.TextArea
            name="ableToDoTasks"
            value={formData.ableToDoTasks}
            onChange={(e) =>
              setFormData({ ...formData, ableToDoTasks: e.target.value })
            }
            rows={4}
            placeholder="Explain if you were able to do them."
          />
        </Col>

        {/* Break Times */}
        <Col span={24}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Break Times:
          </label>
          <Input.TextArea
            name="breakTimes"
            value={formData.breakTimes}
            onChange={(e) =>
              setFormData({ ...formData, breakTimes: e.target.value })
            }
            rows={4}
            placeholder="Describe your break times."
          />
        </Col>

        {/* Lunch Activity */}
        <Col span={24}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            What did you do at lunchtime?
          </label>
          <Input.TextArea
            name="lunchActivity"
            value={formData.lunchActivity}
            onChange={(e) =>
              setFormData({ ...formData, lunchActivity: e.target.value })
            }
            rows={4}
            placeholder="Describe your lunch activity."
          />
        </Col>

        <Col span={24} className="text-end">
          <Button
            htmlType="submit"
            loading={loading}
            style={{ marginTop: "20px" }}
          >
            Submit
          </Button>
          <Button
            type="default"
            onClick={handleReset}
            style={{ marginLeft: "16px", marginTop: "20px" }}
          >
            Reset
          </Button>
        </Col>
      </Row>
    </form>
  );
};

export default DayOne;
