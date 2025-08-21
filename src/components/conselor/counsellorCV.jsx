import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Descriptions,
  Badge,
  List,
  Typography,
  Spin,
  message,
  Row,
  Col,
  Grid,
  Divider,
  Tag,
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
        `https://api.classroomguidance.ie/${API_URL.CONSELOR_STUDENT_Details}${id}`,
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

  return (
    <>
      <Navbar />
      <div className=" mx-auto p-6">
        <Card
          className="shadow-lg rounded-lg bg-white"
          style={{ maxWidth: "1000px", margin: "0 auto" }}
        >
          <Row justify="center">
            <Col>
              <Title level={3}>Student CV</Title>
              <Text type="secondary">Detailed profile and information</Text>
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
              {student?.cv[0]?.city || "No data available"}
            </Descriptions.Item>
            <Descriptions.Item label="Country">
              {student?.experiences[0]?.country || "No data available"}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {student?.cv[0]?.address || "No data available"}
            </Descriptions.Item>
            <Descriptions.Item label="Eircode">
              {student?.cv[0]?.eircode || "No data available"}
            </Descriptions.Item>
            <Descriptions.Item label="Phone Number">
              {student?.cv[0]?.number || "No data available"}
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

          {/* Education Section */}
          <Card title="Education" className="mt-4">
            <List
              bordered
              dataSource={
                student?.education?.length
                  ? student.education
                  : ["No data available"]
              }
              renderItem={(item) => (
                <List.Item>
                  <strong>Year:</strong> {item?.year || "Not provided"} <br />
                  <strong>School:</strong> {item?.school || "Not provided"}
                </List.Item>
              )}
            />
          </Card>

          <Divider />

          {/* Experience Section */}
          <Card title="Experience" className="mt-4">
            <List
              bordered
              dataSource={
                student?.experiences?.length
                  ? student.experiences
                  : ["No data available"]
              }
              renderItem={(item) => (
                <List.Item>
                  <strong>Job Title:</strong> {item.job_title || "Not provided"}{" "}
                  <br />
                  <strong>Description:</strong>{" "}
                  {item.description || "Not provided"} <br />
                  <strong>City:</strong> {item.city || "Not provided"},{" "}
                  <strong>Country:</strong> {item.country || "Not provided"}{" "}
                  <br />
                  <strong>Start Date:</strong>{" "}
                  {item.startdate || "Not provided"} <br />
                  <strong>End Date:</strong> {item.enddate || "Not provided"}{" "}
                  <br />
                  <strong>Company:</strong> {item.company || "Not provided"}
                </List.Item>
              )}
            />
          </Card>

          <Divider />

          {/* Skills Section */}
          <Card title="Skills" className="mt-4">
            <List
              bordered
              dataSource={
                student?.skills?.length ? student.skills : ["No data available"]
              }
              renderItem={(item) => (
                <List.Item>
                  <strong>Skill:</strong> {item.skill || "Not provided"} <br />
                  <strong>Description:</strong>{" "}
                  {item.description || "Not provided"}
                </List.Item>
              )}
            />
          </Card>

          <Divider />

          {/* Goals Section */}
          <Card title="Goals" className="mt-4">
            <List
              bordered
              dataSource={
                student?.goals?.length ? student.goals : ["No data available"]
              }
              renderItem={(item) => (
                <List.Item>
                  <strong>Profession:</strong>{" "}
                  {item.profession || "Not provided"} <br />
                  <strong>Goal:</strong> {item.goal || "Not provided"} <br />
                  <strong>Actions:</strong>{" "}
                  {item.actions?.map((action) => action.action).join(", ") ||
                    "Not provided"}
                </List.Item>
              )}
            />
          </Card>

          <Divider />

          {/* Interests Section */}
          <Card title="Interests" className="mt-4">
            <List
              bordered
              dataSource={
                student?.interests?.length
                  ? student.interests
                  : ["No data available"]
              }
              renderItem={(item) => (
                <List.Item>
                  <strong>Interest:</strong> {item.interests || "Not provided"}
                </List.Item>
              )}
            />
          </Card>

          <Divider />

          {/* References Section */}
          <Card title="References" className="mt-4">
            <List
              bordered
              dataSource={
                student?.references?.length
                  ? student.references
                  : ["No data available"]
              }
              renderItem={(item) => (
                <List.Item>
                  <strong>Name:</strong> {item.name || "Not provided"} <br />
                  <strong>Email:</strong> {item.email || "Not provided"} <br />
                  <strong>Position:</strong> {item.position || "Not provided"}{" "}
                  <br />
                  <strong>Contact Number:</strong>{" "}
                  {item.contact_number || "Not provided"}
                </List.Item>
              )}
            />
          </Card>
        </Card>
      </div>
    </>
  );
};

export default CounsellorCV;
