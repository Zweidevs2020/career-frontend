import axios from "axios"
import { API_URL } from "../../../utils/constants"

// The eleven tick-box items, in the order the client listed them.
export const NOTE_FLAGS = [
  { key: "nui_language_exemption", label: "NUI Language Exemption" },
  { key: "dare", label: "DARE" },
  { key: "hear", label: "HEAR" },
  { key: "colour_blind", label: "Colour Blind" },
  { key: "scholarship", label: "Scholarship" },
  { key: "susi", label: "SUSI" },
  { key: "ucas", label: "UCAS" },
  { key: "hpat", label: "HPAT" },
  { key: "portfolio_audition", label: "Portfolio/Audition" },
  { key: "sen", label: "SEN" },
  { key: "not_eu_eea_resident", label: "Not EU/EEA Resident" },
]

const FLAG_LABELS = Object.fromEntries(NOTE_FLAGS.map(({ key, label }) => [key, label]))
export const flagLabel = (key) => FLAG_LABELS[key] || key

export const NOTE_TITLE_MAX = 150
export const NOTES_PAGE_SIZE = 20

// Fired after the tick boxes change, so the blue student header updates without a reload.
export const FLAGS_UPDATED_EVENT = "counsellor-notes-flags-updated"

const getCookie = (name) => {
  const cookies = document.cookie.split("; ")
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=")
    if (key === name) return value
  }
  return null
}

const request = (method, path, data) =>
  axios({
    method,
    url: `${process.env.REACT_APP_BASE_URL}${API_URL.CONSELOR_STUDENT_Details}${path}`,
    data,
    headers: { Authorization: `Bearer ${getCookie("conselorToken")}` },
  })

export const notesApi = {
  getProfile: (studentId) => request("get", `${studentId}/notes/profile/`),
  updateProfile: (studentId, changes) => request("patch", `${studentId}/notes/profile/`, changes),
  listNotes: (studentId, page = 1) =>
    request("get", `${studentId}/notes/?page=${page}&page_size=${NOTES_PAGE_SIZE}`),
  createNote: (studentId, note) => request("post", `${studentId}/notes/`, note),
  updateNote: (studentId, noteId, changes) => request("patch", `${studentId}/notes/${noteId}/`, changes),
  deleteNote: (studentId, noteId) => request("delete", `${studentId}/notes/${noteId}/`),
}

// Readable message from the API's { message, errors } format (or older formats).
export const getApiError = (error, fallback) => {
  const status = error?.response?.status
  const data = error?.response?.data
  if (status === 403) {
    return data?.message || data?.detail || "You don't have permission to change these notes."
  }
  const fieldErrors = data?.errors && Object.values(data.errors).flat().filter(Boolean)
  if (fieldErrors?.length) return fieldErrors[0]
  return data?.message || data?.detail || fallback
}

export const formatNoteDate = (value) => {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const formatShortDate = (value) => {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" })
}
