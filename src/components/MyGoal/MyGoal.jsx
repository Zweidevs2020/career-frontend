import React, { useEffect, useRef, useState } from "react";
import { Button, DatePicker, Spin, message } from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { PDFDocument } from "pdf-lib";
import DownloadPage from "./DownloadPage";
import { API_URL } from "../../utils/constants";
import { getApiWithAuth, postApiWithAuth } from "../../utils/api";
import {
  calculateGoalTimeLeft,
  getDefaultGoalDeadline,
  GOAL_DATE_FORMAT,
  isGoalDeadlineDisabled,
  normalizeGoalDeadline,
} from "../../utils/goalCountdown";
import "./MyGoalStyle.css";

const smartSteps = [
  {
    key: "specific",
    letter: "S",
    number: "1",
    title: "Specific",
    question: "What do I want to achieve?",
  },
  {
    key: "measurable",
    letter: "M",
    number: "2",
    title: "Measurable",
    question: "How will I know when I've achieved it?",
  },
  {
    key: "achievable",
    letter: "A",
    number: "3",
    title: "Actionable",
    question: "What actions will I take to make it happen?",
  },
  {
    key: "relevant",
    letter: "R",
    number: "4",
    title: "Realistic",
    question: "Is this goal realistic and relevant to me?",
  },
  {
    key: "time-bound",
    letter: "T",
    number: "5",
    title: "Time bound",
    question: "When do I want to achieve it by?",
  },
];

const SmartIcon = ({ type }) => {
  if (type === "specific") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="29" cy="35" r="20" />
        <circle cx="29" cy="35" r="11" />
        <circle cx="29" cy="35" r="3" className="smart-icon-fill" />
        <path d="M29 35 49 15M42 13l10-2-2 10M43 20l8-8" />
      </svg>
    );
  }

  if (type === "measurable") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M10 52h45" />
        <rect x="14" y="36" width="8" height="16" rx="1" className="smart-icon-fill" />
        <rect x="29" y="25" width="8" height="27" rx="1" className="smart-icon-fill" />
        <rect x="44" y="13" width="8" height="39" rx="1" className="smart-icon-fill" />
      </svg>
    );
  }

  if (type === "achievable") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M8 53 24 31l8 10 7-9 17 21H8Z" className="smart-icon-fill-soft" />
        <path d="M8 53 24 31l8 10 7-9 17 21M32 41l7-25M39 16h13l-4 5 4 5H37" />
      </svg>
    );
  }

  if (type === "relevant") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M32 53S9 39 9 23c0-8 6-13 13-13 5 0 8 3 10 7 2-4 5-7 10-7 7 0 13 5 13 13 0 16-23 30-23 30Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="10" y="15" width="44" height="39" rx="4" />
      <path d="M10 26h44M20 10v11M44 10v11" />
      <rect x="19" y="33" width="7" height="7" rx="1" className="smart-icon-fill" />
      <rect x="29" y="33" width="7" height="7" rx="1" className="smart-icon-fill" />
      <rect x="39" y="33" width="7" height="7" rx="1" className="smart-icon-fill" />
      <rect x="19" y="43" width="7" height="7" rx="1" className="smart-icon-fill" />
      <rect x="29" y="43" width="7" height="7" rx="1" className="smart-icon-fill" />
    </svg>
  );
};

const CountdownIcon = () => (
  <svg viewBox="0 0 72 72" aria-hidden="true">
    <rect x="10" y="15" width="43" height="40" rx="5" />
    <path d="M10 27h43M21 10v12M42 10v12" />
    <circle cx="50" cy="50" r="15" className="countdown-icon-face" />
    <path d="M50 41v10l7 4" />
  </svg>
);

const emptyAchievableActions = ["", ""];

const mapAchievableActions = (value) => {
  if (Array.isArray(value)) {
    return [value[0] || "", value[1] || ""];
  }

  return [value?.action1 || "", value?.action2 || ""];
};

const mapRelevantValue = (value) => {
  if (value === true || value === 1 || value === "1" || value === "true") {
    return "Yes";
  }

  if (value === false || value === 0 || value === "0" || value === "false") {
    return "No";
  }

  return value || "";
};

const MyGoal = () => {
  const reportTemplateRef = useRef(null);

  const [specific, setSpecific] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [measurable, setMeasurable] = useState("");
  const [achievable, setAchievable] = useState(emptyAchievableActions);
  const [relevant, setRelevant] = useState("");
  const [timeBound, setTimeBound] = useState(getDefaultGoalDeadline);
  const [countdown2, setCountdown2] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    getUserGoals();
  }, []);

  useEffect(() => {
    let intervalId;

    const updateCountdown = () => {
      const timeLeft = calculateGoalTimeLeft(timeBound);
      setCountdown2(timeLeft);

      if (
        intervalId &&
        timeLeft.days === 0 &&
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0
      ) {
        clearInterval(intervalId);
      }
    };

    updateCountdown();
    if (timeBound.valueOf() > Date.now()) {
      intervalId = setInterval(updateCountdown, 1000);
    }

    return () => clearInterval(intervalId);
  }, [timeBound]);

  const getUserGoals = async () => {
    setLoading(true);
    const res = await getApiWithAuth(API_URL.GETUSERGOAL);

    if (res.data.data) {
      const goalData = res.data.data;
      const savedTimeBound = goalData.time_bound ?? goalData.countdown;

      setSpecific(goalData.specific ?? goalData.proffession ?? "");
      setMeasurable(goalData.measurable ?? goalData.description ?? "");
      setAchievable(
        mapAchievableActions(
          goalData.achievable ?? goalData.actions ?? goalData.action
        )
      );
      setRelevant(
        mapRelevantValue(goalData.relevant ?? goalData.realistic)
      );
      setTimeBound(
        normalizeGoalDeadline(savedTimeBound) ?? getDefaultGoalDeadline()
      );
      setLoading(false);
    }
  };

  function handleDateChange(date) {
    const normalizedDate = normalizeGoalDeadline(date);

    if (normalizedDate) {
      setTimeBound(normalizedDate);
    }
  }

  const DownloadBtn = async () => {
    setLoading3(true);
    const res = await getApiWithAuth(API_URL.GETMYGOALPDF);
    if (res.data.status === 200) {
      const data = res.data.data;
      const pdfBytes = Uint8Array.from(
        [...data].map((char) => char.charCodeAt(0))
      );
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      const link = document.createElement("a");
      link.href = pdfDataUri;
      link.download = `${specific}.pdf`;
      link.dispatchEvent(new MouseEvent("click"));
      message.success("PDF downloaded successfully!");
      setLoading3(false);
    } else {
      setLoading3(false);
    }
  };

  const SaveInput = async () => {
    if (relevant) {
      setLoading2(true);
      const goalPayload = {
        proffession: specific.trim(),
        description: measurable.trim(),
        actions: {
          action1: achievable[0].trim(),
          action2: achievable[1].trim(),
        },
        realistic: Boolean(relevant.trim()),
        date: timeBound.format(GOAL_DATE_FORMAT),
        relevant: relevant.trim(),
      };
      const response = await postApiWithAuth(
        API_URL.POSTUSERGOAL,
        goalPayload
      );

      if (response.data.status === 200) {
        message.success("Goals set successfully");
        setLoading2(false);
      } else {
        setLoading2(false);
        message.error(response.data.message);
      }
    } else {
      message.error("Relevant is required");
    }
  };

  const onChangeHandle = (e) => {
    const { value } = e.target;
    const actionIndex = Number(e.target.dataset.actionIndex);
    setAchievable((currentActions) =>
      currentActions.map((action, index) =>
        index === actionIndex ? value : action
      )
    );
  };

  const disabledDate = (current) => {
    return isGoalDeadlineDisabled(current);
  };

  const renderStepIdentity = (step) => (
    <>
      <div className={`smart-step-number smart-step-${step.key}`}>
        {step.number}
      </div>
      <div className={`smart-step-icon smart-step-${step.key}`}>
        <SmartIcon type={step.key} />
      </div>
      <div className="smart-step-copy">
        <h2 className={`smart-step-title smart-step-${step.key}`}>
          {step.title}
        </h2>
        <p>{step.question}</p>
      </div>
    </>
  );

  return (
    <main className="smart-goals-page">
      {loading ? (
        <div className="smart-goals-loading" aria-label="Loading goals">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <header className="smart-goals-hero">
            <div className="smart-goals-intro">
              <h1>My SMART Goal</h1>
              <p>A SMART goal is clear and easier to achieve.</p>
              <p>Take a few minutes to complete all 5 steps below.</p>
            </div>

            <div className="smart-goals-key" aria-label="SMART goal steps">
              {smartSteps.map((step) => (
                <div className={`smart-key-item smart-step-${step.key}`} key={step.key}>
                  <span className="smart-key-letter">{step.letter}</span>
                  <SmartIcon type={step.key} />
                  <span>{step.title}</span>
                </div>
              ))}
            </div>
          </header>

          <section className="smart-goals-form-card" aria-label="SMART goal form">
            <div className="smart-goal-row">
              {renderStepIdentity(smartSteps[0])}
              <div className="smart-step-control">
                <input
                  type="text"
                  value={specific}
                  onChange={(e) => setSpecific(e.target.value)}
                  name="input"
                  placeholder="e.g. Become an entrepreneur"
                  aria-label="Specific goal"
                />
              </div>
            </div>

            <div className="smart-goal-row">
              {renderStepIdentity(smartSteps[1])}
              <div className="smart-step-control">
                <input
                  type="text"
                  value={measurable}
                  onChange={(e) => setMeasurable(e.target.value)}
                  placeholder="How will you measure success?"
                  aria-label="How the goal will be measured"
                />
              </div>
            </div>

            <div className="smart-goal-row smart-goal-row-actions">
              {renderStepIdentity(smartSteps[2])}
              <div className="smart-step-control smart-actions-control">
                {achievable.map((action, index) => (
                  <div className="smart-action-input" key={index}>
                    <input
                      type="text"
                      placeholder={`Action ${index + 1}`}
                      data-action-index={index}
                      value={action}
                      onChange={onChangeHandle}
                      aria-label={`Action ${index + 1}`}
                    />
                    <button
                      type="button"
                      aria-label={`Clear action ${index + 1}`}
                      onClick={() =>
                        setAchievable((currentActions) =>
                          currentActions.map((currentAction, actionIndex) =>
                            actionIndex === index ? "" : currentAction
                          )
                        )
                      }
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="smart-goal-row">
              {renderStepIdentity(smartSteps[3])}
              <div className="smart-step-control">
                <input
                  type="text"
                  value={relevant}
                  onChange={(e) => setRelevant(e.target.value)}
                  placeholder="Why is this goal important to me?"
                  aria-label="Why this goal is relevant"
                />
              </div>
            </div>

            <div className="smart-goal-row">
              {renderStepIdentity(smartSteps[4])}
              <div className="smart-step-control smart-date-control">
                <DatePicker
                  value={timeBound}
                  onChange={handleDateChange}
                  disabledDate={disabledDate}
                  format="DD-MM-YYYY"
                  allowClear={false}
                  showToday={false}
                  renderExtraFooter={() => (
                    <Button
                      type="link"
                      onClick={() => setTimeBound(getDefaultGoalDeadline())}
                    >
                      Tomorrow
                    </Button>
                  )}
                  aria-label="Goal target date"
                />
              </div>
            </div>
          </section>

          <section className="smart-countdown-card" aria-label="Countdown to my goal">
            <div className="smart-countdown-intro">
              <div className="smart-countdown-icon">
                <CountdownIcon />
              </div>
              <div>
                <h2>Countdown to<br />my goal</h2>
                <p>Stay focused, stay consistent,<br />you've got this!</p>
              </div>
            </div>
            <div className="smart-countdown-values">
              {[
                [countdown2.days, "Days"],
                [countdown2.hours, "Hours"],
                [countdown2.minutes, "Mins"],
                [countdown2.seconds, "Secs"],
              ].map(([value, label], index) => (
                <div className={index === 0 ? "is-primary" : ""} key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>

          <div style={{ display: "none" }}>
            <div ref={reportTemplateRef} style={{ display: "contents" }}>
              <DownloadPage
                realistic={relevant}
                countdown3={timeBound}
                setRealistic={setRelevant}
                proffession={specific}
                actions={{
                  action1: achievable[0],
                  action2: achievable[1],
                }}
                countdown2={countdown2}
                description={measurable}
              />
            </div>
          </div>

          <footer className="smart-goals-actions">
            <Button
              loading={loading3}
              className="smart-goal-button"
              icon={<DownloadOutlined />}
              onClick={DownloadBtn}
            >
              Download PDF
            </Button>
            <Button
              loading={loading2}
              className="smart-goal-button"
              icon={<SaveOutlined />}
              onClick={SaveInput}
            >
              Save Goal
            </Button>
          </footer>
        </>
      )}
    </main>
  );
};

export default MyGoal;
