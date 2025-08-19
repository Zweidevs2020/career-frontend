// import React, { useState, useEffect } from "react";
// import { Input, Button, DatePicker, Row, Col, Radio, message } from "antd";
// import { postApiWithoutAuth } from "../../utils/api"; // Assuming you have a helper for API calls
// import { API_URL } from "../../utils/constants"; // Assuming API_URL is defined
// import moment from "moment"; // To handle date format

// const DayFive = () => {
//   // Load saved data from localStorage or set initial values
//   const savedFormData = JSON.parse(localStorage.getItem("dayFiveFormData")) || {
//     date: null,
//     jobs: ["", "", "", "", ""],
//     goalProgress: "", // This will hold either "Yes" or "No"
//     whyProgress: "",
//     timekeeping: "",
//     presentation: "",
//     taskCompletion: "",
//     worstPart: "",
//     improvement: "",
//   };

//   const [formData, setFormData] = useState(savedFormData);
//   const [loading, setLoading] = useState(false);

//   // Handle date change
//   const handleDateChange = (date, dateString) => {
//     setFormData({ ...formData, date: dateString });
//   };

//   // Handle input changes for both text and job fields
//   const handleInputChange = (e, field, index = null) => {
//     const value = e.target.value;
//     if (index !== null) {
//       const updatedJobs = [...formData.jobs];
//       updatedJobs[index] = value;
//       setFormData({ ...formData, jobs: updatedJobs });
//     } else {
//       setFormData({ ...formData, [field]: value });
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     setLoading(true);

// const questionsAndAnswers = [
//   ...formData.jobs.map((job, index) => ({
//     question: `Job ${index + 1}`,
//     answer: job,
//   })),
//   {
//     question: "Have you made any progress on achieving your goal (p37)?",
//     answer: formData.goalProgress,
//   },
//   {
//     question: "Why did you make or not make progress?",
//     answer: formData.whyProgress,
//   },
//   {
//     question: "How was your timekeeping?",
//     answer: formData.timekeeping,
//   },
//   {
//     question: "What is your personal presentation like?",
//     answer: formData.presentation,
//   },
//   {
//     question: "How are you completing your tasks?",
//     answer: formData.taskCompletion,
//   },
//   {
//     question: "What was the worst part of the first five days?",
//     answer: formData.worstPart,
//   },
//   {
//     question: "How can you improve this for next week?",
//     answer: formData.improvement,
//   },
// ];

// if (questionsAndAnswers.length === 0) {
//   message.error("At least one question must have an answer.");
//   setLoading(false);
//   return;
// }

//     const payload = [
//       {
//         day: "Day 5", // Send Day 5 in the payload
//         date: formData.date,
//         questionsAndAnswers: questionsAndAnswers,
//       },
//     ];

//     try {
//       const apiUrl = API_URL.WORK_DIARY; // Assuming your API URL is in this constant
//       const response = await postApiWithoutAuth(apiUrl, payload);
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
//       date: null,
//       jobs: ["", "", "", "", ""],
//       goalProgress: "",
//       whyProgress: "",
//       timekeeping: "",
//       presentation: "",
//       taskCompletion: "",
//       worstPart: "",
//       improvement: "",
//     };
//     setFormData(initialFormData);
//     localStorage.setItem("dayFiveFormData", JSON.stringify(initialFormData)); // Reset localStorage
//   };

//   // Save form data to localStorage when formData changes
//   useEffect(() => {
//     localStorage.setItem("dayFiveFormData", JSON.stringify(formData));
//   }, [formData]);

//   return (
//     <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
//       <h2 className="font-bold text-lg">Day 5</h2>
//       <Row gutter={[16, 16]}>
//         {/* Date */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold" }}>Date:</label>
//           <DatePicker
//             style={{ width: "100%", marginTop: "8px" }}
//             onChange={handleDateChange}
//             value={formData.date ? moment(formData.date) : null}
//           />
//         </Col>

//         {/* Jobs */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             List the jobs you did:
//           </label>
//           <div style={{ marginTop: "8px" }}>
//             {formData.jobs.map((job, index) => (
//               <div key={index} style={{ marginBottom: "8px" }}>
//                 <label>Job {index + 1}:</label>
//                 <Input
//                   value={job}
//                   onChange={(e) => handleInputChange(e, "jobs", index)}
//                   placeholder={`Enter job ${index + 1}`}
//                   style={{ marginTop: "4px" }}
//                 />
//               </div>
//             ))}
//           </div>
//         </Col>

//         {/* Goal Progress (Radio Buttons for Yes/No) */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             Have you made any progress on achieving your goal (p37)?
//           </label>
//           <Radio.Group
//             value={formData.goalProgress}
//             onChange={(e) => handleInputChange(e, "goalProgress")}
//             style={{ marginTop: "8px" }}
//           >
//             <Radio value="Yes">Yes</Radio>
//             <Radio value="No">No</Radio>
//           </Radio.Group>
//         </Col>

//         {/* Why Progress */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>Why?</label>
//           <Input.TextArea
//             rows={3}
//             value={formData.whyProgress}
//             onChange={(e) => handleInputChange(e, "whyProgress")}
//             placeholder="Explain why you made or did not make progress"
//             style={{ marginTop: "8px" }}
//           />
//         </Col>

//         {/* Timekeeping */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             For your first week, how was your timekeeping?
//           </label>
//           <Input.TextArea
//             rows={2}
//             value={formData.timekeeping}
//             onChange={(e) => handleInputChange(e, "timekeeping")}
//             placeholder="Describe your timekeeping"
//             style={{ marginTop: "8px" }}
//           />
//         </Col>

//         {/* Personal Presentation */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             Personal Presentation?
//           </label>
//           <Input.TextArea
//             rows={2}
//             value={formData.presentation}
//             onChange={(e) => handleInputChange(e, "presentation")}
//             placeholder="Describe your personal presentation"
//             style={{ marginTop: "8px" }}
//           />
//         </Col>

//         {/* Ability to Complete Tasks */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             Ability to complete tasks?
//           </label>
//           <Input.TextArea
//             rows={2}
//             value={formData.taskCompletion}
//             onChange={(e) => handleInputChange(e, "taskCompletion")}
//             placeholder="Describe your task completion ability"
//             style={{ marginTop: "8px" }}
//           />
//         </Col>

//         {/* Worst Part */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             What was the worst part of the first five days?
//           </label>
//           <Input.TextArea
//             rows={3}
//             value={formData.worstPart}
//             onChange={(e) => handleInputChange(e, "worstPart")}
//             placeholder="Explain the worst part of the first five days"
//             style={{ marginTop: "8px" }}
//           />
//         </Col>

//         {/* Improvement */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             How can you improve this for next week?
//           </label>
//           <Input.TextArea
//             rows={3}
//             value={formData.improvement}
//             onChange={(e) => handleInputChange(e, "improvement")}
//             placeholder="Suggest improvements for the next week"
//             style={{ marginTop: "8px" }}
//           />
//         </Col>

//         {/* Submit Button */}
//         <Col span={24} style={{ textAlign: "right", marginTop: "16px" }}>
//           <Button
//             className="border-blue-500"
//             onClick={handleSubmit}
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
//     </div>
//   );
// };

// export default DayFive;

import React, { useState, useEffect } from "react";
import { Input, Button, DatePicker, Row, Col, Radio, message } from "antd";
import { API_URL } from "../../utils/constants"; // Assuming API_URL is defined
import moment from "moment"; // To handle date format
import {
  getApiWithAuth,
  postApiWithoutAuth,
  putApiWithAuth,
} from "../../utils/api";

const DayFive = () => {
  // Load saved data from localStorage or set initial values
  const savedFormData = {
    date: null,
    jobs: ["", "", "", "", ""],
    goalProgress: "", // This will hold either "Yes" or "No"
    whyProgress: "",
    timekeeping: "",
    presentation: "",
    taskCompletion: "",
    worstPart: "",
    improvement: "",
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
        case "Have you made any progress on achieving your goal (p37)?":
          updatedFormData.goalProgress = answer;
          break;
        case "Why did you make or not make progress?":
          updatedFormData.whyProgress = answer;
          break;
        case "How was your timekeeping?":
          updatedFormData.timekeeping = answer;
          break;
        case "What is your personal presentation like?":
          updatedFormData.presentation = answer;
          break;
        case "How are you completing your tasks?":
          updatedFormData.taskCompletion = answer;
          break;
        case "What was the worst part of the first five days?":
          updatedFormData.worstPart = answer;
          break;
        case "How can you improve this for next week?":
          updatedFormData.improvement = answer;
          break;
        default:
          if (question.startsWith("Job")) {
            const jobIndex = parseInt(question.replace("Job ", "")) - 1;
            if (jobIndex >= 0 && jobIndex < updatedFormData.jobs?.length) {
              updatedFormData.jobs[jobIndex] = answer;
            }
          }
          break;
      }
    });

    setFormData(updatedFormData);
  };

  // Fetch existing diary data
  const fetchDiary = async () => {
    try {
      const response = await getApiWithAuth(`${API_URL.WORK_DIARY}?day=Day5`);
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

    // Check if any required field is empty
    const isEmpty =
      !formData.date || // Date is required
      !formData.goalProgress || // Goal progress is required
      !formData.whyProgress || // Why progress is required if goal progress is "No"
      !formData.timekeeping || // Timekeeping is required
      !formData.presentation || // Presentation is required
      !formData.taskCompletion || // Task completion is required
      !formData.worstPart || // Worst part is required
      !formData.improvement || // Improvement is required
      formData.jobs.some((job) => !job); // Ensure none of the jobs are empty

    // If any required field is empty, show error and stop submission
    // if (isEmpty) {
    //   message.error("Please fill in all the required fields.");
    //   setLoading(false);
    //   return;
    // }

    // Check for conditional validation (e.g., if goalProgress is "No", whyProgress is required)
    if (formData.goalProgress === "No" && !formData.whyProgress) {
      message.error("Please provide a reason for not making progress.");
      setLoading(false);
      return;
    }

    // Prepare questions and answers array
    const questionsAndAnswers = [
      ...formData.jobs.map((job, index) => ({
        question: `Job ${index + 1}`,
        answer: job,
      })),
      {
        question: "Have you made any progress on achieving your goal (p37)?",
        answer: formData.goalProgress,
      },
      formData.goalProgress === "No" && {
        question: "Why did you make or not make progress?",
        answer: formData.whyProgress,
      },
      {
        question: "How was your timekeeping?",
        answer: formData.timekeeping,
      },
      {
        question: "What is your personal presentation like?",
        answer: formData.presentation,
      },
      {
        question: "How are you completing your tasks?",
        answer: formData.taskCompletion,
      },
      {
        question: "What was the worst part of the first five days?",
        answer: formData.worstPart,
      },
      {
        question: "How can you improve this for next week?",
        answer: formData.improvement,
      },
    ].filter(Boolean); // Remove any falsy entries (like the "Why" question if not needed)

    // Prepare the payload for POST or PUT
    const payload = [
      {
        day: "Day5", // Adjust the day dynamically as needed
        date: formData.date || "", // Default empty date if not provided
        questionsAndAnswers: questionsAndAnswers,
      },
    ];

    const updatePayload = {
      day: "Day5", // Adjust the day dynamically as needed
      date: formData.date || "", // Default empty date if not provided
      questionsAndAnswers: questionsAndAnswers,
    };

    // If the data is empty (i.e., no `date` or `questionsAndAnswers`), make a POST request
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
        const url = `${API_URL.WORK_DIARY}update-day/?day=Day5`; // Adjust day dynamically as needed
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

  // Handle form reset
  const handleReset = () => {
    const initialFormData = {
      date: null,
      jobs: ["", "", "", "", ""],
      goalProgress: "",
      whyProgress: "",
      timekeeping: "",
      presentation: "",
      taskCompletion: "",
      worstPart: "",
      improvement: "",
    };
    setFormData(initialFormData);
    localStorage.setItem("dayFiveFormData", JSON.stringify(initialFormData)); // Reset localStorage
  };

  useEffect(() => {
    fetchDiary();
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2 className="font-bold text-lg">Day 5</h2>
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

        {/* Goal Progress (Radio Buttons for Yes/No) */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Have you made any progress on achieving your goal (p37)?
          </label>
          <Radio.Group
            value={formData.goalProgress}
            onChange={(e) => handleInputChange(e, "goalProgress")}
            style={{ marginTop: "8px" }}
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </Radio.Group>
        </Col>

        {/* Why Progress */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>Why?</label>
          <Input.TextArea
            rows={3}
            value={formData.whyProgress}
            onChange={(e) => handleInputChange(e, "whyProgress")}
            placeholder="Explain why you made or did not make progress"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Timekeeping */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            For your first week, how was your timekeeping?
          </label>
          <Input.TextArea
            rows={2}
            value={formData.timekeeping}
            onChange={(e) => handleInputChange(e, "timekeeping")}
            placeholder="Describe your timekeeping"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Personal Presentation */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Personal Presentation?
          </label>
          <Input.TextArea
            rows={2}
            value={formData.presentation}
            onChange={(e) => handleInputChange(e, "presentation")}
            placeholder="Describe your personal presentation"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Ability to Complete Tasks */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Ability to complete tasks?
          </label>
          <Input.TextArea
            rows={2}
            value={formData.taskCompletion}
            onChange={(e) => handleInputChange(e, "taskCompletion")}
            placeholder="Describe your task completion ability"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Worst Part */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What was the worst part of the first five days?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.worstPart}
            onChange={(e) => handleInputChange(e, "worstPart")}
            placeholder="Explain the worst part of the first five days"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Improvement */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            How can you improve this for next week?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.improvement}
            onChange={(e) => handleInputChange(e, "improvement")}
            placeholder="Suggest improvements for the next week"
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

export default DayFive;
