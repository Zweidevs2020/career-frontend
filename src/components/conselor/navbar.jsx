import React from "react";
import { Button, Col, Row } from "antd";
import { useLocation, useNavigate } from "react-router-dom"; // Import navigation
import { LeftCircleOutlined, LogoutOutlined } from "@ant-design/icons";

const Navbar = () => {
  const navigate = useNavigate(); // React Router navigation
  const location = useLocation();
  const isCounselorDashboard = location.pathname.includes("/counsellor-Dashboard");
  // Logout Function - Removes 'conselorToken' and navigates to home
  const handleLogout = () => {
    document.cookie =
      "conselorToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // navigate("/"); // Redirect to home without reload
    window.location.href = "/";
  };
  const handleBack = () => {
    navigate("/counsellor-Dashboard");
  };

  return (
    <Row
      className="bg-[#f8fafc] py-4 px-4 items-center justify-between mb-7"
      align="middle"
      justify="end"
    >
      {/* Logo Section - Adjusts size dynamically */}
      <Col
        xs={6}
        sm={6}
        md={4}
        lg={4}
        xl={3}
        className="flex justify-center sm:justify-start"
      >
        {!isCounselorDashboard ? (
          <Button
            type="default"
            icon={<LeftCircleOutlined />}
            className="ms:text-[15px] sm:text-[8px] text-white xs:text-[8px] px-4 py-1 xs:px-1 xs:py-0 sm:px-3 sm:py-2 bg-[#1476b7] h-10"
            onClick={handleBack} // Calls logout function
          >
            Back
          </Button>
        ) : (
          <div
            style={
              {
                // padding: "0 20px",
              }
            }
          >
            <img src="/admin.svg" alt="Logo" width={150} height={32} />
          </div>
        )}
      </Col>

      {/* Logout Button - Smaller on Mobile */}
      <Col
        xs={6}
        sm={6}
        md={4}
        lg={4}
        xl={3}
        className="flex justify-center sm:justify-end m"
      >
        <Button
          type="default"
          icon={<LogoutOutlined />}
          className="md:text-[15px] sm:text-[8px] text-white xs:text-[8px] md:x-4 py-1 xs:px-1 xs:py-0 sm:px-3 sm:py-2 bg-[#1476b7] h-10"
          onClick={handleLogout} // Calls logout function
        >
          Logout
        </Button>
      </Col>
    </Row>
  );
};

export default Navbar;
