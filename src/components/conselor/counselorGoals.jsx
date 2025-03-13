import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Descriptions,
  Badge,
  Table,
  Typography,
  Spin,
  message,
  Row,
  Col,
  Grid,
  Divider,
} from "antd";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import Navbar from "./navbar";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

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

const CounsellorCV = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const screens = useBreakpoint();

  useEffect(() => {
    if (id) fetchStudentDetails();
  }, [id]);

  const fetchStudentDetails = async () => {
    setLoading(true);
    const token = getCookie("conselorToken");

    if (!token) {
      message.error("Unauthorized access. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://api-dev.classroomguidance.ie/${API_URL.CONSELOR_STUDENT_Details}${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setStudent(response.data);
      } else {
        message.error("Failed to fetch student details.");
      }
    } catch (error) {
      message.error("An error occurred while fetching student details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );

  const columns = [
    {
      title: "Profession",
      dataIndex: "profession",
      key: "profession",
      render: (text) => text || "No data available",
    },
    {
      title: "Goal",
      dataIndex: "goal",
      key: "goal",
      render: (text) => text || "No data available",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (actions) =>
        actions?.map((action) => action.action).join(", ") ||
        "No data available",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="mx-auto p-6">
        <Card
          className="shadow-lg rounded-lg bg-white"
          style={{ maxWidth: "1000px", margin: "0 auto" }}
        >
          <Row justify="center">
            <Col>
              <Title level={3}>Student Goals</Title>
            </Col>
          </Row>
          <Divider />

          {/* Personal Details Section */}
          <Descriptions
            title="Personal Details"
            bordered
            column={screens.xs ? 1 : 2}
          >
            <Descriptions.Item label="First Name">
              {student?.first_name || "No data available"}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {student?.last_name || "No data available"}
            </Descriptions.Item>
            <Descriptions.Item label="School">
              {student?.school || "No data available"}
            </Descriptions.Item>
            <Descriptions.Item label="City">
              {student?.cv?.[0]?.city || "No data available"}
            </Descriptions.Item>
            <Descriptions.Item label="Country">
              {student?.experiences?.[0]?.country || "No data available"}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {student?.cv?.[0]?.address || "No data available"}
            </Descriptions.Item>
            <Descriptions.Item label="Eircode">
              {student?.cv?.[0]?.eircode || "No data available"}
            </Descriptions.Item>
            <Descriptions.Item label="Phone Number">
              {student?.cv?.[0]?.number || "No data available"}
            </Descriptions.Item>
            <Descriptions.Item label="CV Completed">
              <Badge
                status={student?.cv_completed ? "success" : "error"}
                text={student?.cv_completed ? "Yes" : "No"}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Subscribed">
              <Badge
                status={student?.is_subscribed ? "success" : "error"}
                text={student?.is_subscribed ? "Yes" : "No"}
              />
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          {/* Goals Section */}
          <Card title="Goals" className="mt-4">
            <Table
              dataSource={student?.goals || []}
              columns={columns}
              pagination={false}
              rowKey={(record, index) => index}
              locale={{
                emptyText: "No data available",
              }}
            />
          </Card>
        </Card>
      </div>
    </>
  );
};

export default CounsellorCV;
