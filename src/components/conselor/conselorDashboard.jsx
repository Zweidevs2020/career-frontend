import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdvancedTable from "./advanceSearch";
import { API_URL } from "../../../src/utils/constants";

import { message } from "antd";
import axios from "axios";
import Navbar from "./navbar";

// Function to get token from cookies
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

const ConselorDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const rowsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    setLoading(true);
    const token = getCookie("conselorToken"); // Get token from cookies

    if (!token) {
      message.error("Unauthorized access. Please log in.");
      navigate("/"); // Redirect to home if no token
      return;
    }

    try {
      const response = await axios.get(
        `https://api.classroomguidance.ie${API_URL.CONSELOR_LIST_STUDENTS}`,
        {
          // params: { page: currentPage, limit: rowsPerPage }, // Query parameters
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setData(response?.data); // Assuming response.data contains `data`
        setTotalPages(response.data.totalPages); // Assuming API provides `totalPages`
      } else {
        message.error(response.data.message || "Failed to fetch data.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  // const fetchStudent = async () => {
  //   setLoading(true);
  //   const token = getCookie("conselorToken"); // Get token from cookies

  //   if (!token) {
  //     message.error("Unauthorized access. Please log in.");
  //     navigate("/"); // Redirect to home if no token
  //     return;
  //   }

  //   try {
  //     const response = await axios.get(`${API_URL.CONSELOR_LIST_STUDENTS}`, {
  //       params: { page: currentPage, limit: rowsPerPage }, // Query parameters
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (response.status === 200) {
  //       setData(response.data.data); // Assuming response.data contains `data`
  //       setTotalPages(response.data.totalPages); // Assuming API provides `totalPages`
  //     } else {
  //       message.error(response.data.message || "Failed to fetch data.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     message.error("An error occurred while fetching data.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const columns = [
    { key: "full_name", label: "Full Name" },
    { key: "email", label: "Email" },
    // { key: "school", label: "School" },
    // {
    //   key: "cv_completed",
    //   label: "CV Completed",
    //   render: (row) => (row?.cv_completed ? "Yes" : "No"),
    // },
    // {
    //   key: "is_subscribed",
    //   label: "Subscribed",
    //   render: (row) => (row?.is_subscribed ? "Yes" : "No"),
    // },
  ];

  return (
    <>
      <Navbar />

      <main className="lg:col-span-10 mt-8 lg:mt-0 px-4 lg:px-32 m-auto w-full">
        <div className="bg-[#F8FAFC] rounded-lg shadow p-6 overflow-x-auto">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <>
              <AdvancedTable
                initialData={data}
                columns={columns}
                onViewDetails={(id) => {
                  navigate(`/consellor/student-cao/${id}`);
                }}
                cvDetails={(id) => {
                  navigate(`/counsellor-cv/${id}`);
                }}
              />
              {/* pagination */}
              {/* <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div> */}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default ConselorDashboard;
