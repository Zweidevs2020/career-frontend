// import React, { useState, useEffect } from "react";
// import { Input, Button, DatePicker, Row, Col, message } from "antd";
// import { postApiWithoutAuth } from "../../utils/api"; // Assuming this is a utility for API calls
// import { API_URL } from "../../utils/constants";
// import moment from "moment"; // For date handling

// const DayThree = () => {
// const savedFormData = JSON.parse(
//   localStorage.getItem("dayThreeFormData")
// ) || {
//   date: null,
//   feelings: "",
//   jobs: ["", "", "", "", ""],
//   healthAndSafetyRules: "",
//   employeeResponsibilities: "",
//   thoughtsAndFeelings: "",
// };

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
//       {
//         question: "How did you feel going into work?",
//         answer: formData.feelings,
//       },
//       ...formData.jobs.map((job, index) => ({
//         question: `Job ${index + 1}`,
//         answer: job,
//       })),
//       {
//         question: "Are there any Health & Safety rules?",
//         answer: formData.healthAndSafetyRules,
//       },
//       {
//         question: "What responsibilities do you have for Health & Safety?",
//         answer: formData.employeeResponsibilities,
//       },
//       {
//         question: "What were your thoughts and feelings about the day?",
//         answer: formData.thoughtsAndFeelings,
//       },
//     ];

// //     if (questionsAndAnswers.length === 0) {
// //       message.error("At least one question must have an answer.");
// //       setLoading(false);
// //       return;
// //     }

//     const payload = [
//       {
//         day: "Day 3", // Send Day 3 in the payload
//         date: formData.date,
//         questionsAndAnswers: questionsAndAnswers,
//       },
//     ];
//     console.log(payload);
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
//       feelings: "",
//       jobs: ["", "", "", "", ""],
//       healthAndSafetyRules: "",
//       employeeResponsibilities: "",
//       thoughtsAndFeelings: "",
//     };
//     setFormData(initialFormData);
//     localStorage.setItem("dayThreeFormData", JSON.stringify(initialFormData)); // Reset localStorage
//   };

//   // Save form data to localStorage when formData changes
//   useEffect(() => {
//     localStorage.setItem("dayThreeFormData", JSON.stringify(formData));
//   }, [formData]);

//   return (
//     <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
//       <h2 className="font-bold text-lg">Day 3</h2>
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

//         {/* Feelings */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             How did you feel going into work?
//           </label>
//           <Input.TextArea
//             rows={4}
//             value={formData.feelings}
//             onChange={(e) => handleInputChange(e, "feelings")}
//             placeholder="Describe your feelings"
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

//         {/* Health and Safety Rules */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             Are there any Health & Safety rules?
//           </label>
//           <Input.TextArea
//             rows={4}
//             value={formData.healthAndSafetyRules}
//             onChange={(e) => handleInputChange(e, "healthAndSafetyRules")}
//             placeholder="Enter health and safety rules"
//             style={{ marginTop: "8px" }}
//           />
//         </Col>

//         {/* Employee Responsibilities */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             What responsibilities as an employee do you have for Health &
//             Safety?
//           </label>
//           <Input.TextArea
//             rows={4}
//             value={formData.employeeResponsibilities}
//             onChange={(e) => handleInputChange(e, "employeeResponsibilities")}
//             placeholder="Describe your responsibilities"
//             style={{ marginTop: "8px" }}
//           />
//         </Col>

//         {/* Thoughts and Feelings */}
//         <Col span={24}>
//           <label style={{ fontWeight: "bold", marginTop: "16px" }}>
//             What were your thoughts and feelings about the day?
//           </label>
//           <Input.TextArea
//             rows={4}
//             value={formData.thoughtsAndFeelings}
//             onChange={(e) => handleInputChange(e, "thoughtsAndFeelings")}
//             placeholder="Describe your thoughts and feelings"
//             style={{ marginTop: "8px" }}
//           />
//         </Col>

//         {/* Submit and Reset Buttons */}
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

// export default DayThree;

import React, { useState, useEffect } from "react";
import { Input, Button, DatePicker, Row, Col, message } from "antd";
import {
  getApiWithAuth,
  postApiWithoutAuth,
  putApiWithAuth,
} from "../../utils/api"; // Assuming this is a utility for API calls
import { API_URL } from "../../utils/constants";
import moment from "moment"; // For date handling

const DayThree = () => {
  const savedFormData = {
    date: null,
    feelings: "",
    jobs: ["", "", "", "", ""],
    healthAndSafetyRules: "",
    employeeResponsibilities: "",
    thoughtsAndFeelings: "",
  };
  const [formData, setFormData] = useState(savedFormData);
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  // Handle date change
  const handleDateChange = (date, dateString) => {
    setFormData({ ...formData, date: dateString });
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
            day: "Day3",
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
          updatedFormData.feelings = answer;
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
        case "Are there any Health & Safety rules?":
          updatedFormData.healthAndSafetyRules = answer;
          break;
        case "What responsibilities do you have for Health & Safety?":
          updatedFormData.employeeResponsibilities = answer;
          break;
        case "What were your thoughts and feelings about the day?":
          updatedFormData.thoughtsAndFeelings = answer;
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
      const response = await getApiWithAuth(`${API_URL.WORK_DIARY}?day=Day3`);
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
  //     {
  //       question: "How did you feel going into work?",
  //       answer: formData.feelings,
  //     },
  //     ...formData.jobs.map((job, index) => ({
  //       question: `Job ${index + 1}`,
  //       answer: job,
  //     })),
  //     {
  //       question: "Are there any Health & Safety rules?",
  //       answer: formData.healthAndSafetyRules,
  //     },
  //     {
  //       question: "What responsibilities do you have for Health & Safety?",
  //       answer: formData.employeeResponsibilities,
  //     },
  //     {
  //       question: "What were your thoughts and feelings about the day?",
  //       answer: formData.thoughtsAndFeelings,
  //     },
  //   ];

  //   if (questionsAndAnswers.length === 0) {
  //     message.error("At least one question must have an answer.");
  //     setLoading(false);
  //     return;
  //   }

  //   const payload = [
  //     {
  //       day: "Day3",
  //       date: formData.date || "", // Default empty date if not provided
  //       questionsAndAnswers: questionsAndAnswers,
  //     },
  //   ];
  //   const updatePayload = {
  //     day: "Day3",
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
  //     const url = `${API_URL.WORK_DIARY}update-day/?day=Day3`;
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

    // Check if the required fields are empty
    const isEmpty =
      !formData.date || // Date is required
      !formData.feelings || // Feelings field is required
      !formData.healthAndSafetyRules || // Health & Safety rules are required
      !formData.employeeResponsibilities || // Responsibilities for Health & Safety are required
      !formData.thoughtsAndFeelings || // Thoughts and feelings field is required
      formData.jobs.some((job) => !job); // Ensure none of the jobs are empty

    // If any required field is empty, show error and stop submission
    // if (isEmpty) {
    //   message.error("Please fill in all the required fields.");
    //   setLoading(false);
    //   return;
    // }

    // Prepare questions and answers array
    const questionsAndAnswers = [
      {
        question: "How did you feel going into work?",
        answer: formData.feelings,
      },
      ...formData.jobs.map((job, index) => ({
        question: `Job ${index + 1}`,
        answer: job,
      })),
      {
        question: "Are there any Health & Safety rules?",
        answer: formData.healthAndSafetyRules,
      },
      {
        question: "What responsibilities do you have for Health & Safety?",
        answer: formData.employeeResponsibilities,
      },
      {
        question: "What were your thoughts and feelings about the day?",
        answer: formData.thoughtsAndFeelings,
      },
    ];

    // Prepare the payload for POST or PUT
    const payload = [
      {
        day: "Day3", // Adjust the day dynamically as needed
        date: formData.date || "", // Default empty date if not provided
        questionsAndAnswers: questionsAndAnswers,
      },
    ];

    const updatePayload = {
      day: "Day3", // Adjust the day dynamically as needed
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
        const url = `${API_URL.WORK_DIARY}update-day/?day=Day3`; // Adjust day dynamically as needed
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

  // Handle form reset
  const handleReset = () => {
    const initialFormData = {
      date: null,
      feelings: "",
      jobs: ["", "", "", "", ""],
      healthAndSafetyRules: "",
      employeeResponsibilities: "",
      thoughtsAndFeelings: "",
    };
    setFormData(initialFormData);
    localStorage.setItem("dayThreeFormData", JSON.stringify(initialFormData)); // Reset localStorage
  };

  useEffect(() => {
    fetchDiary();
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2 className="font-bold text-lg">Day 3</h2>
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

        {/* Feelings */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            How did you feel going into work?
          </label>
          <Input.TextArea
            rows={4}
            value={formData.feelings}
            onChange={(e) => handleInputChange(e, "feelings")}
            placeholder="Describe your feelings"
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

        {/* Health and Safety Rules */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            Are there any Health & Safety rules?
          </label>
          <Input.TextArea
            rows={4}
            value={formData.healthAndSafetyRules}
            onChange={(e) => handleInputChange(e, "healthAndSafetyRules")}
            placeholder="Enter health and safety rules"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Employee Responsibilities */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What responsibilities as an employee do you have for Health &
            Safety?
          </label>
          <Input.TextArea
            rows={4}
            value={formData.employeeResponsibilities}
            onChange={(e) => handleInputChange(e, "employeeResponsibilities")}
            placeholder="Describe your responsibilities"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Thoughts and Feelings */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            What were your thoughts and feelings about the day?
          </label>
          <Input.TextArea
            rows={4}
            value={formData.thoughtsAndFeelings}
            onChange={(e) => handleInputChange(e, "thoughtsAndFeelings")}
            placeholder="Describe your thoughts and feelings"
            style={{ marginTop: "8px" }}
          />
        </Col>

        {/* Submit and Reset Buttons */}
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

export default DayThree;
