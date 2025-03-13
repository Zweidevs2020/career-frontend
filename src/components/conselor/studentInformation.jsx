import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Spin, message } from "antd";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import Navbar from "./navbar";

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

export const StudentInformation = () => {
  const { id } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchStudentDetails();
  }, [id]);

  const fetchStudentDetails = async () => {
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
        setStudentData(response.data);
        console.log(response?.data);
      } else {
        message.error("Failed to fetch student details.");
      }
    } catch (error) {
      message.error("An error occurred while fetching student details.");
    } finally {
      setLoading(false);
    }
  };
  const fetchStudentCV = async () => {
    setLoading(true);
    const token = getCookie("conselorToken");

    if (!token) {
      message.error("Unauthorized access. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://api-dev.classroomguidance.ie/${API_URL.CONSELOR_STUDENT_Details}${id}/cv/download/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // Ensures the response is treated as a file
        }
      );

      // console.log("Full API Response:", response);
      // console.log("Response Headers:", response.headers);
      // console.log("Response Data (Blob):", response.data);

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        console.log("Generated Blob URL:", url);

        const link = document.createElement("a");
        link.href = url;

        // Extract filename from Content-Disposition header
        const contentDisposition = response.headers["content-disposition"];
        let fileName = "student_cv.pdf"; // Default filename
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match) fileName = match[1];
        }

        console.log("File Name:", fileName);

        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        message.error("Failed to fetch student CV.");
      }
    } catch (error) {
      console.error("Error Fetching Student CV:", error);
      message.error("An error occurred while downloading the CV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}

      <div
        style={{
          background: "#1476B7",
          borderRadius: "8px",
          padding: "24px",
          color: "white",
          marginBottom: "24px",
        }}
      >
        {loading ? (
          <p>Loading student data...</p>
        ) : studentData ? (
          <div>
            {/* Profile Image */}
            {studentData?.profile_image && (
              <img
                src={studentData.profile_image}
                alt="Profile"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  marginBottom: "16px",
                }}
              />
            )}

            <h2
              style={{ marginBottom: "8px", fontSize: "18px", color: "white" }}
            >
              {studentData?.full_name || "Student Name"}
            </h2>
            <p style={{ fontSize: "14px", marginBottom: "4px" }}>
              College: {studentData?.school || "Not Available"}
            </p>
            <p style={{ fontSize: "14px", marginBottom: "4px" }}>
              Address: {studentData.address || "Not Available"}
            </p>
            <p style={{ fontSize: "14px" }}>
              Eircode: {studentData.eircode || "N/A"}
            </p>
            {/* <Button
              type="link"
              onClick={fetchStudentCV}
          
            >
              Download CV
            </Button> */}
            <Button
              type="link"
              onClick={fetchStudentCV}
              className="custom-link-button p-0"
            >
              {" "}
              <span
                style={{
                  textDecoration: "underline",
                  color: "inherit",
                  fontStyle: "italic",
                }}
              >
                Download CV
              </span>
            </Button>
          </div>
        ) : (
          <p>No student data available.</p>
        )}
      </div>
    </>
  );
};
