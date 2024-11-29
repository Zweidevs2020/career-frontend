// import React, { useState, useEffect } from "react";
// import { Row, Col, Button, Input, Radio, DatePicker, message } from "antd";
// import { postApiWithoutAuth } from "../../utils/api"; // Assuming this is a utility for API calls
// import { API_URL } from "../../utils/constants";
// import moment from "moment"; // For date handling

// const DayTwo = () => {
//   // Initialize form data with the values from localStorage (if any)
//   const savedFormData = JSON.parse(localStorage.getItem("dayTwoFormData")) || {
//     day: "Day 2",
//     onTime: "",
//     reasonForLateness: "",
//     whoMetOnArrival: "",
//     supervisorName: "",
//     peopleCount: "",
//     jobs: ["", "", "", "", ""],
//     ableToDoTasks: "",
//     breakTimes: "",
//     lunchActivity: "",
//     date: "",
//   };

//   const [formData, setFormData] = useState(savedFormData);
//   const [loading, setLoading] = useState(false);

//   // Handle input changes (both text inputs and arrays)
//   const handleInputChange = (event, index = null, fieldGroup = null) => {
//     const { name, value } = event.target;
//     if (index !== null && fieldGroup) {
//       const updatedGroup = [...formData[fieldGroup]];
//       updatedGroup[index] = value;
//       setFormData({ ...formData, [fieldGroup]: updatedGroup });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   // Handle date change
//   const handleDateChange = (date, dateString) => {
//     setFormData({ ...formData, date: dateString });
//   };

//   // Handle form submission
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);

//     const questionsAndAnswers = [
//       { question: "Were you on time?", answer: formData.onTime },
//       formData.onTime === "No" && {
//         question: "Why were you late?",
//         answer: formData.reasonForLateness,
//       },
//       {
//         question: "Who did you meet on arrival?",
//         answer: formData.whoMetOnArrival,
//       },
//       { question: "Supervisor Name", answer: formData.supervisorName },
//       {
//         question: "Number of People Working With",
//         answer: formData.peopleCount,
//       },
//       ...formData.jobs.map((job, index) => ({
//         question: `Job ${index + 1}`,
//         answer: job,
//       })),
//       {
//         question: "Were you able to do the tasks? Why?",
//         answer: formData.ableToDoTasks,
//       },
//       { question: "Break Times", answer: formData.breakTimes },
//       {
//         question: "What did you do at lunchtime?",
//         answer: formData.lunchActivity,
//       },
//     ].filter(Boolean); // Filter out undefined answers (e.g., when reasonForLateness is not provided)

//     if (questionsAndAnswers.length === 0) {
//       message.error("At least one question must have an answer.");
//       setLoading(false);
//       return;
//     }

//     // Prepare the payload
//     const payload = [
//       {
//         day: "Day 2",
//         date: formData.date,
//         questionsAndAnswers: questionsAndAnswers,
//       },
//     ];
//     console.log(payload);
//     try {
//       const apiUrl = API_URL.WORK_DIARY;
//       const response = await postApiWithoutAuth(
//         apiUrl,
//         payload // Sending the array of one day
//       );
//       message.success("Data submitted successfully!");
//     } catch (error) {
//       message.error("Something went wrong. Please try again.");
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle form reset
//   const handleReset = () => {
//     const initialFormData = {
//       onTime: "",
//       reasonForLateness: "",
//       whoMetOnArrival: "",
//       supervisorName: "",
//       peopleCount: "",
//       jobs: ["", "", "", "", ""],
//       ableToDoTasks: "",
//       breakTimes: "",
//       lunchActivity: "",
//       date: "",
//     };
//     setFormData(initialFormData);
//     localStorage.setItem("dayTwoFormData", JSON.stringify(initialFormData)); // Reset localStorage
//   };

//   // UseEffect to save form data to localStorage whenever formData changes
//   useEffect(() => {
//     localStorage.setItem("dayTwoFormData", JSON.stringify(formData));
//   }, [formData]);

//   return (
//     <form
//       onSubmit={handleSubmit}
//       style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}
//     >
//       <h3 className="font-bold text-lg">Day 2</h3>
//       <Row gutter={[16, 24]}>
//         <Col span={24}>
//           <label style={{ fontWeight: "bold" }}>Date:</label>
//           <DatePicker
//             style={{ width: "100%", marginTop: "8px" }}
//             onChange={handleDateChange}
//             value={formData.date ? moment(formData.date) : null}
//           />
//         </Col>

//         {/* Were you on time? */}
//         <Col span={24}>
//           <label style={{ display: "block", marginBottom: "8px" }}>
//             Were you on time?
//           </label>
//           <Radio.Group
//             name="onTime"
//             value={formData.onTime}
//             onChange={handleInputChange}
//             style={{ display: "flex", gap: "16px" }}
//           >
//             <Radio value="Yes">Yes</Radio>
//             <Radio value="No">No</Radio>
//           </Radio.Group>
//         </Col>

//         {/* Reason for Lateness if "No" */}
//         {formData.onTime === "No" && (
//           <Col span={24}>
//             <label style={{ display: "block", marginBottom: "8px" }}>
//               Why were you late?
//             </label>
//             <Input.TextArea
//               name="reasonForLateness"
//               value={formData.reasonForLateness}
//               onChange={handleInputChange}
//               rows={4}
//               placeholder="Provide an explanation"
//             />
//           </Col>
//         )}

//         {/* Who did you meet on arrival? */}
//         <Col span={24}>
//           <label style={{ display: "block", marginBottom: "8px" }}>
//             Who did you meet on arrival?
//           </label>
//           <Input
//             name="whoMetOnArrival"
//             value={formData.whoMetOnArrival}
//             onChange={handleInputChange}
//             placeholder="Who did you meet?"
//           />
//         </Col>

//         {/* Supervisor Name */}
//         <Col span={24}>
//           <label style={{ display: "block", marginBottom: "8px" }}>
//             Supervisor Name:
//           </label>
//           <Input
//             name="supervisorName"
//             value={formData.supervisorName}
//             onChange={handleInputChange}
//             placeholder="Enter supervisor's name"
//           />
//         </Col>

//         {/* Number of People Working With */}
//         <Col span={24}>
//           <label style={{ display: "block", marginBottom: "8px" }}>
//             Number of People Working With:
//           </label>
//           <Input
//             name="peopleCount"
//             value={formData.peopleCount}
//             onChange={handleInputChange}
//             placeholder="Enter the number of people working with you"
//           />
//         </Col>

//         {/* Jobs Done */}
//         <Col span={24}>
//           <fieldset style={{ border: "1px solid #d9d9d9", padding: "16px" }}>
//             <legend>List the Jobs You Did:</legend>
//             <Row gutter={[16, 16]}>
//               {formData.jobs.map((job, index) => (
//                 <Col span={12} key={index}>
//                   <label>Job {index + 1}:</label>
//                   <Input
//                     type="text"
//                     value={job}
//                     onChange={(e) => handleInputChange(e, index, "jobs")}
//                     placeholder={`Job ${index + 1}`}
//                   />
//                 </Col>
//               ))}
//             </Row>
//           </fieldset>
//         </Col>

//         {/* Were you able to do the tasks? */}
//         <Col span={24}>
//           <label style={{ display: "block", marginBottom: "8px" }}>
//             Were you able to do the tasks? Why?
//           </label>
//           <Input.TextArea
//             name="ableToDoTasks"
//             value={formData.ableToDoTasks}
//             onChange={handleInputChange}
//             rows={4}
//             placeholder="Explain why you were able or not able to do the tasks"
//           />
//         </Col>

//         {/* Break Times */}
//         <Col span={24}>
//           <label style={{ display: "block", marginBottom: "8px" }}>
//             Break Times:
//           </label>
//           <Input
//             name="breakTimes"
//             value={formData.breakTimes}
//             onChange={handleInputChange}
//             placeholder="Describe your break times"
//           />
//         </Col>

//         {/* Lunchtime Activity */}
//         <Col span={24}>
//           <label style={{ display: "block", marginBottom: "8px" }}>
//             What did you do at lunchtime?
//           </label>
//           <Input.TextArea
//             name="lunchActivity"
//             value={formData.lunchActivity}
//             onChange={handleInputChange}
//             rows={4}
//             placeholder="Describe what you did at lunchtime"
//           />
//         </Col>

//         {/* Submit and Reset Buttons */}
//         <Col span={24} style={{ textAlign: "end", marginTop: "16px" }}>
//           <Button
//             className="border-blue-500"
//             htmlType="submit"
//             loading={loading}
//             style={{ marginRight: "8px" }}
//           >
//             Submit
//           </Button>
//           <Button type="default" onClick={handleReset}>
//             Reset
//           </Button>
//         </Col>
//       </Row>
//     </form>
//   );
// };

// export default DayTwo;

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

  // Compare formData with originalData to detect updates
  const isDataUpdated = () => {
    if (!originalData) return true; // Assume data is updated if there's no original data to compare with

    const currentData = JSON.stringify(formData);
    const original = JSON.stringify(originalData);

    return currentData !== original; // Return true if there are changes
  };

  // Populate form with API data
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
        // message.info("No data found. Created a default entry.");
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Check if the data is empty (e.g., no questionsAndAnswers or date)
    const isEmpty =
      !formData.date &&
      !formData.onTime &&
      !formData.reasonForLateness &&
      !formData.whoMetOnArrival &&
      !formData.ableToDoTasks &&
      !formData.supervisorName &&
      !formData.peopleCount &&
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
      const url = `${API_URL.WORK_DIARY}update-day/?day=Day2`;
      const respose = await putApiWithAuth(url, updatePayload);

      message.success("Data updated successfully!");
    } catch (error) {
      message.error("Something went wrong while updating data.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setLoading(true);

  //   if (!isDataUpdated()) {
  //     message.info("No changes detected. Skipping update.");
  //     setLoading(false);
  //     return;
  //   }

  // const questionsAndAnswers = [
  //   { question: "Were you on time?", answer: formData.onTime },
  //   formData.onTime === "No" && {
  //     question: "Why were you late?",
  //     answer: formData.reasonForLateness,
  //   },
  //   {
  //     question: "Who did you meet on arrival?",
  //     answer: formData.whoMetOnArrival,
  //   },
  //   { question: "Supervisor Name", answer: formData.supervisorName },
  //   {
  //     question: "Number of People Working With",
  //     answer: formData.peopleCount,
  //   },
  //   ...formData.jobs.map((job, index) => ({
  //     question: `Job ${index + 1}`,
  //     answer: job,
  //   })),
  //   {
  //     question: "Were you able to do the tasks? Why?",
  //     answer: formData.ableToDoTasks,
  //   },
  //   { question: "Break Times", answer: formData.breakTimes },
  //   {
  //     question: "What did you do at lunchtime?",
  //     answer: formData.lunchActivity,
  //   },
  // ].filter(Boolean);

  //   const payload = [
  //     {
  //       day: formData.day,
  //       date: formData.date || "",
  //       questionsAndAnswers,
  //     },
  //   ];

  //   try {
  //     const url = `${API_URL.WORK_DIARY}update-day/?day=${encodeURIComponent(
  //       formData.day
  //     )}`;
  //     await putApiWithAuth(url, payload);
  //     message.success("Data updated successfully!");
  //   } catch (error) {
  //     message.error("Error updating data.");
  //     console.error("Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
