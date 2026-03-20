import React, { useState, useEffect } from "react";
import Table from "./table";
import { StudentInformation } from "./studentInformation";
import axios from "axios";
import { message } from "antd";
import { API_URL } from "../../utils/constants";
import { useParams } from "react-router-dom";

const SECTION_ORDER = [
  "lvl8",
  "lvl6",
  "lvl5",
  "tertiarydegree",
  "app",
  "ucas_ni",
  "othr",
];

const SECTION_CONFIG = {
  lvl8: {
    heading: "Level 8 Hons Degrees",
    columns: [
      { key: "code", label: "Code" },
      { key: "point", label: "Points" },
      { key: "college", label: "College" },
      { key: "title", label: "Title" },
    ],
  },
  lvl6: {
    heading: "Level 6/7 Ord Degrees of Higher Cert",
    columns: [
      { key: "code", label: "Code" },
      { key: "point", label: "Points" },
      { key: "college", label: "College" },
      { key: "title", label: "Title" },
    ],
  },
  lvl5: {
    heading: "Level 5 PLC/ Further Ed",
    columns: [
      { key: "code_display", label: "Code" },
      { key: "college", label: "College" },
      { key: "title", label: "Title" },
    ],
  },
  tertiarydegree: {
    heading: "Tertiary Degree",
    columns: [
      { key: "code", label: "Code" },
      { key: "title", label: "Title" },
      { key: "college", label: "College" },
      { key: "Duration_level", label: "Duration / Level" },
    ],
  },
  app: {
    heading: "Apprenticeships",
    columns: [
      { key: "name", label: "Name" },
      { key: "level", label: "Level" },
      { key: "provider", label: "Provider" },
      { key: "location", label: "Location" },
    ],
  },
  ucas_ni: {
    heading: "UCAS North Ireland",
    columns: [
      { key: "code", label: "Code" },
      { key: "title", label: "Title" },
      { key: "college", label: "College" },
      { key: "nfq_level", label: "NFQ Level" },
    ],
  },
  othr: {
    heading: "Other",
    columns: [{ key: "idea", label: "Idea" }],
  },
};

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
        `${process.env.REACT_APP_BASE_URL}${API_URL.CONSELOR_STUDENT_Details}${id}/choices/`,
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
        SECTION_ORDER.map((sectionKey) => {
          const courses = data[sectionKey];
          if (!Array.isArray(courses) || courses.length === 0) {
            return null;
          }

          const section = SECTION_CONFIG[sectionKey];
          const heading = section?.heading || sectionKey;
          const columns = section?.columns || [];

          return (
            <div key={sectionKey} className="mb-6">
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
