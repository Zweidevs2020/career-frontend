import React from "react"
import { Popover } from "antd"
import { FileTextOutlined } from "@ant-design/icons"
import { flagLabel, formatShortDate } from "./notesApi"
import "./StudentNotes.css"

// Dashboard "Notes" column: note count, with a quick view of the ticked items and the
// latest three note titles (straight from notes_summary, no extra requests).
const NotesSummaryCell = ({ student, onOpen }) => {
  const summary = student?.notes_summary || {}
  const flags = summary.flags || []
  const latest = summary.latest_notes || []
  const count = summary.notes_count || 0

  const content = (
    <div className="cn-summary">
      <div className="cn-summary-section">
        <span className="cn-summary-label">Ticked items</span>
        {flags.length ? (
          <div className="cn-chips">
            {flags.map((key) => (
              <span key={key} className="cn-chip">
                {flagLabel(key)}
              </span>
            ))}
          </div>
        ) : (
          <span className="cn-summary-empty">None ticked</span>
        )}
      </div>
      <div className="cn-summary-section">
        <span className="cn-summary-label">Latest notes</span>
        {latest.length ? (
          <ul className="cn-summary-notes">
            {latest.map((note) => (
              <li key={note.id}>
                <span className="cn-summary-note-title">{note.title}</span>
                <span className="cn-summary-note-date">{formatShortDate(note.created_at)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <span className="cn-summary-empty">No notes yet</span>
        )}
      </div>
      <button type="button" className="cn-summary-link" onClick={onOpen}>
        View all notes{count ? ` (${count})` : ""} →
      </button>
    </div>
  )

  return (
    <Popover content={content} title={student?.full_name} trigger={["hover", "focus"]} placement="left">
      <button
        type="button"
        className={`cn-notes-btn ${count || flags.length ? "cn-notes-btn-active" : ""}`}
        onClick={onOpen}
        aria-label={`Open notes for ${student?.full_name || "student"}`}
      >
        <FileTextOutlined />
        <span>{count}</span>
        {flags.length > 0 && <span className="cn-notes-flag-count">{flags.length} ticked</span>}
      </button>
    </Popover>
  )
}

export default NotesSummaryCell
