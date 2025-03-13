import React, { useState, useEffect } from "react";
import { StudentInformation } from "./studentInformation";
import axios from "axios";
import { message } from "antd";
import { API_URL } from "../../utils/constants";
import { useParams } from "react-router-dom";

const CounselorCao = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);

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
        `https://api-dev.classroomguidance.ie/${API_URL.CONSELOR_STUDENT_Details}${id}/goals/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setData(response.data);
        if (response.data.length > 0) {
          setCountdown(new Date(response.data[0].countdown).getTime());
        }
      } else {
        message.error("Failed to fetch student goals.");
      }
    } catch (error) {
      console.error("Error Fetching Student Goals:", error);
      message.error("An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const calculateTimeLeft = () => {
    if (!countdown) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const now = new Date().getTime();
    const distance = countdown - now;

    if (distance < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="p-6">
      <StudentInformation />
      <h1 className="text-2xl font-bold mb-4">Student Goals</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-full ">
          {loading ? (
            <p>Loading...</p>
          ) : data.length > 0 ? (
            <div className="bg-white shadow-lg rounded-lg p-6 grid gap-4">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="p-6 border rounded-lg shadow-md bg-gray-50"
                >
                  <h2 className="text-xl font-bold text-gray-800">
                    {item.proffession}
                  </h2>
                  <p className="text-gray-700 mt-2">{item.description}</p>
                  <p className="text-gray-600 mt-2 font-medium">
                    Realistic: {item.realistic ? "Yes" : "No"}
                  </p>
                  <p className="text-gray-600 mt-2 font-medium">
                    Countdown: {new Date(item.countdown).toLocaleString()}
                  </p>
                  <div className="mt-4">
                    <span className="text-gray-700 font-semibold">
                      Actions:
                    </span>
                    <ul className="list-disc list-inside mt-2">
                      {Object.values(item.action).map((action, idx) => (
                        <li key={idx} className="text-gray-600">
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No data available to show</p>
          )}
        </div>
      </div>
      {countdown && (
        <div className="mt-6 text-center text-xl font-semibold border rounded-lg p-4 shadow-md w-full max-w-lg mx-auto">
          <span className="text-red-500 font-bold text-2xl">
            {timeLeft.days} :
          </span>
          <span className="text-black font-semibold text-xl"> Days </span>
          <span className="text-black font-bold text-2xl">
            {" "}
            {timeLeft.hours} :
          </span>
          <span className="text-black font-semibold text-xl"> Hours </span>
          <span className="text-black font-bold text-2xl">
            {" "}
            {timeLeft.minutes} :
          </span>
          <span className="text-black font-semibold text-xl"> Mins </span>
          <span className="text-black font-bold text-2xl">
            {" "}
            {timeLeft.seconds}{" "}
          </span>
          <span className="text-black font-semibold text-xl"> Secs</span>
        </div>
      )}
    </div>
  );
};

export default CounselorCao;
