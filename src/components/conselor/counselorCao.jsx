import React, { useState, useEffect } from "react";
import Table from "./table";
import { StudentInformation } from "./studentInformation";
import axios from "axios";
import { message } from "antd";
import { API_URL } from "../../utils/constants";
import { useParams } from "react-router-dom";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CounselorCao = () => {
  const { id } = useParams();
  const [columns] = useState([
    { key: "subject", label: "Subject" },
    { key: "level", label: "Level" },
    { key: "grade", label: "Grade" },
    { key: "point", label: "Points" },
    { key: "total_points", label: "Total Points" },
  ]);

  const [data, setData] = useState([]);
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
        `https://api-dev.classroomguidance.ie/${API_URL.CONSELOR_STUDENT_Details}${id}/cao-points/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response, "response");

      if (response.status === 200) {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setData(response.data);
        } else {
          setData([]);
        }
      } else {
        message.error("Failed to fetch student CAO points.");
      }
    } catch (error) {
      console.error("Error Fetching Student CAO Points:", error);
      message.error("An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total sum safely by providing defaults
  const totalSum = data.reduce(
    (acc, item) => acc + (item.total_points || 0) + (item.bonus_points || 0),
    0
  );

  return (
    <div className="p-6">
      <StudentInformation />
      <h1 className="text-2xl font-bold mb-4">My CAO Calculator</h1>

      <div className="gap-6">
        {/* Table Container */}
        <div className="w-full">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : data.length > 0 ? (
            <Table columns={columns} data={data} loading={loading} />
          ) : (
            <p className="text-center text-red-500 font-bold">
              No data entered from student
            </p>
          )}
        </div>

        {/* Circular Progress Graph Container */}
        {data.length > 0 ? (
          <div className="w-full">
            <h1 className="text-2xl font-bold mb-4 text-left md:text-center">
              Total Points
            </h1>
            <div className="flex justify-center relative bg-gray-100 rounded-lg shadow-md p-4">
              <div className="relative w-36 h-36">
                <CircularProgressbarWithChildren
                  value={totalSum}
                  minValue={0}
                  maxValue={1000}
                  styles={buildStyles({
                    rotation: 0.72,
                    strokeLinecap: "round",
                    textSize: "19px",
                    pathTransitionDuration: 0.5,
                    pathColor: "#1476B7",
                    textColor: "#263238",
                    trailColor: "#d6d6d6",
                  })}
                >
                  <div className="text-lg font-bold">{totalSum}</div>
                  <div className="text-sm">
                    <strong>Total Points</strong>
                  </div>
                </CircularProgressbarWithChildren>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CounselorCao;
