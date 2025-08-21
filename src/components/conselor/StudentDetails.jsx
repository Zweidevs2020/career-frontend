"use client"

import { useState, useEffect } from "react"
import { StudentInformation } from "./studentInformation"
import axios from "axios"
import { message } from "antd"
import { API_URL } from "../../utils/constants"
import { useParams } from "react-router-dom"

// Simple CSS animation defined inline for demo purposes
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
`

const ConselorWorkDiary = () => {
  const { id } = useParams()
  const [workExperience, setWorkExperience] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("Day 1")

  // --- 1. Cookie helper (same as before) ---
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

  // --- 2. Fetch the API data on mount or when id changes ---
  useEffect(() => {
    if (id) fetchWorkExperience()
    // eslint-disable-next-line
  }, [id])

  const fetchWorkExperience = async () => {
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
        // IMPORTANT: we now expect `response.data.work_experience`
        // Adjust this if your API returns a different structure
        setWorkExperience(response.data.work_experience || [])
      } else {
        message.error("Failed to fetch work experience.")
      }
    } catch (error) {
      console.error("Error Fetching Work Experience:", error)
      message.error("An error occurred while fetching the data.")
    } finally {
      setLoading(false)
    }
  }

  // --- 3. Group work_experience by "day" ---
  const groupedByDay = workExperience.reduce((acc, entry) => {
    const day = entry.day || "No Day Specified"
    if (!acc[day]) {
      acc[day] = []
    }
    acc[day].push(entry)
    return acc
  }, {})

  // Define all possible days - show ALL days regardless of data
  const allDays = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10"]

  // Get data for active tab (handle both "Day 1" and "Day1" formats)
  const getActiveTabData = () => {
    const normalizedActiveTab = activeTab.replace(" ", "")
    return groupedByDay[activeTab] || groupedByDay[normalizedActiveTab] || []
  }

  // Check if active tab has data
  const hasActiveTabData = () => {
    const data = getActiveTabData()
    return data.length > 0
  }

  return (
    <div className="p-6">
      {/* Inline style block for our fade-in animation */}
      <style>{fadeInAnimation}</style>

      {/* Student Information */}
      <StudentInformation />

      {/* Heading */}
      <h1 className="text-2xl font-bold mb-2">My Work Diary</h1>
      <p className="text-gray-600 mb-6">
        Writing down your goal increases your chances of success. Fill out this form to view any time or print and put
        you can see daily.
      </p>

      {/* Day Tabs - Show ALL days */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {allDays.map((day) => {
          // Check if this day has data
          const normalizedDay = day.replace(" ", "")
          const dayHasData = groupedByDay[day] || groupedByDay[normalizedDay]

          return (
            <button
              key={day}
              onClick={() => setActiveTab(day)}
              className={`px-4 py-3 rounded-lg border text-center font-medium transition-all duration-200 relative ${
                activeTab === day
                  ? "bg-blue-500 text-white border-blue-500 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }`}
            >
              {day}
              {/* Small indicator dot for days with data */}
              {dayHasData && (
                <span
                  className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                    activeTab === day ? "bg-white" : "bg-green-500"
                  }`}
                ></span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="text-center py-8">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="fade-in bg-white shadow-lg rounded-lg p-6 mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{activeTab}</h2>

          {hasActiveTabData() ? (
            // Display the selected day's data
            getActiveTabData().map((item, idx) => (
              <div key={idx} className="p-4 mb-3 border rounded-md bg-gray-50 shadow-sm">
                <p className="text-gray-700 font-semibold">
                  <strong>Question:</strong> {item.question}
                </p>
                <p className="text-gray-600">
                  <strong>Answer:</strong>
                  {(() => {
                    try {
                      const parsedAnswer = JSON.parse(item.answer)
                      return (
                        <ul className="list-disc pl-5">
                          {Object.entries(parsedAnswer).map(([key, value]) => (
                            <li key={key}>
                              <strong>{key}:</strong> {value}
                            </li>
                          ))}
                        </ul>
                      )
                    } catch (error) {
                      return <span>{item.answer}</span>
                    }
                  })()}
                </p>
                <p className="text-gray-400 text-sm">
                  <strong>Date:</strong> {item.date}
                </p>
              </div>
            ))
          ) : (
            // Show message for days with no data
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No data available for {activeTab}</p>
              <p className="text-gray-400 text-sm mt-1">This day hasn't been filled out yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ConselorWorkDiary
