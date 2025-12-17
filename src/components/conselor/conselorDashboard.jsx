import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdvancedTable from "./advanceSearch";
import { API_URL } from "../../../src/utils/constants";

import { message, Modal } from "antd"; // Import Modal from antd
import axios from "axios";
import Navbar from "./navbar";
import { deleteMultipleStudents } from "../../utils/api"; // Import the new API function

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
  const [selectedStudentIds, setSelectedStudentIds] = useState([]); // New state for selected students
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [studentsToDelete, setStudentsToDelete] = useState([]); // State to hold IDs of students to delete
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
        `${process.env.REACT_APP_BASE_URL}${API_URL.CONSELOR_LIST_STUDENTS}`,
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // New functions for student selection
  const onToggleStudentSelection = (studentId) => {
    setSelectedStudentIds((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const onSelectAllStudents = (event) => {
    if (event.target.checked) {
      // Select all students currently in the filtered data
      const allStudentIds = data.map((student) => student.id);
      setSelectedStudentIds(allStudentIds);
    } else {
      // Deselect all
      setSelectedStudentIds([]);
    }
  };

  // Function to show confirmation modal for single student deletion
  const onDeleteSingleStudent = (studentId) => {
    setStudentsToDelete([studentId]);
    setIsModalVisible(true);
  };

  // Function to show confirmation modal for multiple student deletion
  const handleDeleteSelected = () => {
    if (selectedStudentIds.length === 0) {
      message.warning("Please select at least one student to delete.");
      return;
    }
    setStudentsToDelete(selectedStudentIds);
    setIsModalVisible(true);
  };

  // Function to handle confirmation and perform deletion
  const handleConfirmDelete = async () => {
    setIsModalVisible(false); // Close the modal
    if (studentsToDelete.length === 0) return;

    try {
      const response = await deleteMultipleStudents(studentsToDelete);
      if (response?.status === 200) {
        message.success("Students deleted successfully.");
        setSelectedStudentIds([]); // Clear selection
        setStudentsToDelete([]); // Clear students to delete
        fetchData(); // Refresh the student list
      } else {
        message.error(response?.data?.message || "Failed to delete students.");
      }
    } catch (error) {
      console.error("Error deleting students:", error);
      message.error("An error occurred while deleting students.");
    }
  };

  const handleCancelDelete = () => {
    setIsModalVisible(false);
    setStudentsToDelete([]);
  };

  const columns = [
    { key: "full_name", label: "Full Name" },
    { key: "email", label: "Email" },
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
                onToggleStudentSelection={onToggleStudentSelection}
                onSelectAllStudents={onSelectAllStudents}
                selectedStudentIds={selectedStudentIds}
                onDeleteSelected={handleDeleteSelected}
                selectedCount={selectedStudentIds.length}
                onDeleteSingleStudent={onDeleteSingleStudent} // Pass down the new prop
              />
              <Modal
                title="Confirm Deletion"
                visible={isModalVisible}
                onOk={handleConfirmDelete}
                onCancel={handleCancelDelete}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <p>
                  Are you sure you want to delete{" "}
                  {studentsToDelete.length === 1
                    ? "this student"
                    : `${studentsToDelete.length} students`}
                  ? This action cannot be undone.
                </p>
              </Modal>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default ConselorDashboard;
