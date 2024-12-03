// import React, { useState, useEffect } from "react";
// import { Input, Button, DatePicker, Row, Col, Radio, message } from "antd";
// import { postApiWithoutAuth } from "../../utils/api"; // Assuming you have a helper for API calls
// import { API_URL } from "../../utils/constants"; // Assuming API_URL is defined
// import moment from "moment"; // To handle date format

// const DaySix = () => {
//   // Load saved data from localStorage or set initial values
//   const savedFormData = JSON.parse(localStorage.getItem("daySixFormData")) || {
//     date: null,
//     feeling: "",
//     jobs: ["", "", "", "", ""],
//     taskLevel: "",
//     taskExplanation: "",
//     thoughtsAndFeelings: "",
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

//   // Handle radio button change for task level
//   const handleRadioChange = (e) => {
//     setFormData({ ...formData, taskLevel: e.target.value });
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
//     question: "How did you feel going in to work?",
//     answer: formData.feeling,
//   },
//   {
//     question:
//       "Are you given tasks equal, above, or below your skill level?",
//     answer: formData.taskLevel,
//   },
//   {
//     question:
//       "Explain why you feel tasks are equal, above, or below your skill level",
//     answer: formData.taskExplanation,
//   },
//   {
//     question: "What were your thoughts and feelings about the day?",
//     answer: formData.thoughtsAndFeelings,
//   },
// ];

//     if (questionsAndAnswers.length === 0) {
//       message.error("At least one question must have an answer.");
//       setLoading(false);
//       return;
//     }

//     const payload = [
//       {
//         day: "Day 6", // Send Day 6 in the payload
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
//       feeling: "",
//       jobs: ["", "", "", "", ""],
//       taskLevel: "",
//       taskExplanation: "",
//       thoughtsAndFeelings: "",
//     };
//     setFormData(initialFormData);
//     localStorage.setItem("daySixFormData", JSON.stringify(initialFormData)); // Reset localStorage
//   };

//   // Save form data to localStorage when formData changes
//   useEffect(() => {
//     localStorage.setItem("daySixFormData", JSON.stringify(formData));
//   }, [formData]);

//   return (
//     <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
//       <h2 className="font-bold text-lg">Day 6</h2>
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

//         {/* Feeling */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             How did you feel going in to work?
//           </label>
//           <Input.TextArea
//             rows={3}
//             value={formData.feeling}
//             onChange={(e) => handleInputChange(e, "feeling")}
//             placeholder="Describe how you felt going in to work"
//             style={{ marginTop: "8px" }}
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

//         {/* Task Level */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             Are you given tasks equal, above, or below your skill level?
//           </label>
//           <Radio.Group
//             onChange={handleRadioChange}
//             value={formData.taskLevel}
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginTop: "8px",
//             }}
//           >
//             <Radio value="Equal">Equal</Radio>
//             <Radio value="Above">Above</Radio>
//             <Radio value="Below">Below</Radio>
//           </Radio.Group>
//         </Col>

//         {/* Task Explanation */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             Explain:
//           </label>
//           <Input.TextArea
//             rows={3}
//             value={formData.taskExplanation}
//             onChange={(e) => handleInputChange(e, "taskExplanation")}
//             placeholder="Explain why you feel tasks are equal, above, or below your skill level"
//             style={{ marginTop: "8px" }}
//           />
//         </Col>

//         {/* Thoughts and Feelings */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             What were your thoughts and feelings about the day?
//           </label>
//           <Input.TextArea
//             rows={3}
//             value={formData.thoughtsAndFeelings}
//             onChange={(e) => handleInputChange(e, "thoughtsAndFeelings")}
//             placeholder="Share your thoughts and feelings about the day"
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

// export default DaySix;
import React, { useState, useEffect } from "react";
import { Input, Button, DatePicker, Row, Col, Radio, message } from "antd";
import {
  getApiWithAuth,
  postApiWithoutAuth,
  putApiWithAuth,
} from "../../utils/api";
import { API_URL } from "../../utils/constants";
import moment from "moment";

const DaySix = () => {
  const savedFormData = {
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
        case "How did you feel going into work?":
          updatedFormData.feeling = answer;
          break;
        case "Are you given tasks equal, above, or below your skill level?":
          updatedFormData.taskLevel = answer;
          break;
        case "Explain why you feel tasks are equal, above, or below your skill level":
          updatedFormData.taskExplanation = answer;
          break;
        case "What were your thoughts and feelings about the day?":
          updatedFormData.thoughtsAndFeelings = answer;
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
      const response = await getApiWithAuth(`${API_URL.WORK_DIARY}?day=Day6`);
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
      !formData.feeling || // Feeling is required
      !formData.taskLevel || // Task level is required
      !formData.taskExplanation || // Task explanation is required
      !formData.thoughtsAndFeelings || // Thoughts and feelings are required
      formData.jobs.some((job) => !job); // Ensure none of the jobs are empty

    // If any required field is empty, show error and stop submission
    if (isEmpty) {
      message.error("Please fill in all the required fields.");
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
        question: "How did you feel going into work?",
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

    // Prepare the payload for POST or PUT
    const payload = [
      {
        day: "Day6", // Adjust the day dynamically as needed
        date: formData.date || "", // Default empty date if not provided
        questionsAndAnswers: questionsAndAnswers,
      },
    ];

    const updatePayload = {
      day: "Day6", // Adjust the day dynamically as needed
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
        const url = `${API_URL.WORK_DIARY}update-day/?day=Day6`; // Adjust day dynamically as needed
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
      feeling: "",
      jobs: ["", "", "", "", ""],
      taskLevel: "",
      taskExplanation: "",
      thoughtsAndFeelings: "",
    };
    setFormData(initialFormData);
    localStorage.setItem("daySixFormData", JSON.stringify(initialFormData)); // Reset localStorage
  };
  useEffect(() => {
    fetchDiary();
  }, []);
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
