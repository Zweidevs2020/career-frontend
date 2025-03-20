import React, { useState, useEffect } from "react";
import Table from "./table";
import { StudentInformation } from "./studentInformation";
import axios from "axios";
import { message } from "antd";
import { API_URL } from "../../utils/constants";
import { useParams } from "react-router-dom";

const LEVEL_LABELS = {
  level5: "Level 5 (PLC) Options",
  level6_7: "Level 6/7 Courses",
  level8: "Level 8 Courses",
  // Add more mappings if your API returns additional levels
};

const columns = [
  { key: "code", label: "Code" },
  { key: "point", label: "Points" },
  { key: "college", label: "College" },
  { key: "title", label: "Title" },
];

const CounselorChoices = () => {
  const { id } = useParams();
  const [data, setData] = useState({}); // The API returns an object with keys like level5, level6_7, level8, etc.
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
        `https://api-dev.classroomguidance.ie/${API_URL.CONSELOR_STUDENT_Details}${id}/choices/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        /*
          Example response shape:

          {
            level5: [
              { id: 91, code: "5M2102 CSC", point: 120, college: "Blackrock FEI", title: "Computer Science" },
              ...
            ],
            level6_7: [
              { id: 102, code: "6M2102 CSC", point: 215, college: "TUS - Athlone Campus", title: "Computer Engineering" },
              ...
            ],
            level8: [
              ...
            ]
          }
        */
        setData(response.data);
      } else {
        message.error("Failed to fetch student data.");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <StudentInformation />
      <h1 className="text-2xl font-bold mb-4">My Choices</h1>
      {error && (
        <div className="text-red-500 text-center mb-4 font-bold">{error}</div>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        // Dynamically map over the keys in `data` (e.g., level5, level6_7, level8)
        Object.keys(data).map((levelKey) => {
          const courses = data[levelKey];
          if (!Array.isArray(courses) || courses.length === 0) {
            // If there's no data for this level, skip or handle accordingly
            return null;
          }

          // Convert the level key (level5, level6_7, etc.) to a user-friendly heading
          const heading = (LEVEL_LABELS[levelKey] || levelKey).replace(
            /lvl/gi,
            "Level "
          );

          return (
            <div key={levelKey} className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{heading}</h2>
              <Table columns={columns} data={courses} loading={false} />
            </div>
          );
        })
      )}
    </div>
  );
};

export default CounselorChoices;
