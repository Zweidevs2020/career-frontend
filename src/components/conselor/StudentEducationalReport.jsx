import React, { useState, useEffect } from "react";
import { StudentInformation } from "./studentInformation";
import axios from "axios";
import { message } from "antd";
import { API_URL } from "../../utils/constants";
import { useParams } from "react-router-dom";

const Report = () => {
  const { id } = useParams();
  const [reportHtml, setReportHtml] = useState(""); // Store HTML content
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        `https://api-dev.classroomguidance.ie/${API_URL.CONSELOR_STUDENT_Details}${id}/guidance-report/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Response Received:", response.data.report_html);
      setReportHtml(response.data.report_html);
    } catch (error) {
      setError(error?.response?.data?.message);
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 ">
      <StudentInformation />

      <div className="min-h-screen bg-gray-100 p-3">
        <nav className="bg-[rgb(20,118,183)] p-4 text-white font-bold text-lg shadow-md">
          My Guidance Report
        </nav>

        <div className="p-6 sm:p-2 w-full bg-white shadow-md rounded-lg mt-6 overflow-x-auto">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {error && (
                <div className="text-red-500 text-center mb-4 font-bold">
                  {error}
                </div>
              )}
              <style>
                {`
                  h1, h2, h3, h4, h5 {
                    color: #144676;
                    font-weight: bold;
                  }
                  table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                  }
                  th, td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                  }
                  th {
                    background-color: #144676;
                    color: white;
                  }
                  ul {
                    list-style-type: disc;
                    margin-left: 20px;
                  }
                  a {
                    color: #144676;
                    text-decoration: none;
                    font-weight: bold;
                  }
                  a:hover {
                    text-decoration: underline;
                  }
                `}
              </style>
              <div className="overflow-x-auto">
                <div
                  className="break-words"
                  dangerouslySetInnerHTML={{ __html: reportHtml }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
