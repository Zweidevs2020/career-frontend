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
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

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

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

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
        `${process.env.REACT_APP_BASE_URL}${API_URL.CONSELOR_STUDENT_Details}${id}/psychometric-graphs/`,
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
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {data.map((item, index) => {
            const BAR_COLORS = ['#5CC85A', '#FF9800', '#E91E8C', '#3949AB', '#00BCD4', '#9C27B0', '#FF5722', '#795548'];

            const chartOptions = {
              chart: {
                id: `chart-${index}`,
                toolbar: { show: false },
                dropShadow: { enabled: true, top: 3, left: 1, blur: 5, opacity: 0.12 },
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                  barHeight: '50%',
                  distributed: true,
                  borderRadius: 8,
                  borderRadiusApplication: 'end',
                  colors: {
                    backgroundBarColors: ['#e8e8e8'],
                    backgroundBarOpacity: 1,
                    backgroundBarRadius: 8,
                  },
                },
              },
              fill: {
                type: 'gradient',
                gradient: {
                  type: 'vertical',
                  shadeIntensity: 0.3,
                  opacityFrom: 1,
                  opacityTo: 1,
                  shade: 'light',
                  stops: [0, 100],
                },
              },
              grid: {
                xaxis: { lines: { show: true } },
                yaxis: { lines: { show: false } },
                strokeDashArray: 5,
                borderColor: '#d5d5d5',
              },
              colors: BAR_COLORS,
              legend: { show: false },
              dataLabels: { enabled: false },
              xaxis: {
                categories: (item.labels || []).map((label) => (typeof label === "string" ? label.split("/") : label)),
                labels: { show: true },
              },
              yaxis: {
                labels: {
                  show: true,
                  style: { fontSize: '12px', fontWeight: 500, colors: ['#474749'] },
                  offsetY: 4,
                },
              },
              tooltip: { enabled: false },
            }
            const chartSeries = [
              {
                name: item.test_name || "Scores",
                data: item.scores || [],
              },
            ]

            return (
              <div key={index} className="ms-3 mt-5">
                <h2 className="text-xl font-bold mb-2">{item.test_name}</h2>
                <div style={{ overflow: "auto" }}>
                  <Chart options={chartOptions} series={chartSeries} type="bar" width={screenSize.width > 748 ? 450 : 330} height={Math.max(220, (item.scores || []).length * 30 + 50)} />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-center text-red-500 font-bold">No data entered from student</p>
      )}
    </div>
  )
}

export default CounselorSelf
