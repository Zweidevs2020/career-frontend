import React from "react"
import { Modal } from "antd"
import { Link } from "react-router-dom"
import StudentNotesPanel from "./StudentNotesPanel"
import "./StudentNotes.css"

// Quick notes popup, opened from the blue student header on any student page.
const StudentNotesModal = ({ open, onClose, studentId, studentName, readOnly }) => (
  <Modal
    open={open}
    onCancel={onClose}
    footer={null}
    width={820}
    centered
    destroyOnClose
    className="cn-modal"
    title={
      <div className="cn-modal-title">
        <span>Student Notes{studentName ? ` · ${studentName}` : ""}</span>
        <Link to={`/consellor/student-notes/${studentId}`} onClick={onClose} className="cn-modal-link">
          Open full page
        </Link>
      </div>
    }
  >
    {open && <StudentNotesPanel studentId={studentId} readOnly={readOnly} compact />}
  </Modal>
)

export default StudentNotesModal
