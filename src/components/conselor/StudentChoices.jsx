import React, { useState, useEffect } from "react";
import Table from "./table";
import { StudentInformation } from "./studentInformation";
import axios from "axios";
import { message } from "antd";
import { API_URL } from "../../utils/constants";
import { useParams } from "react-router-dom";

// ✅ Only show these levels and in this order
const LEVEL_ORDER = ["lvl8", "lvl6", "lvl5"];

// ✅ Custom display names for each level
const LEVEL_LABELS = {
  lvl8: "Level 8 Hons Degrees",
  lvl6: "Level 6/7 Ord Degrees of Higher Cert",
  lvl5: "Level 5 PLC/ Further Ed",
};

const columns = [
  { key: "code", label: "Code" },
  { key: "point", label: "Points" },
  { key: "college", label: "College" },
  { key: "title", label: "Title" },
];

const CounselorChoices = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
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

  const renderCell = (key, value) => {
    switch (key) {
      case "point":
        return value ? parseInt(value) : "NA";
      default:
        return value;
    }
  };

  return (
    <div className="p-6">
      <StudentInformation />
      <h1 className="text-2xl font-bold mb-4">My Choices</h1>

      {error && (
        <div className="text-red-500 text-center mb-4 font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        LEVEL_ORDER.map((levelKey) => {
          const courses = data[levelKey];
          if (!Array.isArray(courses) || courses.length === 0) {
            return null;
          }

          const heading = LEVEL_LABELS[levelKey] || levelKey;

          return (
            <div key={levelKey} className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{heading}</h2>
              <Table
                columns={columns}
                data={courses}
                loading={false}
                renderCell={renderCell}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default CounselorChoices;
