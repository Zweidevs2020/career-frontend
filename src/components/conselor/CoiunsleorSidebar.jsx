"use client"

import React, { useState } from "react"
import { Link, useParams, useLocation } from "react-router-dom"
import axios from "axios"
import { message } from "antd"
import { API_URL } from "../../utils/constants"
import {
  AssesmentSvg,
  CalculatorSvg,
  ChoicesSvg,
  EducationalSvg,
  GoalSvg,
  ProfileSvg,
  WorkDiaryIcon,
} from "../../utils/svg"

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

export default function CounselorSidebar() {
  const { id } = useParams() // Get the dynamic student ID from URL
  const location = useLocation()
  const [selectedMenuItem, setSelectedMenuItem] = useState("Overview")
  const [loading, setLoading] = useState(false)

  const fetchStudentCV = async () => {
    setLoading(true)
    const token = getCookie("conselorToken")

    if (!token) {
      message.error("Unauthorized access. Please log in.")
      setLoading(false)
      return
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}${API_URL.CONSELOR_STUDENT_Details}${id}/cv/download/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // Ensures the response is treated as a file
        },
      )

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        console.log("Generated Blob URL:", url)

        const link = document.createElement("a")
        link.href = url

        const contentDisposition = response.headers["content-disposition"]
        let fileName = "student_cv.pdf" // Default filename
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/)
          if (match) fileName = match[1]
        }

        console.log("File Name:", fileName)

        link.setAttribute("download", fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        message.success("CV downloaded successfully!")
      } else {
        message.error("Failed to fetch student CV.")
      }
    } catch (error) {
      console.error("Error Fetching Student CV:", error)
      message.error("An error occurred while downloading the CV.")
    } finally {
      setLoading(false)
    }
  }

  const menuItems = [
    {
      icon: <CalculatorSvg fill={selectedMenuItem === "CAOCalculator" ? "#1476B7" : "#BDBDBD"} />,
      label: "My CAO Calculator",
      path: id ? `/consellor/student-cao/${id}` : "#",
      activeState: "CAOCalculator",
    },
    {
      icon: <GoalSvg fill={selectedMenuItem === "Goals" ? "#1476B7" : "#BDBDBD"} />,
      label: "My Goals",
      path: id ? `/consellor/student-goals/${id}` : "#",
      activeState: "Goals",
    },
    {
      icon: <AssesmentSvg fill={selectedMenuItem === "Self Assessment" ? "#1476B7" : "#BDBDBD"} />,
      label: "My Self Assessment",
      path: `/consellor/self/${id}`,
      activeState: "Self Assessment",
    },
    {
      icon: <EducationalSvg fill={selectedMenuItem === "Educational Guidance" ? "#1476B7" : "#BDBDBD"} />,
      label: "My Guidance Report",
      path: id ? `/consellor/student-educational-report/${id}` : "#",
      activeState: "Educational Guidance",
    },
    {
      icon: <WorkDiaryIcon fill={selectedMenuItem === "Educational Guidance" ? "#1476B7" : "#BDBDBD"} />,
      label: "My Educational Guidance",
      path: id ? `/consellor/student-guidance-report/${id}` : "#",
      activeState: "Educational Guidance",
    },
    {
      icon: <ChoicesSvg fill={selectedMenuItem === "Choices" ? "#1476B7" : "#BDBDBD"} />,
      label: "My Choices",
      path: id ? `/consellor/student-choices/${id}` : "#",
      activeState: "Choices",
    },
    {
      icon: <ProfileSvg fill={selectedMenuItem === "CV" ? "#1476B7" : "#BDBDBD"} />,
      label: "My Work Diary",
      path: id ? `/consellor/student-details/${id}` : "#",
    },
    {
      icon: <ProfileSvg fill={selectedMenuItem === "CV" ? "#1476B7" : "#BDBDBD"} />,
      label: "My CV",
      path: "#",
      isDownloadCV: true, 
    },
  ]

  const handleMenuClick = (item) => {
    if (item.isDownloadCV) {
      fetchStudentCV()
    } else {
      setSelectedMenuItem(item.activeState)
    }
  }

  return (
    <>
      <div
        style={{
          width: "250px",
          background: "#F8FAFC",
          padding: "20px 0",
          height: "100vh",
        }}
      >
        <div
          style={{
            padding: "0 20px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img src="/admin.svg" alt="Logo" width={150} height={32} />
        </div>

        <nav style={{ marginTop: "20px" }}>
          {menuItems.map((item, index) => {
            const isActive = item.path !== "#" && location.pathname === item.path
            const iconElement = isActive ? React.cloneElement(item.icon, { fill: "#ffffff" }) : item.icon
            if (item.isDownloadCV) {
              return (
                <button
                  key={index}
                  onClick={() => handleMenuClick(item)}
                  disabled={loading}
                  className="w-full text-left"
                  style={{ border: "none", background: "none", padding: 0 }}
                >
                  <div
                    className={`flex items-center p-3 hover:bg-gray-200 rounded-lg text-gray-700 ${
                      loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "14px",
                      }}
                    >
                      {iconElement}
                    </span>
                    <span style={{ fontSize: "14px", marginLeft: "10px" }}>
                      {loading ? "Downloading..." : item.label}
                    </span>
                  </div>
                </button>
              )
            }

            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => handleMenuClick(item)}
                className={`relative block ${item.path === "#" ? "pointer-events-none opacity-50" : ""}`}
              >
                <div
                  className={`flex items-center p-3 hover:bg-gray-200 rounded-lg ${
                    isActive ? "bg-[rgb(20,118,183)] text-white" : "text-gray-700"
                  }`}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "14px",
                    }}
                  >
                    {iconElement}
                  </span>
                  <span style={{ fontSize: "14px", marginLeft: "10px" }}>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
