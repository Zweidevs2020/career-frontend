"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { message } from "antd"
import axios from "axios"
import { API_URL } from "../../utils/constants"

const getCookie = (name) => {
  const cookies = document.cookie.split("; ")
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=")
    if (key === name) {
      return value
    }
  }
  return null
}

export const StudentInformation = () => {
  const { id } = useParams()
  const [studentData, setStudentData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) fetchStudentDetails()
  }, [id])

  const fetchStudentDetails = async () => {
    setLoading(true)
    const token = getCookie("conselorToken")

    if (!token) {
      message.error("Unauthorized access. Please log in.")
      setLoading(false)
      return
    }

    try {
      const response = await axios.get(
        `https://api-dev.classroomguidance.ie/${API_URL.CONSELOR_STUDENT_Details}${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.status === 200) {
        setStudentData(response.data)
        console.log(response?.data)
      } else {
        message.error("Failed to fetch student details.")
      }
    } catch (error) {
      message.error("An error occurred while fetching student details.")
    } finally {
      setLoading(false)
    }
  }

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
                src={studentData.profile_image || "/placeholder.svg"}
                alt="Profile"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  marginBottom: "16px",
                }}
              />
            )}

            <h2 style={{ marginBottom: "8px", fontSize: "18px", color: "white" }}>
              {studentData?.full_name || "Student Name"}
            </h2>
            <p style={{ fontSize: "14px", marginBottom: "4px" }}>College: {studentData?.school || "Not Available"}</p>
            <p style={{ fontSize: "14px", marginBottom: "4px" }}>Address: {studentData.address || "Not Available"}</p>
            <p style={{ fontSize: "14px" }}>Eircode: {studentData.eircode || "N/A"}</p>
          </div>
        ) : (
          <p>No student data available.</p>
        )}
      </div>
    </>
  )
}
