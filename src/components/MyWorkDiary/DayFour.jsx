// import React, { useState, useEffect } from "react";
// import { Input, Button, DatePicker, Row, Col, message } from "antd";
// import { postApiWithoutAuth } from "../../utils/api"; // Assuming this is a utility for API calls
// import { API_URL } from "../../utils/constants"; // Assuming API_URL is correctly defined
// import moment from "moment"; // For date handling

// const DayFour = () => {
//   // Load saved data from localStorage or set initial values
//   const savedFormData = JSON.parse(localStorage.getItem("dayFourFormData")) || {
//     date: null,
//     jobs: ["", "", "", "", ""],
//     workHours: "",
//     missingDayConsequences: "",
//     coworkerInteractions: "",
//     thoughtsAndFeelings: "",
//     improvementSuggestions: "",
//   };

//   const [formData, setFormData] = useState(savedFormData);
//   const [loading, setLoading] = useState(false);

//   // Handle date change
//   const handleDateChange = (date, dateString) => {
//     setFormData({ ...formData, date: dateString });
//   };

//   // Handle input change for both text and job fields
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

//     const questionsAndAnswers = [
//       ...formData.jobs.map((job, index) => ({
//         question: `Job ${index + 1}`,
//         answer: job,
//       })),
//       {
//         question: "What hours do people work in the company?",
//         answer: formData.workHours,
//       },
//       {
//         question: "What happens if you miss a day?",
//         answer: formData.missingDayConsequences,
//       },
//       {
//         question: "How are you getting on with the people you work with?",
//         answer: formData.coworkerInteractions,
//       },
//       {
//         question: "What were your thoughts and feelings about the day?",
//         answer: formData.thoughtsAndFeelings,
//       },
//       {
//         question:
//           "What could you do differently to improve your work experience?",
//         answer: formData.improvementSuggestions,
//       },
//     ];

//     if (questionsAndAnswers.length === 0) {
//       message.error("At least one question must have an answer.");
//       setLoading(false);
//       return;
//     }

//     const payload = [
//       {
//         day: "Day 4", // Send Day 4 in the payload
//         date: formData.date,
//         questionsAndAnswers: questionsAndAnswers,
//       },
//     ];

//     try {
//       const apiUrl = API_URL.WORK_DIARY;
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
//       workHours: "",
//       missingDayConsequences: "",
//       coworkerInteractions: "",
//       thoughtsAndFeelings: "",
//       improvementSuggestions: "",
//     };
//     setFormData(initialFormData);
//     localStorage.setItem("dayFourFormData", JSON.stringify(initialFormData)); // Reset localStorage
//   };

//   // Save form data to localStorage when formData changes
//   useEffect(() => {
//     localStorage.setItem("dayFourFormData", JSON.stringify(formData));
//   }, [formData]);

//   return (
//     <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
//       <h2 className="font-bold text-lg">Day 4</h2>
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

//         {/* Work Hours */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             What hours do people work in the company?
//           </label>
//           <Input.TextArea
//             rows={3}
//             value={formData.workHours}
//             onChange={(e) => handleInputChange(e, "workHours")}
//             placeholder="Describe work hours in the company"
//             style={{ marginTop: "8px" }}
//           />
//         </Col>

//         {/* Missing a Day */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             What happens if you miss a day?
//           </label>
//           <Input.TextArea
//             rows={3}
//             value={formData.missingDayConsequences}
//             onChange={(e) => handleInputChange(e, "missingDayConsequences")}
//             placeholder="Explain the consequences of missing a day"
//             style={{ marginTop: "8px" }}
//           />
//         </Col>

//         {/* Coworker Interactions */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             How are you getting on with the people you work with?
//           </label>
//           <Input.TextArea
//             rows={3}
//             value={formData.coworkerInteractions}
//             onChange={(e) => handleInputChange(e, "coworkerInteractions")}
//             placeholder="Describe your interactions with coworkers"
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
//             placeholder="Share your thoughts and feelings"
//             style={{ marginTop: "8px" }}
//           />
//         </Col>

//         {/* Improvement Suggestions */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             What could you do differently to improve your work experience?
//           </label>
//           <Input.TextArea
//             rows={3}
//             value={formData.improvementSuggestions}
//             onChange={(e) => handleInputChange(e, "improvementSuggestions")}
//             placeholder="Suggest improvements for your work experience"
//             style={{ marginTop: "8px" }}
//           />
//         </Col>

//         {/* Submit and Reset Buttons */}
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

// export default DayFour;
import React, { useState, useEffect } from "react";
import { Input, Button, DatePicker, Row, Col, message } from "antd";
import {
  getApiWithAuth,
  postApiWithoutAuth,
  putApiWithAuth,
} from "../../utils/api"; // Assuming this is a utility for API calls
import { API_URL } from "../../utils/constants"; // Assuming API_URL is correctly defined
import moment from "moment"; // For date handling

const DayFour = () => {
  // Load saved data from localStorage or set initial values
  const savedFormData = {
    date: null,
    jobs: ["", "", "", "", ""],
    workHours: "",
    missingDayConsequences: "",
    coworkerInteractions: "",
    thoughtsAndFeelings: "",
    improvementSuggestions: "",
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
        case "What hours do people work in the company?":
          updatedFormData.workHours = answer;
          break;
        case "What happens if you miss a day?":
          updatedFormData.missingDayConsequences = answer;
          break;
        case "How are you getting on with the people you work with?":
          updatedFormData.coworkerInteractions = answer;
          break;
        case "What were your thoughts and feelings about the day?":
          updatedFormData.thoughtsAndFeelings = answer;
          break;
        case "What could you do differently to improve your work experience?":
          updatedFormData.improvementSuggestions = answer;
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
      const response = await getApiWithAuth(`${API_URL.WORK_DIARY}?day=Day4`);
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

    // Check if any of the required fields are empty
    const isEmpty =
      !formData.date || // Date is required
      !formData.workHours || // Work hours is required
      !formData.missingDayConsequences || // Missing day consequences is required
      !formData.coworkerInteractions || // Coworker interactions is required
      !formData.thoughtsAndFeelings || // Thoughts and feelings is required
      !formData.improvementSuggestions || // Improvement suggestions is required
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
        question: "What hours do people work in the company?",
        answer: formData.workHours,
      },
      {
        question: "What happens if you miss a day?",
        answer: formData.missingDayConsequences,
      },
      {
        question: "How are you getting on with the people you work with?",
        answer: formData.coworkerInteractions,
      },
      {
        question: "What were your thoughts and feelings about the day?",
        answer: formData.thoughtsAndFeelings,
      },
      {
        question:
          "What could you do differently to improve your work experience?",
        answer: formData.improvementSuggestions,
      },
    ];

    // Prepare the payload for POST or PUT
    const payload = [
      {
        day: "Day4", // Adjust the day dynamically as needed
        date: formData.date || "", // Default empty date if not provided
        questionsAndAnswers: questionsAndAnswers,
      },
    ];

    const updatePayload = {
      day: "Day4", // Adjust the day dynamically as needed
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
        const url = `${API_URL.WORK_DIARY}update-day/?day=Day4`; // Adjust day dynamically as needed
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
      workHours: "",
      missingDayConsequences: "",
      coworkerInteractions: "",
      thoughtsAndFeelings: "",
      improvementSuggestions: "",
    };
    setFormData(initialFormData);
  };

  useEffect(() => {
    fetchDiary();
  }, []);
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2 className="font-bold text-lg">Day 4</h2>
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

        {/* Work Hours */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What hours do people work in the company?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.workHours}
            onChange={(e) => handleInputChange(e, "workHours")}
            placeholder="Describe work hours in the company"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Missing a Day */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What happens if you miss a day?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.missingDayConsequences}
            onChange={(e) => handleInputChange(e, "missingDayConsequences")}
            placeholder="Explain the consequences of missing a day"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Coworker Interactions */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            How are you getting on with the people you work with?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.coworkerInteractions}
            onChange={(e) => handleInputChange(e, "coworkerInteractions")}
            placeholder="Describe your interactions with coworkers"
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
            placeholder="Share your thoughts and feelings"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Improvement Suggestions */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What could you do differently to improve your work experience?
          </label>
          <Input.TextArea
            rows={3}
            value={formData.improvementSuggestions}
            onChange={(e) => handleInputChange(e, "improvementSuggestions")}
            placeholder="Suggest improvements for your work experience"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Submit and Reset Buttons */}
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

export default DayFour;
