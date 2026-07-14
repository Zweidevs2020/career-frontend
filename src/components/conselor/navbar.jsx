import React from "react";
import { Button, Col, Row } from "antd";
import { useLocation, useNavigate } from "react-router-dom"; // Import navigation
import { LeftCircleOutlined, LogoutOutlined } from "@ant-design/icons";
import newLogo from "../../assets/newlogo.png";

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
            <img src={newLogo} alt="Logo" width={150} height={32} />
          </div>
        )}
      </Col>

      {/* Buttons Section - Grouped on the right */}
      <Col
        xs={12}
        sm={12}
        md={10}
        lg={10}
        xl={8}
        className="flex justify-end sm:justify-end"
      >
        <div className="flex items-end pr-12 gap-2">
          <Button
            type="default"
            icon={<LogoutOutlined />}
            className="md:text-[15px] sm:text-[8px] text-white xs:text-[8px] md:x-4 py-1 xs:px-1 xs:py-0 sm:px-3 sm:py-2 bg-[#1476b7] h-10 border-none transition-all duration-300 ease-in-out hover:bg-white hover:text-[#1476b7] hover:border-2 hover:border-[#1476b7] hover:shadow-lg hover:-translate-y-0.5"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default Navbar;
