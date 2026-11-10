import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { StudentInformation } from "../studentInformation"
import StudentNotesPanel from "./StudentNotesPanel"
import "./StudentNotes.css"

// Full "Student Notes" page in the counsellor's student view.
const StudentNotesPage = () => {
  const { id } = useParams()
  const [readOnly, setReadOnly] = useState(false)

  return (
    <div className="p-6">
      <StudentInformation hideNotesButton onLoaded={(student) => setReadOnly(student?.is_read_only === true)} />
      <h2 className="cn-page-title">Student Notes</h2>
      <StudentNotesPanel key={id} studentId={id} readOnly={readOnly} />
    </div>
  )
}

export default StudentNotesPage
