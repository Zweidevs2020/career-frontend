"use client"

import { useState, useEffect } from "react"
import Chart from "react-apexcharts"
import { StudentInformation } from "./studentInformation"
import axios from "axios"
import { message } from "antd"
import { API_URL } from "../../utils/constants"
import { useParams } from "react-router-dom"

const CounselorSelf = () => {
  const { id } = useParams()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    if (id) fetchStudentData()
  }, [id])

  const fetchStudentData = async () => {
    setLoading(true)
    const token = getCookie("conselorToken")

    if (!token) {
      message.error("Unauthorized access. Please log in.")
      setLoading(false)
      return
    }

    try {
      const response = await axios.get(
        `https://api-dev.classroomguidance.ie/${API_URL.CONSELOR_STUDENT_Details}${id}/psychometric-graphs/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.status === 200) {
        setData(response.data) // Expecting data in the form [{ test_name, labels, scores, ... }, ...]
      } else {
        message.error("Failed to fetch student data.")
      }
    } catch (error) {
      console.error("Error fetching student data:", error)
      message.error("An error occurred while fetching the data.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <StudentInformation />
      <h1 className="text-2xl font-bold mb-4">My Self Assessments</h1>

      {loading ? (
        <p>Loading...</p>
      ) : data?.length > 0 ? (
        data.map((item, index) => {
          // Apply conditional color logic based on test_name
          let chartColor

          if (item?.test_name === "Occupational Values Assesment") {
            chartColor = "#87aded"
          } else if (item?.test_name === "Occupational Interest Assesment") {
            chartColor = "#b9bab8"
          } else {
            chartColor = "#a4eba9"
          }

          const chartOptions = {
            chart: {
              id: `chart-${index}`,
              toolbar: {
                show: false,
              },
            },
            colors: [chartColor], 
            plotOptions: {
              bar: {
                horizontal: true,
                columnWidth: "50%",
                barHeight: "50%",
                colors: {
                  backgroundBarColors: ["#f2f2f2"], 
                },
              },
            },
            dataLabels: {
              enabled: false,
            },
            tooltip: {
              y: {
                formatter: (val) => val,
                title: {
                  formatter: () => "",
                },
              },
            },
            xaxis: {
              categories: item.labels || [],
            },
          }
          const chartSeries = [
            {
              name: item.test_name || "Scores",
              data: item.scores || [],
            },
          ]

          return (
            <div key={index} className="mb-6 p-4 bg-white shadow rounded">
              <h2 className="text-xl font-bold mb-2">{item.test_name}</h2>
              <div style={{ overflow: "auto" }}>
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  type="bar"
                  width={window.innerWidth > 748 ? "450" : "330"}
                  height={320}
                />
              </div>
            </div>
          )
        })
      ) : (
        <p className="text-center text-red-500 font-bold">No data entered from student</p>
      )}
    </div>
  )
}

export default CounselorSelf
