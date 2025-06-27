import React, { useState, useEffect } from "react";
import { StudentInformation } from "./studentInformation";
import axios from "axios";
import { message } from "antd";
import { API_URL } from "../../utils/constants";
import { useParams } from "react-router-dom";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const EducationalGuidance = () => {
  const { id } = useParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
        return value;
      }
    }
    return null;
  };

  useEffect(() => {
    if (id) fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    setLoading(true);
    const token = getCookie("conselorToken");

    if (!token) {
      message.error("Unauthorized access. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://api-dev.classroomguidance.ie/${API_URL.CONSELOR_STUDENT_Details}${id}/education-guidance/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        /*
          Example response structure:
          {
            aggregated_data: { total_quizzes: 2, average_score: 3 },
            graph_data: {
              labels: ["Unit 1: CAO", "Unit 2: SUSI Quiz"],
              obtained_scores: [3, 3],
              total_scores: [12, 10]
            },
            quiz_overview: [
              {
                quiz_id: 127,
                quiz_name: "Unit 1 : CAO",
                obtained_score: 3,
                total_score: 12,
                percentage: 25
              },
              ...
            ]
          }
        */
        setReportData(response.data);
      } else {
        message.error("Failed to fetch student data.");
      }
    } catch (error) {
      setError(error?.response?.data?.message);
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <StudentInformation />
        <h1 className="text-2xl font-bold mb-4">My Educational Guidance</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="p-6">
        <StudentInformation />
        <h1 className="text-2xl font-bold mb-4">My Educational Guidance</h1>
        {error && (
          <div className="text-red-500 text-center mb-4 font-bold">{error}</div>
        )}
      </div>
    );
  }

  const { aggregated_data, quiz_overview } = reportData;
  const totalQuizzes = aggregated_data?.total_quizzes || 0;
  const averageScore = aggregated_data?.average_score || 0;

  return (
    <div className="p-6">
      <StudentInformation />
      <h1 className="text-2xl font-bold mb-4">My Educational Guidance</h1>

      {/* Example aggregated data section (optional) */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Aggregated Data</h2>
        <p>Total Quizzes: {totalQuizzes}</p>
        <p>Average Score: {averageScore}</p>
      </div>

      {/* Where the user wants the chart integrated for each quiz */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Quiz Scores</h2>
        {quiz_overview && quiz_overview.length > 0 ? (
          quiz_overview.map((quiz, index) => {
            const { quiz_name, obtained_score, total_score, percentage } = quiz;

            return (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center gap-4 mb-4 p-4 border rounded"
              >
                {/* Quiz Info */}
                <div className="w-full md:w-1/2">
                  <h3 className="text-lg font-semibold">{quiz_name}</h3>
                  <p>Obtained Score: {obtained_score}</p>
                  <p>Total Score: {total_score}</p>
                  <p>Percentage: {percentage}</p>
                </div>

                {/* Circular Progress Bar (smaller size) */}
                <div
                  className="w-full md:w-1/2 flex justify-center"
                  style={{ minWidth: "100px" }}
                >
                  <div style={{ width: "120px", margin: "0 auto" }}>
                    <CircularProgressbarWithChildren
                      value={obtained_score}
                      minValue={0}
                      maxValue={total_score}
                      styles={buildStyles({
                        rotation: 0.72,
                        strokeLinecap: "round",
                        textSize: "14px",
                        pathTransitionDuration: 0.5,
                        pathColor: "#db3737",
                        textColor: "#263238",
                        trailColor: "#d6d6d6",
                      })}
                    >
                      <div className="text-sm font-bold">
                        {obtained_score}/{total_score}
                      </div>
                      <div className="text-xs">
                        <strong>Score</strong>
                      </div>
                    </CircularProgressbarWithChildren>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No quiz overview data available</p>
        )}
      </div>
    </div>
  );
};

export default EducationalGuidance;
