// import React, { useEffect, useState } from "react";
// import { Row, Col, Button, Input, Radio, message, DatePicker } from "antd";
// import { getApiWithAuth, postApiWithoutAuth } from "../../utils/api";
// import { API_URL } from "../../utils/constants";

// const DayOne = () => {
//   const [formData, setFormData] = useState({
//     day: "Day 1",
//     date: "",
//     onTime: "",
//     supervisorName: "",
//     peopleCount: "",
//     jobs: ["", "", "", "", ""],
//     ableToDoTasks: "",
//     breakTimes: "",
//     lunchActivity: "",
//     thoughts: "",
//     reasonForLateness: "",
//     whoMetOnArrival: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState();
//   const handleInputChange = (event, index = null) => {
//     const { name, value } = event.target;
//     if (index !== null) {
//       const updatedJobs = [...formData.jobs];
//       updatedJobs[index] = value;
//       setFormData({ ...formData, jobs: updatedJobs });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleDateChange = (date, dateString) => {
//     setFormData({ ...formData, date: dateString });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);

//     // Validate that required fields are filled
//     if (!formData.date) {
//       message.error("Date is required.");
//       setLoading(false);
//       return;
//     }

//     if (!formData.day) {
//       message.error("Day is required.");
//       setLoading(false);
//       return;
//     }

//     if (!formData.onTime) {
//       message.error("On-time status is required.");
//       setLoading(false);
//       return;
//     }

//     // Prepare questions and answers
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
//         day: formData.day,
//         date: formData.date,
//         questionsAndAnswers: questionsAndAnswers,
//       },
//     ];

//     try {
//       const apiUrl = API_URL.WORK_DIARY;
//       const response = await postApiWithoutAuth(
//         apiUrl,
//         payload // Sending the array of one day
//       );
//     } catch (error) {
//       message.error("Something went wrong. Please try again.");
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const fetchDiary = async () => {
//     let url = `${API_URL.WORK_DIARY}?day=${formData.day}`;
//     url = decodeURIComponent(url);

//     const response = await getApiWithAuth(url);
//     setData(response);
//   };

//   useEffect(() => {
//     fetchDiary();
//   }, []);
//   console.log(data.data.data, "data");
//   return (
//     <form
//       onSubmit={handleSubmit}
//       style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}
//     >
//       <h3 className="font-bold text-lg">Day 1</h3>
//       <Row gutter={[16, 24]}>
//         <Col span={24}>
//           <label style={{ fontWeight: "bold" }}>Date:</label>
//           <DatePicker
//             style={{ width: "100%", marginTop: "8px" }}
//             onChange={handleDateChange}
//           />
//         </Col>

//         {/* On Time */}
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

//         {/* Conditional Field: Reason for Lateness */}
//         {formData.onTime === "No" && (
//           <Col span={24}>
//             <label style={{ display: "block", marginBottom: "8px" }}>
//               Why were you late?
//             </label>
//             <Input
//               type="text"
//               name="reasonForLateness"
//               value={formData.reasonForLateness}
//               onChange={handleInputChange}
//               placeholder="Explain the reason for lateness"
//             />
//           </Col>
//         )}

//         {/* Who Did You Meet on Arrival */}
//         <Col span={24}>
//           <label style={{ display: "block", marginBottom: "8px" }}>
//             Who did you meet on arrival?
//           </label>
//           <Input
//             type="text"
//             name="whoMetOnArrival"
//             value={formData.whoMetOnArrival}
//             onChange={handleInputChange}
//             placeholder="Enter the name of the person"
//           />
//         </Col>

//         {/* Supervisor Name */}
//         <Col span={24}>
//           <label style={{ display: "block", marginBottom: "8px" }}>
//             Supervisor Name:
//           </label>
//           <Input
//             type="text"
//             name="supervisorName"
//             value={formData.supervisorName}
//             onChange={handleInputChange}
//             placeholder="Enter supervisor's name"
//           />
//         </Col>

//         {/* People Count */}
//         <Col span={24}>
//           <label style={{ display: "block", marginBottom: "8px" }}>
//             Number of People Working With:
//           </label>
//           <Input
//             type="number"
//             name="peopleCount"
//             value={formData.peopleCount}
//             onChange={handleInputChange}
//             placeholder="Enter the number"
//           />
//         </Col>

//         {/* Jobs Done */}
//         <Col span={24}>
//           <fieldset style={{ border: "1px solid #d9d9d9", padding: "16px" }}>
//             <legend>Jobs Done on First Day:</legend>
//             <Row gutter={[16, 16]}>
//               {formData.jobs.map((job, index) => (
//                 <Col span={12} key={index}>
//                   <label>Job {index + 1}:</label>
//                   <Input
//                     type="text"
//                     value={job}
//                     onChange={(e) => handleInputChange(e, index)}
//                     placeholder={`Job ${index + 1}`}
//                   />
//                 </Col>
//               ))}
//             </Row>
//           </fieldset>
//         </Col>

// {/* Able to Do Tasks */}
// <Col span={24}>
//   <label style={{ display: "block", marginBottom: "8px" }}>
//     Were you able to do them? Why?
//   </label>
//   <Input.TextArea
//     name="ableToDoTasks"
//     value={formData.ableToDoTasks}
//     onChange={handleInputChange}
//     rows={4}
//     placeholder="Explain if you were able to do them."
//   />
// </Col>

// {/* Break Times */}
// <Col span={24}>
//   <label style={{ display: "block", marginBottom: "8px" }}>
//     Break Times:
//   </label>
//   <Input.TextArea
//     name="breakTimes"
//     value={formData.breakTimes}
//     onChange={handleInputChange}
//     rows={4}
//     placeholder="Describe your break times."
//   />
// </Col>

// {/* Lunch Activity */}
// <Col span={24}>
//   <label style={{ display: "block", marginBottom: "8px" }}>
//     What did you do at lunchtime?
//   </label>
//   <Input.TextArea
//     name="lunchActivity"
//     value={formData.lunchActivity}
//     onChange={handleInputChange}
//     rows={4}
//     placeholder="Describe your lunch activity."
//   />
// </Col>

//         <Col span={24}>
//           <Button
//             type="primary"
//             htmlType="submit"
//             loading={loading}
//             style={{ width: "100%" }}
//           >
//             Submit
//           </Button>
//         </Col>
//       </Row>
//     </form>
//   );
// };

// export default DayOne;

import React, { useEffect, useState } from "react";
import { Row, Col, Button, Input, Radio, message, DatePicker } from "antd";
import { getApiWithAuth, postApiWithoutAuth } from "../../utils/api";
import { API_URL } from "../../utils/constants";
import moment from "moment"; // Ensure that moment is imported for date handling

const DayOne = () => {
  // Initialize form data with the values from localStorage (if any)
  const savedFormData = JSON.parse(localStorage.getItem("formData")) || {
    day: "Day 1",
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
  };

  const [formData, setFormData] = useState(savedFormData);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const handleInputChange = (event, index = null) => {
    const { name, value } = event.target;
    if (index !== null) {
      const updatedJobs = [...formData.jobs];
      updatedJobs[index] = value;
      setFormData({ ...formData, jobs: updatedJobs });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateChange = (date, dateString) => {
    setFormData({ ...formData, date: dateString });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Validate that required fields are filled
    if (!formData.date) {
      message.error("Date is required.");
      setLoading(false);
      return;
    }

    if (!formData.day) {
      message.error("Day is required.");
      setLoading(false);
      return;
    }

    if (!formData.onTime) {
      message.error("On-time status is required.");
      setLoading(false);
      return;
    }

    // Prepare questions and answers
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
        day: formData.day,
        date: formData.date,
        questionsAndAnswers: questionsAndAnswers,
      },
    ];

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

  const handleReset = () => {
    // Reset the form data to its initial state and save it to localStorage
    const initialFormData = {
      day: "Day 1",
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
    };

    setFormData(initialFormData);

    // Save the reset data to localStorage to persist across refreshes
    localStorage.setItem("formData", JSON.stringify(initialFormData));
  };

  const fetchDiary = async () => {
    let url = `${API_URL.WORK_DIARY}?day=${formData.day}`;
    url = decodeURIComponent(url); // Make sure to decode the URL here

    const response = await getApiWithAuth(url);
    setData(response);
  };

  useEffect(() => {
    fetchDiary();
  }, []);

  useEffect(() => {
    // Save the form data to localStorage whenever it changes
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  console.log(data?.data, "data");

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
            onChange={handleDateChange}
            value={formData.date ? moment(formData.date) : null}
          />
        </Col>

        {/* On Time */}
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

        {/* Conditional Field: Reason for Lateness */}
        {formData.onTime === "No" && (
          <Col span={24}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Why were you late?
            </label>
            <Input
              type="text"
              name="reasonForLateness"
              value={formData.reasonForLateness}
              onChange={handleInputChange}
              placeholder="Explain the reason for lateness"
            />
          </Col>
        )}

        {/* Who Did You Meet on Arrival */}
        <Col span={24}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Who did you meet on arrival?
          </label>
          <Input
            type="text"
            name="whoMetOnArrival"
            value={formData.whoMetOnArrival}
            onChange={handleInputChange}
            placeholder="Enter the name of the person"
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
                    onChange={(e) => handleInputChange(e, index)}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
            rows={4}
            placeholder="Describe your lunch activity."
          />
        </Col>
        {/* Submit Button */}
        <Col span={24} style={{ marginTop: "16px", textAlign: "end" }}>
          <Button
            htmlType="submit"
            loading={loading}
            className="border-blue-500"
          >
            Submit
          </Button>
          <Button
            type="default"
            onClick={handleReset}
            style={{ marginLeft: "16px" }}
          >
            Reset
          </Button>
        </Col>
      </Row>
    </form>
  );
};

export default DayOne;
