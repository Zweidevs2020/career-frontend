import React from "react";
import { Button, Col, Row } from "antd";
import { useNavigate } from "react-router-dom"; // Import navigation
import mycareer from "../../../src/assets/my-guidance-logo1.png";

const Navbar = () => {
  const navigate = useNavigate(); // React Router navigation

  // Logout Function - Removes 'conselorToken' and navigates to home
  const handleLogout = () => {
    document.cookie =
      "conselorToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/"); // Redirect to home without reload
  };

  return (
    <Row
      className="bg-[#f8fafc] py-2 px-4 items-center"
      align="middle"
      justify="space-between"
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
        <img
          src={mycareer}
          alt="cyberLegendLogo"
          className="w-full max-w-[180px] sm:max-w-[90px] md:max-w-[100px]"
        />
      </Col>

      {/* Title Section - Centers on Mobile */}
      <Col xs={12} sm={12} md={8} lg={6} xl={5} className="text-center">
        <p className="text-lg xs:text-xs sm:text-base md:text-lg font-bold">
          Counsellor Dashboard
        </p>
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
          className="text-[15px] text-white xs:text-[8px] px-6 py-1 xs:px-1 xs:py-0 sm:px-3 sm:py-2 bg-[#1476b7]"
          onClick={handleLogout} // Calls logout function
        >
          Logout
        </Button>
      </Col>
    </Row>
  );
};

export default Navbar;
