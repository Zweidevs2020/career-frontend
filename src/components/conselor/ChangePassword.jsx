
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Modal } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { API_URL } from "../../utils/constants";
import showPasswordIcon from "../../assets/eyeball.svg";
import hidePasswordIcon from "../../assets/hidePassword.svg";

const { confirm } = Modal;

const ChangePassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    const token = getCookie("conselorToken");
    if (!token) {
      message.error("Unauthorized access. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/user/counselor/${id}/update-student-password/`,
        {
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        message.success(response.data.message);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        message.error(response.data.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      message.error("An error occurred while updating the password.");
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure you want to delete this student?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No, cancel',
      onOk() {
        handleDelete();
      },
    });
  };

  const handleDelete = async () => {
    setLoading(true);
    const token = getCookie("conselorToken");
    if (!token) {
      message.error("Unauthorized access. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/user/counselor/${id}/delete-student/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        message.success(response.data.message);
        navigate("/counsellor-Dashboard");
      } else {
        message.error(response.data.message || "Failed to delete student.");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      message.error("An error occurred while deleting the student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Change Student Password</h1>
      <form onSubmit={handleSubmit} className="space-y-6 w-1/2 ">
        <div className="relative">
          <label
            htmlFor="new_password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type={showNewPassword ? "text" : "password"}
            id="new_password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1476B7] focus:border-[#1476B7] sm:text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5"
          >
            <img
              src={showNewPassword ? hidePasswordIcon : showPasswordIcon}
              alt="Toggle password visibility"
              className="h-6 w-6"
            />
          </button>
        </div>
        <div className="relative">
          <label
            htmlFor="confirm_password"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirm_password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1476B7] focus:border-[#1476B7] sm:text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5"
          >
            <img
              src={showConfirmPassword ? hidePasswordIcon : showPasswordIcon}
              alt="Toggle password visibility"
              className="h-6 w-6"
            />
          </button>
        </div>
        <div className="flex flex-col  gap-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1476B7] hover:bg-[#105f93] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1476B7]"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
          <button
            type="button"
            onClick={showDeleteConfirm}
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {loading ? "Deleting..." : "Delete Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
