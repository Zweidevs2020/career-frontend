import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

import heroImage from "../../assets/st.png";
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

const studentBullets = [
  "Discover your strengths",
  "Explore your options",
  "Plan your next steps",
  "Achieve your goals",
];

const GraduationCapIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
  </svg>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const topFeatureCards = studentFeatures.slice(0, 4);
  const bottomFeatureCards = studentFeatures.slice(4);

  return (
    <div className="lp-root min-h-screen flex flex-col bg-white text-[#1b2440] px-7 pt-[18px] pb-[14px]">

      {/* ── HEADER ── */}
      <header className="flex items-center justify-between gap-6 pb-[18px] border-b border-[#e7edf6]">
        <button
          type="button"
          className="border-0 p-0 bg-transparent cursor-pointer leading-none"
          onClick={() => navigate("/")}
          aria-label="My Guidance home"
        >
          <img src="/newlogo.png" alt="My Guidance" className="block w-[220px] h-auto" />
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="min-w-[110px] h-[54px] px-7 rounded-full text-base font-semibold bg-white text-[#1c2742] border-2 border-[#1f72e6] cursor-pointer transition-all duration-[180ms] ease-in-out hover:-translate-y-px"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            type="button"
            className="min-w-[110px] h-[54px] px-7 rounded-full text-base font-semibold text-white border-2 border-[#146ee2] cursor-pointer transition-all duration-[180ms] ease-in-out hover:-translate-y-px"
            style={{ background: "linear-gradient(180deg, #146ee2 0%, #115fd0 100%)", boxShadow: "0 12px 22px rgba(20,110,226,0.2)" }}
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* ── MAIN (hero + features side-by-side) ── */}
      <main className="lp-main-grid flex-1 grid gap-7 items-start py-5" style={{ gridTemplateColumns: "minmax(0,0.93fr) minmax(0,1.37fr)" }}>

        {/* LEFT: full-bleed student photo with copy overlaid */}
        <section
          className="relative min-h-[620px] rounded-[28px] overflow-hidden"
          aria-label="Students section"
        >
          {/* Background photo covering the whole left side */}
          <img
            src={heroImage}
            alt="Student holding books"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "65% 22%" }}
          />

          {/* White gradient so the copy on the left stays readable */}
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(90deg, #ffffff 0%, #ffffff 30%, rgba(255,255,255,0.92) 46%, rgba(255,255,255,0.55) 62%, rgba(255,255,255,0.05) 82%, rgba(255,255,255,0) 100%)",
            }}
            aria-hidden="true"
          />

          {/* Copy text on top */}
          <div className="relative z-[2] max-w-[460px] h-full flex flex-col justify-center pl-2 pr-6 py-10">
            <div className="inline-flex w-fit items-center gap-2.5 px-[18px] py-2.5 rounded-full bg-[#e4efff] text-[#176fe5] text-[0.96rem] font-bold tracking-[0.01em]">
              <GraduationCapIcon />
              FOR STUDENTS
            </div>

            <h1
              className="flex flex-col mt-6 mb-8 font-extrabold leading-[0.94] tracking-[-0.07em]"
             style={{ fontSize: "clamp(2rem, 3vw, 3.5rem)" }}
            >
              <span className="text-[#131e3b] mb-2">Your Future,</span>
              <span className="text-[#176fe5]">Your Guidance</span>
            </h1>

            <p
              className="max-w-[340px] m-0 text-[#5c6788] leading-[1.78] font-normal"
              style={{ fontSize: "clamp(0.98rem, 1.1vw, 1.1rem)" }}
            >
              Everything you need to plan your education, career, and personal
              growth &nbsp; all in one powerful platform.
            </p>

            <ul className="list-none mt-[34px] mb-0 p-0 grid gap-[18px]" aria-label="Student benefits">
              {studentBullets.map((item) => (
                <li key={item} className="flex items-center gap-4 text-[#1b2440] text-base font-semibold">
                  <span className="w-6 flex-none text-[#1a79ff] text-[1.35rem] leading-none" aria-hidden="true">
                    &#10003;
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* RIGHT: features grid */}
        <section className="pt-3" aria-label="Platform features">
          <h2
            className="m-0 mb-14 text-center font-bold text-[#1b2440] tracking-[-0.03em] leading-[1.15]"
            style={{ fontSize: "clamp(1.7rem, 1.9vw, 2.15rem)" }}
          >
            Everything you need in one place
          </h2>

          {/* Top row — 4 cards */}
          <div className="lp-cards-top grid grid-cols-4 gap-2">
            {topFeatureCards.map((feature) => (
              <article
                key={feature.title}
                className="min-h-[220px] p-3 pb-3 border border-[#e4e9f2] rounded-2xl bg-white text-center flex flex-col items-center"
                style={{ boxShadow: "0 12px 28px rgba(31,54,94,0.04)" }}
              >
                <div
                  className="w-[76px] h-[76px] mt-1 mb-3 rounded-2xl overflow-hidden flex-none"
                  style={{ boxShadow: "0 8px 14px rgba(15,24,44,0.08)" }}
                >
                  <img src={feature.icon} alt="" className="w-full h-full object-cover block" />
                </div>
                <h3 className="m-0 text-[#1b2440] text-[0.88rem] leading-[1.4] font-bold tracking-[-0.01em]">
                  {feature.title}
                </h3>
                <p className="mt-2 m-0 text-[#56607d] text-[0.7rem] leading-[1.65] font-medium">
                  {feature.desc}
                </p>
              </article>
            ))}
          </div>

          {/* Bottom row — 5 cards */}
          <div className="lp-cards-bottom grid grid-cols-5 gap-2 mt-2">
            {bottomFeatureCards.map((feature) => (
              <article
                key={feature.title}
                className="min-h-[220px] p-3 pb-3 border border-[#e4e9f2] rounded-2xl bg-white text-center flex flex-col items-center"
                style={{ boxShadow: "0 12px 28px rgba(31,54,94,0.04)" }}
              >
                <div
                  className="w-[76px] h-[76px] mt-1 mb-3 rounded-2xl overflow-hidden flex-none"
                  style={{ boxShadow: "0 8px 14px rgba(15,24,44,0.08)" }}
                >
                  <img src={feature.icon} alt="" className="w-full h-full object-cover block" />
                </div>
                <h3 className="m-0 text-[#1b2440] text-[0.88rem] leading-[1.4] font-bold tracking-[-0.01em]">
                  {feature.title}
                </h3>
                <p className="mt-2 m-0 text-[#56607d] text-[0.7rem] leading-[1.65] font-medium">
                  {feature.desc}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* ── CTA PANEL ── */}
      <section
        className="lp-cta-grid grid items-center mt-4 p-0 border border-[#cfe0fc] rounded-[22px] bg-white"
        style={{
          gridTemplateColumns: "minmax(0,1fr) 1px minmax(0,1fr)",
          boxShadow: "0 18px 36px rgba(30,56,92,0.04)",
        }}
        aria-label="Pricing and counsellor callouts"
      >
        {/* Student pricing half */}
        <div
          className="grid items-center gap-[22px] px-[22px] py-6"
          style={{ gridTemplateColumns: "auto minmax(0,1fr) auto" }}
        >
          <div className="min-w-[114px] text-center">
            <div
              className="text-[#176fe5] leading-[0.9] font-extrabold tracking-[-0.06em]"
              style={{ fontSize: "clamp(3rem, 4.3vw, 4.3rem)" }}
            >
              &euro;49
            </div>
            <div className="mt-2 text-[#1b2440] text-base font-normal">per student</div>
          </div>

          <div>
            <h3
              className="m-0 text-[#1b2440] font-bold leading-[1.22]"
              style={{ fontSize: "clamp(1.14rem, 1.35vw, 1.38rem)" }}
            >
              Full Access to All Features
            </h3>
            <p
              className="mt-2 m-0 text-[#56607d] leading-[1.72]"
              style={{ fontSize: "clamp(0.95rem, 1.05vw, 1.06rem)" }}
            >
              Complete career guidance toolkit for students.
            </p>
          </div>

          <button
            type="button"
            className="min-w-[220px] h-[54px] px-7 rounded-full font-bold text-base text-white border-0 cursor-pointer transition-all duration-[180ms] ease-in-out hover:-translate-y-px whitespace-nowrap"
            style={{
              background: "linear-gradient(180deg, #ff8a2d 0%, #ff6a1f 100%)",
              boxShadow: "0 12px 22px rgba(255,115,34,0.2)",
            }}
            onClick={() => navigate("/sign-up")}
          >
            GET STARTED &rarr;
          </button>
        </div>

        {/* Divider */}
        <div className="lp-cta-divider w-px h-[88px] bg-[#d9e6fa] justify-self-center" aria-hidden="true" />

        {/* Counsellor half */}
        <div
          className="grid items-center gap-[22px] px-[22px] py-6"
          style={{ gridTemplateColumns: "auto minmax(0,1fr) auto" }}
        >
          <div className="w-[76px] h-[76px] rounded-full bg-[#e4efff] flex items-center justify-center text-[#176fe5] flex-none" aria-hidden="true">
            <svg viewBox="0 0 64 64" className="w-12 h-12">
              <circle cx="22" cy="24" r="7" fill="currentColor" />
              <circle cx="42" cy="24" r="7" fill="currentColor" />
              <circle cx="32" cy="18" r="6" fill="currentColor" opacity="0.85" />
              <path d="M12 46c2.5-9 9-13 18-13s15.5 4 18 13" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M24 47c1.5-6 5-9 8-9s6.5 3 8 9" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>

          <div>
            <h3
              className="m-0 text-[#1b2440] font-bold leading-[1.22]"
              style={{ fontSize: "clamp(1.14rem, 1.35vw, 1.38rem)" }}
            >
              Are you a counsellor?
            </h3>
            <p
              className="mt-2 m-0 text-[#56607d] leading-[1.72]"
              style={{ fontSize: "clamp(0.95rem, 1.05vw, 1.06rem)" }}
            >
              Powerful tools to manage and support your students.
            </p>
          </div>

          <button
            type="button"
            className="min-w-[220px] h-[54px] px-7 rounded-full font-bold text-base bg-white border-2 border-[#1f72e6] text-[#176fe5] cursor-pointer transition-all duration-[180ms] ease-in-out hover:-translate-y-px whitespace-nowrap"
            style={{ boxShadow: "0 10px 20px rgba(31,114,230,0.08)" }}
            onClick={() => navigate("/counselor-signup")}
          >
            FOR COUNSELLORS &rarr;
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-[18px] pb-[6px] text-center text-[#6f7b98] text-base font-normal">
        <p className="m-0">&copy; {new Date().getFullYear()} My Guidance. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
