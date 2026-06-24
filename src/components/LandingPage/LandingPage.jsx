import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

// Same logo used across dashboard
import myGuidanceLogo from "../../assets/newlogo.png";

// Dashboard card images for student features
import imgCao from "../../assets/66.png";
import imgGoals from "../../assets/67.png";
import imgCv from "../../assets/13.png";
import imgSelfAssess from "../../assets/14.png";
import imgStudy from "../../assets/16.png";
import imgChoices from "../../assets/12.png";
import imgEducational from "../../assets/15.png";
import imgReport from "../../assets/17.png";
import imgWork from "../../assets/18.png";

const studentFeatures = [
  {
    icon: imgCao,
    title: "My CAO Points Calculator",
    desc: "Understand exactly what points are needed and what courses are realistically within reach.",
  },
  {
    icon: imgGoals,
    title: "My Goals",
    desc: "Set clear personal, academic, and career goals with a step-by-step direction to achieve them.",
  },
  {
    icon: imgCv,
    title: "My C.V.",
    desc: "Create a professional CV that helps stand out for college applications, work experience, and jobs.",
  },
  {
    icon: imgSelfAssess,
    title: "My Self Assessment",
    desc: "Discover strengths, interests, skills, and personality traits to make better future decisions.",
  },
  {
    icon: imgStudy,
    title: "My Study Timetable",
    desc: "Build a realistic study plan that improves focus, organisation, and exam preparation.",
  },
  {
    icon: imgChoices,
    title: "My Career Choices",
    desc: "Explore career paths that match interests, abilities, and future ambitions.",
  },
  {
    icon: imgEducational,
    title: "My Educational Guidance",
    desc: "Receive guidance on subjects, courses, college routes, apprenticeships, and progression options.",
  },
  {
    icon: imgReport,
    title: "My Guidance (AI) Report",
    desc: "Get a personalised report summarising strengths, goals, recommendations, and next steps.",
  },
  {
    icon: imgWork,
    title: "My Work Experience",
    desc: "Track work experience, build confidence, and gain practical skills for future opportunities.",
  },
];

const counselorFeatures = [
  "Save Time",
  "Track Progress",
  "Manage All Students",
  "Personal Counsellor Dashboard",
  "Career Planning Tools",
  "Classroom Presentations",
  "Student Reports",
  "CAO Support",
  "Goal Setting",
  "Work Experience Tracking",
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* ===== Animated Background ===== */}
      <div className="landing-bg-animations">
        <div className="landing-shape landing-shape-1" />
        <div className="landing-shape landing-shape-2" />
        <div className="landing-shape landing-shape-3" />
        <div className="landing-shape landing-shape-4" />
        {/* Floating particles */}
        <div className="landing-particle" />
        <div className="landing-particle" />
        <div className="landing-particle" />
        <div className="landing-particle" />
        <div className="landing-particle" />
        <div className="landing-particle" />
        <div className="landing-particle" />
        <div className="landing-particle" />
        <div className="landing-particle" />
        <div className="landing-particle" />
        <div className="landing-grid-overlay" />
      </div>

      {/* ===== Navbar ===== */}
      <nav className="landing-navbar" id="landing-navbar">
        <div className="landing-logo" onClick={() => navigate("/")}>
          <img src={myGuidanceLogo} alt="My Guidance Logo" />
        </div>
        <div className="landing-nav-buttons">
          <button
            className="landing-btn-login"
            id="landing-login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="landing-btn-signup-nav"
            id="landing-signup-btn"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* ===== Hero Content ===== */}
      <div className="landing-hero-content">
        {/* ===== Left: Student Section ===== */}
        <div className="landing-student-section" id="landing-student-section">
          <div className="landing-section-header">
            <div className="landing-section-badge">
              <span className="landing-section-badge-icon">🎓</span>
              For Students
            </div>
            <h1 className="landing-section-title">
              Your Future, <span>Your Guidance</span>
            </h1>
            <p className="landing-section-subtitle">
              Everything you need to plan your education, career, and personal
              growth — all in one powerful platform.
            </p>
          </div>

          <div className="landing-features-grid">
            {studentFeatures.map((feature, index) => (
              <div className="landing-feature-card" key={index}>
                <div className="landing-feature-card-icon">
                  <img src={feature.icon} alt={feature.title} />
                </div>
                <div className="landing-feature-card-content">
                  <div className="landing-feature-card-title">
                    {feature.title}
                  </div>
                  <div className="landing-feature-card-desc">
                    {feature.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing CTA */}
          <div className="landing-pricing-cta" id="landing-pricing">
            <div className="landing-pricing-info">
              <div>
                <div className="landing-price-tag">€49</div>
                <div className="landing-price-period">per student</div>
              </div>
              <div>
                <div className="landing-price-label">
                  Full Access to All Features
                </div>
                <div className="landing-price-period">
                  Complete career guidance toolkit for students
                </div>
              </div>
            </div>
            <button
              className="landing-btn-signup"
              id="landing-signup-cta"
              onClick={() => navigate("/sign-up")}
            >
              Get Started →
            </button>
          </div>
        </div>

        {/* ===== Divider ===== */}
        <div className="landing-divider" />

        {/* ===== Right: Counselor Section ===== */}
        <div
          className="landing-counselor-section"
          id="landing-counselor-section"
        >
          <div className="landing-section-header">
            <div className="landing-section-badge">
              <span className="landing-section-badge-icon">🏫</span>
              For Counsellors
            </div>
            <h2 className="landing-section-title">
              Empower Your <span>Students</span>
            </h2>
            <p className="landing-section-subtitle">
              A comprehensive counsellor dashboard to manage, track, and guide
              every student effectively.
            </p>
          </div>

          <div className="landing-counselor-features">
            {counselorFeatures.map((feature, index) => (
              <div className="landing-counselor-feature" key={index}>
                <div className="landing-check-icon">✓</div>
                <span className="landing-counselor-feature-text">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <button
            className="landing-btn-free-trial"
            id="landing-free-trial-btn"
            onClick={() => navigate("/counselor-signup")}
          >
            Access Free Trial
          </button>
        </div>
      </div>

      {/* ===== Footer ===== */}
      <footer className="landing-footer">
        <p className="landing-footer-text">
          © {new Date().getFullYear()} My Guidance. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
