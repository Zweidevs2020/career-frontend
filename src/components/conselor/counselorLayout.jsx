import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import CounselorSidebar from "./CoiunsleorSidebar";

const CounselorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSmallOrMedium, setIsSmallOrMedium] = useState(false);

  // Listen for window size changes to determine layout mode.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSmallOrMedium(true);
        setSidebarOpen(false); // Hide sidebar by default on small/medium screens.
      } else {
        setIsSmallOrMedium(false);
        setSidebarOpen(true); // Always show sidebar on large screens.
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-100vh">
      {/* Toggle Button: visible only on small/medium screens */}
      {isSmallOrMedium && (
        <div
          style={{
            position: "fixed",
            top: 78.4,
            left: -12,
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            style={{
              background: "#1476B7",
              color: "white",
              padding: "5px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {sidebarOpen ? (
              // Left Arrow Icon (indicates "close sidebar")
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                style={{ height: "20px", width: "20px" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            ) : (
              // Right Arrow Icon (indicates "open sidebar")
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                style={{ height: "20px", width: "20px" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Sidebar (with slide-in/out animation for small/medium screens) */}
      {isSmallOrMedium ? (
        <>
          <div
            className={`fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{
              width: "250px",
              background: "#F8FAFC",
              padding: "20px 0",
              overflowY: "auto",
              // height: "100vh",
            }}
          >
            <CounselorSidebar />
          </div>
          {/* Overlay: closes sidebar when clicked */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 40,
              }}
            ></div>
          )}
        </>
      ) : (
        // On large screens, always render the sidebar (no toggle, no overlay)
        <div style={{ width: "250px" }}>
          <CounselorSidebar />
        </div>
      )}

      {/* Main Content */}
      <div style={{ width: "100%", height: "100vh", overflow: "auto" }}>
        <Navbar />
        <div className="md:p-9 bg-white md:h-[89vh] overflow-hidden overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CounselorLayout;
