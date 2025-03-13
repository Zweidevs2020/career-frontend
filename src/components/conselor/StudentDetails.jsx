import React, { useState, useEffect } from "react";
import { StudentInformation } from "./studentInformation";
import axios from "axios";
import { message } from "antd";
import { API_URL } from "../../utils/constants";
import { useParams } from "react-router-dom";

// Simple CSS animation defined inline for demo purposes
// In production, you would typically place this in a separate CSS file.
const fadeInAnimation = `
  .fade-in {
    animation: fadeIn 0.5s ease-in-out forwards;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CounselorCao = () => {
  const { id } = useParams();
  const [workExperience, setWorkExperience] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- 1. Cookie helper (same as before) ---
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

  // --- 2. Fetch the API data on mount or when id changes ---
  useEffect(() => {
    if (id) fetchWorkExperience();
    // eslint-disable-next-line
  }, [id]);

  const fetchWorkExperience = async () => {
    setLoading(true);
    const token = getCookie("conselorToken");

    if (!token) {
      message.error("Unauthorized access. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://api-dev.classroomguidance.ie/${API_URL.CONSELOR_STUDENT_Details}${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // IMPORTANT: we now expect `response.data.work_experience`
        // Adjust this if your API returns a different structure
        setWorkExperience(response.data.work_experience || []);
      } else {
        message.error("Failed to fetch work experience.");
      }
    } catch (error) {
      console.error("Error Fetching Work Experience:", error);
      message.error("An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. Group work_experience by "day" ---
  const groupedByDay = workExperience.reduce((acc, entry) => {
    const day = entry.day || "No Day Specified";
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(entry);
    return acc;
  }, {});

  return (
    <div className="p-6">
      {/* Inline style block for our fade-in animation */}
      <style>{fadeInAnimation}</style>

      {/* If you still need StudentInformation, keep this line. Otherwise remove it. */}
      <StudentInformation />

      {/* 4. Renamed heading to WORK DIARY */}
      <h1 className="text-2xl font-bold mb-4"> My Work Diary</h1>

      {/* 5. Display the data or loading/error states */}
      {loading ? (
        <p>Loading...</p>
      ) : workExperience.length > 0 ? (
        // 6. Render each "day" in its own card
        Object.keys(groupedByDay).map((dayKey, index) => (
          <div
            key={index}
            className="fade-in bg-white shadow-lg rounded-lg p-6 mb-4"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">{dayKey}</h2>

            {groupedByDay[dayKey].map((item, idx) => (
              <div
                key={idx}
                className="p-4 mb-3 border rounded-md bg-gray-50 shadow-sm"
              >
                <p className="text-gray-700 font-semibold">
                  <strong>Question:</strong> {item.question}
                </p>
                <p className="text-gray-600">
                  <strong>Answer:</strong> {item.answer}
                </p>
                <p className="text-gray-400 text-sm">
                  <strong>Date:</strong> {item.date}
                </p>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No work experience data available.</p>
      )}
    </div>
  );
};

export default CounselorCao;
