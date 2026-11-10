"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { message } from "antd"
import { FileTextOutlined } from "@ant-design/icons"
import axios from "axios"
import { API_URL } from "../../utils/constants"
import StudentNotesModal from "./notes/StudentNotesModal"
import { FLAGS_UPDATED_EVENT, flagLabel } from "./notes/notesApi"
import "./notes/StudentNotes.css"

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

export const StudentInformation = ({ hideNotesButton = false, onLoaded } = {}) => {
  const { id } = useParams()
  const [studentData, setStudentData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notesOpen, setNotesOpen] = useState(false)

  useEffect(() => {
    if (id) fetchStudentDetails()
  }, [id])

  // Keep the ticked items in the header in sync when they change in the notes page/popup.
  useEffect(() => {
    const handleFlags = (event) => {
      if (event.detail?.studentId !== String(id)) return
      setStudentData((prev) => (prev ? { ...prev, flags: event.detail.flags } : prev))
    }
    window.addEventListener(FLAGS_UPDATED_EVENT, handleFlags)
    return () => window.removeEventListener(FLAGS_UPDATED_EVENT, handleFlags)
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
        `${process.env.REACT_APP_BASE_URL}${API_URL.CONSELOR_STUDENT_Details}${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.status === 200) {
        setStudentData(response.data)
        onLoaded?.(response.data)
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

            <div className="cn-header-row">
              <div>
                <h2 style={{ marginBottom: "8px", fontSize: "18px", color: "white" }}>
                  {studentData?.full_name || "Student Name"}
                </h2>
                <p style={{ fontSize: "14px", marginBottom: "4px" }}>College: {studentData?.school || "Not Available"}</p>
                <p style={{ fontSize: "14px", marginBottom: "4px" }}>Address: {studentData.address || "Not Available"}</p>
                <p style={{ fontSize: "14px" }}>Eircode: {studentData.eircode || "N/A"}</p>
              </div>
              {!hideNotesButton && (
                <button type="button" className="cn-header-btn" onClick={() => setNotesOpen(true)}>
                  <FileTextOutlined />
                  Notes
                </button>
              )}
            </div>
            {studentData?.flags?.length > 0 && (
              <div className="cn-header-flags">
                {studentData.flags.map((key) => (
                  <span key={key} className="cn-header-flag">
                    {flagLabel(key)}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p>No student data available.</p>
        )}
      </div>
      {!hideNotesButton && id && (
        <StudentNotesModal
          open={notesOpen}
          onClose={() => setNotesOpen(false)}
          studentId={id}
          studentName={studentData?.full_name}
          readOnly={studentData?.is_read_only === true}
        />
      )}
    </>
  )
}
