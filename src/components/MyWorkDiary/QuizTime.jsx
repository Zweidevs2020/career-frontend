import React, { useState } from "react";
import { Radio, Button, Row, Col, Alert } from "antd";

const QuizTime = () => {
  const [answers, setAnswers] = useState({
    question1: null,
    question2: null,
    question3: null,
    question4: null,
    question5: null,
  });
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false); // To track if the quiz has been submitted

  const correctAnswers = {
    question1: "d", // All of the above
    question2: "d", // All of the above
    question3: "b", // Every day
    question4: "a", // True
    question5: "b", // How fashionable your shoes are
  };

  const handleRadioChange = (e, question) => {
    setAnswers({ ...answers, [question]: e.target.value });
  };

  const handleSubmit = async () => {
    let calculatedScore = 0;

    for (const [key, value] of Object.entries(answers)) {
      if (value === correctAnswers[key]) {
        calculatedScore += 1;
      }
    }
    setScore(calculatedScore);
    setSubmitted(true);

    // Prepare payload with both user answers and correct answers
    const payload = {
      answers: Object.entries(answers).map(([question, answer]) => ({
        question: question,
        userAnswer: answer,
        correctAnswer: correctAnswers[question],
      })),
    };

    try {
      // Dummy API endpoint
      const apiUrl = "https://jsonplaceholder.typicode.com/posts";

      // Post request with transformed data
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Response:", result);
      } else {
        console.error("Error:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleReset = () => {
    const initialFormData = {
      question1: null,
      question2: null,
      question3: null,
      question4: null,
      question5: null,
    };
    setAnswers(initialFormData);
    localStorage.setItem("quiz", JSON.stringify(initialFormData)); // Reset localStorage
  };
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2 className="font-bold text-lg">Quiz Time</h2>
      <Row gutter={[16, 16]}>
        {/* Question 1 */}
        <Col span={24}>
          <label style={{ fontWeight: "bold" }}>
            1. What format can you present your diary in?
          </label>
          <Radio.Group
            onChange={(e) => handleRadioChange(e, "question1")}
            value={answers.question1}
            style={{ display: "block", marginTop: "8px" }}
          >
            <Radio value="a">a) Hand written</Radio>
            <Radio value="b">b) Typed</Radio>
            <Radio value="c">c) Visual</Radio>
            <Radio value="d">d) All of the above</Radio>
          </Radio.Group>
          {submitted && (
            <p>Correct Answer: {correctAnswers.question1} - All of the above</p>
          )}
        </Col>

        {/* Question 2 */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            2. Your diary should focus on…
          </label>
          <Radio.Group
            onChange={(e) => handleRadioChange(e, "question2")}
            value={answers.question2}
            style={{ display: "block", marginTop: "8px" }}
          >
            <Radio value="a">a) Your thoughts</Radio>
            <Radio value="b">b) Your feelings</Radio>
            <Radio value="c">
              c) What you can do differently to improve your work experience
            </Radio>
            <Radio value="d">d) All of the above</Radio>
          </Radio.Group>
          {submitted && (
            <p>Correct Answer: {correctAnswers.question2} - All of the above</p>
          )}
        </Col>

        {/* Question 3 */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            3. How often should you complete your diary?
          </label>
          <Radio.Group
            onChange={(e) => handleRadioChange(e, "question3")}
            value={answers.question3}
            style={{ display: "block", marginTop: "8px" }}
          >
            <Radio value="a">a) Once a week</Radio>
            <Radio value="b">b) Every day</Radio>
            <Radio value="c">c) Just before the next class</Radio>
            <Radio value="d">d) Never, it’s not necessary</Radio>
          </Radio.Group>
          {submitted && (
            <p>Correct Answer: {correctAnswers.question3} - Every day</p>
          )}
        </Col>

        {/* Question 4 */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            4. Your work experience will be rated by your supervisor.
          </label>
          <Radio.Group
            onChange={(e) => handleRadioChange(e, "question4")}
            value={answers.question4}
            style={{ display: "block", marginTop: "8px" }}
          >
            <Radio value="a">a) True</Radio>
            <Radio value="b">b) False</Radio>
          </Radio.Group>
          {submitted && (
            <p>Correct Answer: {correctAnswers.question4} - True</p>
          )}
        </Col>

        {/* Question 5 */}
        <Col span={24}>
          <label style={{ fontWeight: "bold", marginTop: "16px" }}>
            5. Which one is not a part of your employer’s assessment criteria?
          </label>
          <Radio.Group
            onChange={(e) => handleRadioChange(e, "question5")}
            value={answers.question5}
            style={{ display: "block", marginTop: "8px" }}
          >
            <Radio value="a">a) Attendance & timekeeping</Radio>
            <Radio value="b">b) How fashionable your shoes are</Radio>
            <Radio value="c">c) Getting on with your supervisor/others</Radio>
            <Radio value="d">d) Your level of interest in the job</Radio>
          </Radio.Group>
          {submitted && (
            <p>
              Correct Answer: {correctAnswers.question5} - How fashionable your
              shoes are
            </p>
          )}
        </Col>

        {/* Submit Button */}
        <Col span={24} style={{ textAlign: "end", marginTop: "24px" }}>
          <Button style={{ marginRight: "8px" }} onClick={handleSubmit}>
            Submit
          </Button>
          <Button onClick={handleReset}>Reset</Button>
        </Col>

        {/* Score Display */}
        {score !== null && (
          <Col span={24} style={{ marginTop: "24px" }}>
            <Alert
              message={`Your Score: ${score} out of 5`}
              type="info"
              showIcon
            />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default QuizTime;
