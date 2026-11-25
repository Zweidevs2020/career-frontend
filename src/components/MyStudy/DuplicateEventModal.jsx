import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, Select, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { postApiWithAuth } from "../../utils/api";
import { API_URL } from "../../utils/constants";
import "./DuplicateEventModal.css";

// Same order as the timetable (Sunday first); values match the API's `day` (0 = Sunday).
const DAYS = [
  { value: "0", short: "Sun", long: "Sunday" },
  { value: "1", short: "Mon", long: "Monday" },
  { value: "2", short: "Tue", long: "Tuesday" },
  { value: "3", short: "Wed", long: "Wednesday" },
  { value: "4", short: "Thu", long: "Thursday" },
  { value: "5", short: "Fri", long: "Friday" },
  { value: "6", short: "Sat", long: "Saturday" },
];

// "09:15 AM" / "9:15 AM" -> "9:15 AM" so it matches the time options.
const toOption = (time) => {
  const parsed = dayjs(time, "hh:mm A");
  return parsed.isValid() ? parsed.format("h:mm A") : undefined;
};
const toApi = (time) => dayjs(time, "hh:mm A").format("HH:mm:ss");

/**
 * Copies an existing study session to one or more days, with its own start and end time.
 * Each copy is saved through the same "add session" endpoint as Create.
 */
const DuplicateEventModal = ({ open, source, timeOptions, onClose, onDuplicated }) => {
  const [title, setTitle] = useState("");
  const [days, setDays] = useState([]);
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !source) return;
    setTitle(source.title || "");
    setDays([]);
    setStart(toOption(source.start));
    setEnd(toOption(source.end));
  }, [open, source]);

  const timeError = useMemo(() => {
    if (!start || !end) return "";
    const startTime = dayjs(start, "hh:mm A");
    const endTime = dayjs(end, "hh:mm A");
    if (startTime.isSame(endTime)) return "Start & end time can't be the same.";
    if (startTime.isAfter(endTime)) return "Start time cannot be greater than end time.";
    return "";
  }, [start, end]);

  const canSave = title.trim() && days.length > 0 && start && end && !timeError;

  const toggleDay = (value) =>
    setDays((prev) => (prev.includes(value) ? prev.filter((day) => day !== value) : [...prev, value]));

  const handleDuplicate = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    const payload = {
      timeslot: toApi(start),
      endslot: toApi(end),
      title: title.trim(),
      color: source.color,
    };
    const ordered = DAYS.filter((day) => days.includes(day.value));
    const results = await Promise.all(
      ordered.map((day) => postApiWithAuth(API_URL.ADDSLOTTABLE, { ...payload, day: day.value }))
    );
    const failed = ordered.filter((_, index) => results[index]?.data?.status !== 201);
    const created = ordered.length - failed.length;
    setSaving(false);

    if (created > 0) {
      const names = ordered.filter((day) => !failed.includes(day)).map((day) => day.short).join(", ");
      message.success(created === 1 ? `Session duplicated to ${names}` : `${created} sessions created: ${names}`);
      onDuplicated();
    }
    if (failed.length > 0) {
      const errorMessage = results.find((result) => result?.data?.status !== 201)?.data?.message;
      message.error(
        (Array.isArray(errorMessage) ? errorMessage[0] : errorMessage) ||
          `Couldn't duplicate to ${failed.map((day) => day.short).join(", ")}. Please try again.`
      );
      setDays(failed.map((day) => day.value));
      return;
    }
    onClose();
  };

  const saveLabel =
    days.length > 1 ? `Create ${days.length} copies` : "Create copy";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={520}
      destroyOnClose
      className="studyDupModal"
      title={
        <div className="studyDupTitle">
          <span className="studyDupTitleIcon">
            <CopyOutlined />
          </span>
          <div>
            <div className="studyDupHeading">Duplicate session</div>
            <div className="studyDupSub">Copy this session to other days or times.</div>
          </div>
        </div>
      }
    >
      {source && (
        <div className="studyDupBody">
          <div className="studyDupSource" style={{ "--dup-color": source.color }}>
            <span className="studyDupSwatch" />
            <div className="studyDupSourceText">
              <span className="studyDupSourceTitle">{source.title || "Untitled session"}</span>
              <span className="studyDupSourceMeta">
                {DAYS.find((day) => day.value === String(source.day))?.long || "Current day"} ·{" "}
                {toOption(source.start)} – {toOption(source.end)}
              </span>
            </div>
          </div>

          <label className="studyDupLabel" htmlFor="studyDupTitleInput">
            Title
          </label>
          <Input
            id="studyDupTitleInput"
            size="large"
            value={title}
            maxLength={100}
            onChange={(event) => setTitle(event.target.value)}
            className="studyDupInput"
            placeholder="Add Title"
          />

          <div className="studyDupLabelRow">
            <span className="studyDupLabel">Days</span>
            <span className="studyDupHint">Select one or more</span>
          </div>
          <div className="studyDupDays" role="group" aria-label="Days to copy to">
            {DAYS.map((day) => {
              const active = days.includes(day.value);
              return (
                <button
                  type="button"
                  key={day.value}
                  className={`studyDupDay${active ? " studyDupDayActive" : ""}`}
                  aria-pressed={active}
                  aria-label={day.long}
                  onClick={() => toggleDay(day.value)}
                >
                  {day.short}
                </button>
              );
            })}
          </div>

          <div className="studyDupTimes">
            <div className="studyDupTimeField">
              <span className="studyDupLabel">Start time</span>
              <Select
                size="large"
                value={start}
                onChange={setStart}
                options={timeOptions}
                placeholder="Select time"
                className="studyDupSelect"
                popupClassName="studyDupSelectPopup"
              />
            </div>
            <div className="studyDupTimeField">
              <span className="studyDupLabel">End time</span>
              <Select
                size="large"
                value={end}
                onChange={setEnd}
                options={timeOptions}
                placeholder="Select end time"
                className="studyDupSelect"
                popupClassName="studyDupSelectPopup"
              />
            </div>
          </div>
          {timeError && <div className="studyDupError">{timeError}</div>}

          <div className="studyDupActions">
            <Button size="large" className="studyDupCancel" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="large"
              type="primary"
              className="studyDupSave"
              icon={<CopyOutlined />}
              loading={saving}
              disabled={!canSave}
              onClick={handleDuplicate}
            >
              {saveLabel}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DuplicateEventModal;
