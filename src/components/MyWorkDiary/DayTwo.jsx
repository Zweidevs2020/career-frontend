import React, { useState, useEffect } from "react";
import { Row, Col, Button, Input, Radio, DatePicker, message } from "antd";
import {
  postApiWithoutAuth,
  putApiWithAuth,
  getApiWithAuth,
} from "../../utils/api";
import { API_URL } from "../../utils/constants";
import moment from "moment";

const DayTwo = () => {
  const [formData, setFormData] = useState({
    day: "Day2",
    date: "",
    onTime: "",
    reasonForLateness: "",
    whoMetOnArrival: "",
    supervisorName: "",
    peopleCount: "",
    jobs: ["", "", "", "", ""],
    ableToDoTasks: "",
    breakTimes: "",
    lunchActivity: "",
  });

  const [originalData, setOriginalData] = useState(null); // To store the original fetched data
  const [loading, setLoading] = useState(false);

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

    setFormData(updatedFormData);
    setOriginalData(updatedFormData); // Store the original fetched data for comparison
  };

  // Fetch existing diary data
  const fetchDiary = async () => {
    try {
      const response = await getApiWithAuth(
        `${API_URL.WORK_DIARY}?day=${encodeURIComponent(formData.day)}`
      );
      if (response?.data?.data) {
        populateForm(response.data.data);
      }
    } catch (error) {
      message.error("Error fetching diary data.");
      console.error("Error:", error);
    }
  };

  // Handle form submission
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setLoading(true);

  //   // Check if the data is empty (e.g., no questionsAndAnswers or date)
  //   const isEmpty =
  //     !formData.date &&
  //     !formData.onTime &&
  //     !formData.reasonForLateness &&
  //     !formData.whoMetOnArrival &&
  //     !formData.ableToDoTasks &&
  //     !formData.supervisorName &&
  //     !formData.peopleCount &&
  //     !formData.breakTimes &&
  //     !formData.lunchActivity &&
  //     formData.jobs.every((job) => !job); // Check if all jobs are empty
  //   const questionsAndAnswers = [
  //     { question: "Were you on time?", answer: formData.onTime },
  //     formData.onTime === "No" && {
  //       question: "Why were you late?",
  //       answer: formData.reasonForLateness,
  //     },
  //     {
  //       question: "Who did you meet on arrival?",
  //       answer: formData.whoMetOnArrival,
  //     },
  //     { question: "Supervisor Name", answer: formData.supervisorName },
  //     {
  //       question: "Number of People Working With",
  //       answer: formData.peopleCount,
  //     },
  //     ...formData.jobs.map((job, index) => ({
  //       question: `Job ${index + 1}`,
  //       answer: job,
  //     })),
  //     {
  //       question: "Were you able to do the tasks? Why?",
  //       answer: formData.ableToDoTasks,
  //     },
  //     { question: "Break Times", answer: formData.breakTimes },
  //     {
  //       question: "What did you do at lunchtime?",
  //       answer: formData.lunchActivity,
  //     },
  //   ].filter(Boolean);

  //   const payload = [
  //     {
  //       day: formData.day,
  //       date: formData.date || "", // Default empty date if not provided
  //       questionsAndAnswers: questionsAndAnswers,
  //     },
  //   ];
  //   const updatePayload = {
  //     day: formData.day,
  //     date: formData.date || "", // Default empty date if not provided
  //     questionsAndAnswers: questionsAndAnswers,
  //   };
  //   if (isEmpty) {
  //     // If data is empty, post a default payload
  //     try {
  //       if (isEmpty) {
  //         message.error("Please fill the data!");
  //         return;
  //       } else {
  //         const apiUrl = API_URL.WORK_DIARY;
  //         await postApiWithoutAuth(apiUrl, payload);
  //       }
  //     } catch (error) {
  //       message.error("Something went wrong while submitting empty data.");
  //       console.error("Error:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //     return; // Exit the function as we have handled the empty case
  //   }

  //   // Check if data exists (patch case)
  //   try {
  //     const url = `${API_URL.WORK_DIARY}update-day/?day=Day2`;
  //     const respose = await putApiWithAuth(url, updatePayload);

  //     message.success("Data updated successfully!");
  //   } catch (error) {
  //     message.error("Something went wrong while updating data.");
  //     console.error("Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // Check if "Were you on time?" is "No" and the "Why were you late?" field is empty
    if (formData.onTime === "No" && !formData.reasonForLateness) {
      message.error("Please provide an explanation for being late.");
      setLoading(false);
      return; // Exit the function without proceeding
    }
    // Check if the data is empty
    const isEmpty =
      !formData.date ||
      !formData.onTime ||
      (formData.onTime === "No" && !formData.reasonForLateness) || // If "No", reason is required
      !formData.whoMetOnArrival ||
      !formData.ableToDoTasks ||
      !formData.supervisorName ||
      !formData.peopleCount ||
      !formData.breakTimes ||
      !formData.lunchActivity ||
      formData.jobs.some((job) => !job); // Check if any job is empty

    // If any required field is empty, show error and stop the submission
    // if (isEmpty) {
    //   message.error("Please fill in all the required fields.");
    //   setLoading(false); // Stop loading
    //   return; // Exit the function without making the API call
    // }

    // Prepare the questions and answers array
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
    ].filter(Boolean); // Filter out any null or undefined values (conditional questions)

    // Prepare the payload for POST or PUT
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

    // If data is empty (i.e., no `date` or `questionsAndAnswers`), make a POST request
    if (!formData.date) {
      try {
        const apiUrl = API_URL.WORK_DIARY;
        await postApiWithoutAuth(apiUrl, payload);
        message.success("Data submitted successfully!");
      } catch (error) {
        message.error("Something went wrong while submitting data.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      // If data exists (i.e., the `date` exists), make a PUT request to update
      try {
        const url = `${API_URL.WORK_DIARY}update-day/?day=Day2`; // Adjust day dynamically as needed
        const response = await putApiWithAuth(url, updatePayload);
        message.success("Data updated successfully!");
      } catch (error) {
        message.error("Something went wrong while updating data.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Reset form to initial state
  const handleReset = () => {
    setFormData({
      day: "Day2",
      date: "",
      onTime: "",
      reasonForLateness: "",
      whoMetOnArrival: "",
      supervisorName: "",
      peopleCount: "",
      jobs: ["", "", "", "", ""],
      ableToDoTasks: "",
      breakTimes: "",
      lunchActivity: "",
    });
  };

  // Fetch diary data on mount
  useEffect(() => {
    fetchDiary();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <h3 className="font-bold text-lg">Day 2</h3>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <label>Date:</label>
          <DatePicker
            style={{ width: "100%" }}
            onChange={(date, dateString) =>
              setFormData({ ...formData, date: dateString })
            }
            value={formData.date ? moment(formData.date) : null}
          />
        </Col>
        <Col span={24}>
          <label>Were you on time?</label>
          <Radio.Group
            value={formData.onTime}
            onChange={(e) =>
              setFormData({ ...formData, onTime: e.target.value })
            }
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </Radio.Group>
        </Col>
        {formData.onTime === "No" && (
          <Col span={24}>
            <label>Why were you late?</label>
            <Input
              value={formData.reasonForLateness}
              onChange={(e) =>
                setFormData({ ...formData, reasonForLateness: e.target.value })
              }
              placeholder="Provide a reason"
            />
          </Col>
        )}
        <Col span={24}>
          <label>Who did you meet on arrival?</label>
          <Input
            value={formData.whoMetOnArrival}
            onChange={(e) =>
              setFormData({ ...formData, whoMetOnArrival: e.target.value })
            }
            placeholder="Enter name"
          />
        </Col>
        <Col span={24}>
          <label>Supervisor Name:</label>
          <Input
            value={formData.supervisorName}
            onChange={(e) =>
              setFormData({ ...formData, supervisorName: e.target.value })
            }
            placeholder="Enter supervisor's name"
          />
        </Col>
        <Col span={24}>
          <label>Number of People Working With:</label>
          <Input
            value={formData.peopleCount}
            onChange={(e) =>
              setFormData({ ...formData, peopleCount: e.target.value })
            }
            placeholder="Enter the number of people"
          />
        </Col>
        <Col span={24}>
          <fieldset style={{ border: "1px solid #d9d9d9", padding: "16px" }}>
            <legend>Jobs Completed:</legend>
            <Row gutter={[16, 16]}>
              {formData.jobs.map((job, index) => (
                <Col span={12} key={index}>
                  <label>Job {index + 1}:</label>
                  <Input
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
        <Col span={24}>
          <label>Were you able to do the tasks? Why?</label>
          <Input.TextArea
            value={formData.ableToDoTasks}
            onChange={(e) =>
              setFormData({ ...formData, ableToDoTasks: e.target.value })
            }
            rows={4}
            placeholder="Explain if you were able to do the tasks"
          />
        </Col>
        <Col span={24}>
          <label>Break Times:</label>
          <Input.TextArea
            value={formData.breakTimes}
            onChange={(e) =>
              setFormData({ ...formData, breakTimes: e.target.value })
            }
            rows={4}
            placeholder="Describe your break times"
          />
        </Col>
        <Col span={24}>
          <label>What did you do at lunchtime?</label>
          <Input.TextArea
            value={formData.lunchActivity}
            onChange={(e) =>
              setFormData({ ...formData, lunchActivity: e.target.value })
            }
            rows={4}
            placeholder="Describe what you did at lunchtime"
          />
        </Col>
        <Col span={24} style={{ textAlign: "end" }}>
          <Button htmlType="submit" loading={loading}>
            Submit
          </Button>
          <Button style={{ marginLeft: "8px" }} onClick={handleReset}>
            Reset
          </Button>
        </Col>
      </Row>
    </form>
  );
};

export default DayTwo;
