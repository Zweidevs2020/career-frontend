import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Avatar,
  Descriptions,
  Badge,
  List,
  Typography,
  Spin,
  message,
  Row,
  Col,
  Grid,
} from "antd";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import Navbar from "./navbar";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid; // ✅ Fix for module not found

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

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const screens = useBreakpoint(); // ✅ Mobile responsiveness handling

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

  return (
    <>
      <Navbar />
      <div className="mx-auto p-4 md:p-6">
        <Card className="shadow-lg rounded-lg p-4 md:p-6 bg-white">
          {/* Profile Section */}
          <Row gutter={[16, 16]} align="middle" wrap>
            <Col xs={24} sm={8} md={6} lg={4} className="flex justify-center">
              <Avatar
                size={screens.xs ? 80 : 100}
                src={student?.profile_image || "/myCareerlogo.png"}
              />
            </Col>
            <Col xs={24} sm={16} md={18} lg={20}>
              <Title level={screens.xs ? 4 : 3}>
                {student?.full_name || "No data available"}
              </Title>
              {/* <Text type="secondary">
                {student?.email || "No data available"}
              </Text> */}
            </Col>
          </Row>

          {/* Personal Details */}
          <Descriptions
            title="Personal Details"
            bordered
            column={screens.xs ? 1 : 2}
            className="mt-4 md:mt-6"
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
            {/* <Descriptions.Item label="Date of Birth">
              {student?.dob || "No data available"}
            </Descriptions.Item> */}
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

          {/* Education */}
          <Card title="Education" className="mt-4 md:mt-6">
            <List
              bordered
              dataSource={
                student?.education?.length
                  ? student.education
                  : ["No data available"]
              }
              renderItem={(item) => (
                <List.Item>
                  <strong>Year:</strong>{" "}
                  {item?.year || "Student did not enter the data"} -
                  <strong> School:</strong>{" "}
                  {item.school || "Student did not enter the data"}
                </List.Item>
              )}
            />
          </Card>

          {/* cv */}
          <Card title="CV" className="mt-4 md:mt-6">
            <List
              bordered
              dataSource={
                student?.cv?.length ? student.cv : ["No data available"]
              }
              renderItem={(item) =>
                typeof item === "string" ? (
                  <List.Item>{item}</List.Item>
                ) : (
                  <List.Item>
                    <strong>Objective:</strong>{" "}
                    {item.objective || "No data entered by user"} <br />
                    <strong>Address:</strong>{" "}
                    {item.address || "No data entered by user"} <br />
                    <strong>City:</strong>{" "}
                    {item.city || "No data entered by user"} <br />
                    <strong>Skills:</strong>{" "}
                    {item.skills || "No data entered by user"} <br />
                    <strong>School:</strong>{" "}
                    {item.school || "No data entered by user"} <br />
                    <strong>Hobbies and Interests:</strong>{" "}
                    {item?.HobbiesandInterests || "No data entered by user"}
                  </List.Item>
                )
              }
            />
          </Card>

          {/* experince */}

          <Card title="Experience" className="mt-4 md:mt-6">
            <List
              bordered
              dataSource={
                student?.experiences?.length
                  ? student.experiences
                  : ["No data available"]
              }
              renderItem={(item) =>
                typeof item === "string" ? (
                  <List.Item>{item}</List.Item>
                ) : (
                  <List.Item>
                    <strong>Job Title:</strong>{" "}
                    {item.job_title || "No data entered by user"} <br />
                    <strong>Description:</strong>{" "}
                    {item.description || "No data entered by user"} <br />
                    <strong>City:</strong>{" "}
                    {item.city || "No data entered by user"},{" "}
                    <strong>Country:</strong>{" "}
                    {item?.country || "No data entered by user"} <br />
                    <strong>Start Date:</strong>{" "}
                    {item.startdate || "No data entered by user"} <br />
                    <strong>End Date:</strong>{" "}
                    {item.enddate || "No data entered by user"} <br />
                    <strong>Company:</strong>{" "}
                    {item?.company || "No data entered by user"}
                  </List.Item>
                )
              }
            />
          </Card>
          {/* goals */}
          <Card title="Goals" className="mt-4 md:mt-6">
            <List
              bordered
              dataSource={
                student?.goals?.length ? student.goals : ["No data available"]
              }
              renderItem={(item) =>
                typeof item === "string" ? (
                  <List.Item>{item}</List.Item>
                ) : (
                  <List.Item>
                    <strong>Profession:</strong>{" "}
                    {item.profession || "No data entered by user"} <br />
                    <strong>Goal:</strong>{" "}
                    {item.goal || "No data entered by user"} <br />
                    <strong>Actions:</strong>{" "}
                    {item.actions?.map((action) => action?.action).join(", ") ||
                      "No data entered by user"}
                  </List.Item>
                )
              }
            />
          </Card>

          {/* interest */}
          <Card title="Interests" className="mt-4 md:mt-6">
            <List
              bordered
              dataSource={
                student?.interests?.length
                  ? student.interests
                  : ["No data available"]
              }
              renderItem={(item) =>
                typeof item === "string" ? (
                  <List.Item>{item}</List.Item>
                ) : (
                  <List.Item>
                    <strong>Interest:</strong>{" "}
                    {item.interests || "No data entered by user"}
                  </List.Item>
                )
              }
            />
          </Card>
          {/* junior_cert_tests */}
          <Card title="Junior Cert Tests" className="mt-4 md:mt-6">
            <List
              bordered
              dataSource={
                student?.junior_cert_tests?.length
                  ? student.junior_cert_tests
                  : ["No data available"]
              }
              renderItem={(item) =>
                typeof item === "string" ? (
                  <List.Item>{item}</List.Item>
                ) : (
                  <List.Item>
                    <strong>Level:</strong>{" "}
                    {item.level || "No data entered by user"} <br />
                    <strong>Result:</strong>{" "}
                    {item.result || "No data entered by user"} <br />
                    <strong>Subject:</strong>{" "}
                    {item.subject || "No data entered by user"}
                  </List.Item>
                )
              }
            />
          </Card>
          {/* leaving_cert_tests */}
          <Card title="Leaving Cert Tests" className="mt-4 md:mt-6">
            <List
              bordered
              dataSource={
                student?.leaving_cert_tests?.length
                  ? student.leaving_cert_tests
                  : ["No data available"]
              }
              renderItem={(item) =>
                typeof item === "string" ? (
                  <List.Item>{item}</List.Item>
                ) : (
                  <List.Item>
                    <strong>Level: {item.level || "N/A"} </strong>{" "}
                    <p>
                      <strong>Result: {item.result || "N/A"}</strong>{" "}
                    </p>
                    <p>
                      <strong>Subject: {item.subject || "N/A"}</strong>{" "}
                    </p>
                  </List.Item>
                )
              }
            />
          </Card>
          {/* psychometric_results*/}
          <Card title="Psychometric Results" className="mt-4 md:mt-6">
            <List
              bordered
              dataSource={
                student?.psychometric_results?.length
                  ? student.psychometric_results
                  : ["No data available"]
              }
              renderItem={(item) =>
                typeof item === "string" ? (
                  <List.Item>{item}</List.Item>
                ) : (
                  <List.Item>
                    <strong>Score: </strong>
                    {item.score || "N/A"}{" "}
                    <p>
                      <strong>Test: </strong>
                      {item.test || "N/A"}{" "}
                    </p>
                  </List.Item>
                )
              }
            />
          </Card>
          {/* qualities*/}
          <Card title="Qualities" className="mt-4 md:mt-6">
            <List
              bordered
              dataSource={
                student?.qualities?.length
                  ? student.qualities
                  : ["No data available"]
              }
              renderItem={(item) =>
                typeof item === "string" ? (
                  <List.Item>{item}</List.Item>
                ) : (
                  <List.Item>
                    <strong>Description: </strong>
                    {item.description || "N/A"}{" "}
                  </List.Item>
                )
              }
            />
          </Card>
          {/* refernces */}
          <Card title="References" className="mt-4 md:mt-6">
            <List
              bordered
              dataSource={
                student?.references?.length
                  ? student.references
                  : ["No data available"]
              }
              renderItem={(item) =>
                typeof item === "string" ? (
                  <List.Item>{item}</List.Item>
                ) : (
                  <List.Item>
                    <strong>Name: </strong>
                    {item.name || "N/A"}{" "}
                    <p>
                      <strong>Email: </strong>
                      {item.email || "N/A"}{" "}
                    </p>
                    <p>
                      <strong>Position: </strong>
                      {item.position || "N/A"}{" "}
                    </p>
                    <p>
                      <strong>Contact Number:</strong>{" "}
                      {item.contact_number || "N/A"}{" "}
                    </p>
                  </List.Item>
                )
              }
            />
          </Card>
          {/* skills */}
          <Card title="Skills" className="mt-4 md:mt-6">
            <List
              bordered
              dataSource={
                student?.skills?.length ? student.skills : ["No data available"]
              }
              renderItem={(item) =>
                typeof item === "string" ? (
                  <List.Item>{item}</List.Item>
                ) : (
                  <List.Item>
                    <strong>Skill: </strong>
                    {item.skill || "N/A"}{" "}
                    <p>
                      <strong>Description: </strong>
                      {item.description || "N/A"}{" "}
                    </p>
                  </List.Item>
                )
              }
            />
          </Card>
          {/* Diary Entries */}
          <Card title="Work Diary" className="mt-4 md:mt-6">
            <List
              bordered
              dataSource={
                student?.diary_entries?.length
                  ? student.diary_entries
                  : ["No data available"]
              }
              renderItem={(item) =>
                typeof item === "string" ? (
                  <List.Item>{item}</List.Item>
                ) : (
                  <List.Item>
                    <strong>
                      {item.day || "N/A"} ({item.date || "N/A"}):
                    </strong>{" "}
                    {item.question || "N/A"} - {item.answer || "N/A"}
                  </List.Item>
                )
              }
            />
          </Card>

          {/* Choices */}
          <Card title="Choices" className="mt-4 md:mt-6">
            <List
              bordered
              dataSource={
                student?.choices?.length
                  ? student.choices
                  : ["No data available"]
              }
              renderItem={(item) => (
                <List.Item>
                  <strong>Title:</strong> {item?.title || "N/A"}, &nbsp;
                  <strong>College: </strong>
                  {item?.college || "N/A"}
                </List.Item>
              )}
            />
          </Card>

          {/* Timetable */}
          <Card title="Timetable" className="mt-4 md:mt-6">
            <List
              bordered
              dataSource={
                student?.timetable?.length
                  ? student.timetable
                  : ["No data available"]
              }
              renderItem={(item) => (
                <List.Item>
                  <strong>Title: </strong> {item?.title || "N/A"},&nbsp;
                  <strong>Day:</strong> {item?.day || "N/A"},&nbsp; Time:{" "}
                  {item.start_time || "N/A"} - {item.end_time || "N/A"}
                </List.Item>
              )}
            />
          </Card>
        </Card>
      </div>
    </>
  );
};

export default StudentDetails;
