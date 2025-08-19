// import React, { useState, useEffect } from "react";
// import { Input, Button, DatePicker, Row, Col, message } from "antd";
// import { postApiWithoutAuth } from "../../utils/api"; // Assuming you have a helper for API calls
// import { API_URL } from "../../utils/constants"; // Assuming API_URL is defined
// import moment from "moment"; // To handle date format

// const DaySeven = () => {
//   // Load saved data from localStorage or set initial values
//   const savedFormData = JSON.parse(
//     localStorage.getItem("daySevenFormData")
//   ) || {
//     date: null,
//     jobs: ["", "", "", "", ""],
//     skillsNeeded: "",
//     skillsFit: "",
//     furtherEducation: "",
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

//   // Handle form submission
//   const handleSubmit = async () => {
//     setLoading(true);

// const questionsAndAnswers = [
//   ...formData.jobs.map((job, index) => ({
//     question: `Job ${index + 1}`,
//     answer: job,
//   })),
//   {
//     question: "What skills are needed for your job?",
//     answer: formData.skillsNeeded,
//   },
//   {
//     question: "Do your skills fit this line of work? Why?",
//     answer: formData.skillsFit,
//   },
//   {
//     question: "Do you think you need further education?",
//     answer: formData.furtherEducation,
//   },
//   {
//     question: "What were your thoughts and feelings about the day?",
//     answer: formData.thoughtsAndFeelings,
//   },
// ];

// if (questionsAndAnswers.length === 0) {
//   message.error("At least one question must have an answer.");
//   setLoading(false);
//   return;
// }

//     const payload = [
//       {
//         day: "Day 7", // Send Day 7 in the payload
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
//       skillsNeeded: "",
//       skillsFit: "",
//       furtherEducation: "",
//       thoughtsAndFeelings: "",
//     };
//     setFormData(initialFormData);
//     localStorage.setItem("daySevenFormData", JSON.stringify(initialFormData)); // Reset localStorage
//   };

//   // Save form data to localStorage when formData changes
//   useEffect(() => {
//     localStorage.setItem("daySevenFormData", JSON.stringify(formData));
//   }, [formData]);

//   return (
//     <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
//       <h2 className="font-bold text-lg">Day 7</h2>
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

//         {/* Skills Needed */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             What skills are needed for your job?
//           </label>
//           <Input.TextArea
//             rows={3}
//             value={formData.skillsNeeded}
//             onChange={(e) => handleInputChange(e, "skillsNeeded")}
//             placeholder="Describe the skills needed for your job"
//             style={{ marginTop: "8px" }}
//           />
//         </Col>

//         {/* Skills Fit */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             Do your skills fit this line of work? Why?
//           </label>
//           <Input.TextArea
//             rows={3}
//             value={formData.skillsFit}
//             onChange={(e) => handleInputChange(e, "skillsFit")}
//             placeholder="Explain if your skills fit this line of work and why"
//             style={{ marginTop: "8px" }}
//           />
//         </Col>

//         {/* Further Education */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             Do you think you need further education?
//           </label>
//           <Input.TextArea
//             rows={3}
//             value={formData.furtherEducation}
//             onChange={(e) => handleInputChange(e, "furtherEducation")}
//             placeholder="Explain if you think you need further education"
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

// export default DaySeven;

import React, { useState, useEffect } from "react";
import { Input, Button, DatePicker, Row, Col, message } from "antd";
import {
  getApiWithAuth,
  postApiWithoutAuth,
  putApiWithAuth,
} from "../../utils/api"; // Assuming you have a helper for API calls
import { API_URL } from "../../utils/constants"; // Assuming API_URL is defined
import moment from "moment"; // To handle date format

const DaySeven = () => {
  const savedFormData = {
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
        case "Job 1":
          updatedFormData.jobs[0] = answer;
          break;
        case "Job 2":
          updatedFormData.jobs[1] = answer;
          break;
        case "Job 3":
          updatedFormData.jobs[2] = answer;
          break;
        case "What skills are needed for your job?":
          updatedFormData.skillsNeeded = answer;
          break;
        case "Do your skills fit this line of work? Why?":
          updatedFormData.skillsFit = answer;
          break;
        case "Do you think you need further education?":
          updatedFormData.furtherEducation = answer;
          break;
        case "What were your thoughts and feelings about the day?":
          updatedFormData.thoughtsAndFeelings = answer;
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
      const response = await getApiWithAuth(`${API_URL.WORK_DIARY}?day=Day7`);
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

    // Check if the required fields are empty
    const isEmpty =
      !formData.date || // Date is required
      !formData.skillsNeeded || // Skills needed is required
      !formData.skillsFit || // Skills fit is required
      !formData.furtherEducation || // Further education is required
      !formData.thoughtsAndFeelings || // Thoughts and feelings are required
      formData.jobs.every((job) => !job); // Ensure at least one job is filled

    // If any required field is empty, show error and stop submission
    // if (isEmpty) {
    //   message.error("Please fill in all the required fields.");
    //   setLoading(false);
    //   return;
    // }

    // Prepare the questions and answers array
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

    // Prepare the payload for POST or PUT
    const payload = [
      {
        day: "Day7", // Adjust the day dynamically as needed
        date: formData.date || "", // Default empty date if not provided
        questionsAndAnswers: questionsAndAnswers,
      },
    ];

    const updatePayload = {
      day: "Day7", // Adjust the day dynamically as needed
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
        const url = `${API_URL.WORK_DIARY}update-day/?day=Day7`; // Adjust day dynamically as needed
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
      skillsNeeded: "",
      skillsFit: "",
      furtherEducation: "",
      thoughtsAndFeelings: "",
    };
    setFormData(initialFormData);
  };

  useEffect(() => {
    fetchDiary();
  }, []);

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
