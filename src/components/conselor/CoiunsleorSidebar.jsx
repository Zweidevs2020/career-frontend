import React, { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  AssesmentSvg,
  CalculatorSvg,
  ChoicesSvg,
  EducationalSvg,
  GoalSvg,
  ProfileSvg,
  WorkDiaryIcon,
} from "../../utils/svg";

export default function CounselorSidebar() {
  const { id } = useParams(); // Get the dynamic student ID from URL
  const location = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState("Overview");

  const menuItems = [
    {
      icon: (
        <CalculatorSvg
          fill={selectedMenuItem === "CAOCalculator" ? "#1476B7" : "#BDBDBD"}
        />
      ),
      label: "My CAO Calculator",
      path: id ? `/consellor/student-cao/${id}` : "#",
      activeState: "CAOCalculator",
    },
    {
      icon: (
        <GoalSvg fill={selectedMenuItem === "Goals" ? "#1476B7" : "#BDBDBD"} />
      ),
      label: "My Goals",
      path: id ? `/consellor/student-goals/${id}` : "#",
      activeState: "Goals",
    },
    {
      icon: (
        <AssesmentSvg
          fill={selectedMenuItem === "Self Assessment" ? "#1476B7" : "#BDBDBD"}
        />
      ),
      label: "My Self Assessment",
      path: `/consellor/self/${id}`,
      activeState: "Self Assessment",
    },
    {
      icon: (
        <EducationalSvg
          fill={
            selectedMenuItem === "Educational Guidance" ? "#1476B7" : "#BDBDBD"
          }
        />
      ),
      label: "My Guidance Report",
      path: id ? `/consellor/student-educational-report/${id}` : "#",
      activeState: "Educational Guidance",
    },
    {
      icon: (
        <WorkDiaryIcon
          fill={
            selectedMenuItem === "Educational Guidance" ? "#1476B7" : "#BDBDBD"
          }
        />
      ),
      label: "My Educational Guidance",
      path: id ? `/consellor/student-guidance-report/${id}` : "#",
      activeState: "Educational Guidance",
    },
    {
      icon: (
        <ChoicesSvg
          fill={selectedMenuItem === "Choices" ? "#1476B7" : "#BDBDBD"}
        />
      ),
      label: "My Choices",
      path: id ? `/consellor/student-choices/${id}` : "#",
      activeState: "Choices",
    },
    {
      icon: (
        <ProfileSvg fill={selectedMenuItem === "CV" ? "#1476B7" : "#BDBDBD"} />
      ),
      label: "My Work Diary",
      path: id ? `/consellor/student-details/${id}` : "#",
    },
  ];

  return (
    <>
      <div
        style={{
          width: "250px",
          background: "#F8FAFC",
          padding: "20px 0",
          height: "100vh",
        }}
      >
        <div
          style={{
            padding: "0 20px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img src="/admin.svg" alt="Logo" width={150} height={32} />
        </div>

        <nav style={{ marginTop: "20px" }}>
          {menuItems.map((item, index) => {
            // Determine if the current route matches the item's path
            const isActive =
              item.path !== "#" && location.pathname === item.path;
            // If active, override the icon's fill to white
            const iconElement = isActive
              ? React.cloneElement(item.icon, { fill: "#ffffff" })
              : item.icon;
            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setSelectedMenuItem(item.activeState)}
                className={`relative block ${
                  item.path === "#" ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <div
                  className={`flex items-center p-3 hover:bg-gray-200 rounded-lg ${
                    isActive
                      ? "bg-[rgb(20,118,183)] text-white"
                      : "text-gray-700"
                  }`}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "14px",
                    }}
                  >
                    {iconElement}
                  </span>
                  <span style={{ fontSize: "14px", marginLeft: "10px" }}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
