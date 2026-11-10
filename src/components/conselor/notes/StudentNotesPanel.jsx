import React, { useCallback, useEffect, useState } from "react"
import { Button, Empty, Input, Popconfirm, Spin, message } from "antd"
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import {
  FLAGS_UPDATED_EVENT,
  NOTE_FLAGS,
  NOTE_TITLE_MAX,
  formatNoteDate,
  getApiError,
  notesApi,
} from "./notesApi"
import "./StudentNotes.css"

const { TextArea } = Input

const flagsFromProfile = (profile) => NOTE_FLAGS.filter(({ key }) => profile?.[key]).map(({ key }) => key)

// Shared by the Student Notes page and the quick-notes popup (same APIs, same behaviour).
const StudentNotesPanel = ({ studentId, readOnly = false, compact = false }) => {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [savingFlag, setSavingFlag] = useState(null)
  const [contact, setContact] = useState("")
  const [savingContact, setSavingContact] = useState(false)

  const [notes, setNotes] = useState([])
  const [notesCount, setNotesCount] = useState(0)
  const [nextPage, setNextPage] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)

  const [draft, setDraft] = useState({ title: "", body: "" })
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const loadFirstPage = useCallback(async () => {
    const response = await notesApi.listNotes(studentId, 1)
    setNotes(response.data?.results || [])
    setNotesCount(response.data?.count ?? 0)
    setNextPage(response.data?.next ? 2 : null)
  }, [studentId])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const [profileResponse] = await Promise.all([notesApi.getProfile(studentId), loadFirstPage()])
        if (cancelled) return
        setProfile(profileResponse.data)
        setContact(profileResponse.data?.guardian_contact || "")
      } catch (error) {
        if (!cancelled) message.error(getApiError(error, "Unable to load student notes."))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (studentId) load()
    return () => {
      cancelled = true
    }
  }, [studentId, loadFirstPage])

  const notifyFlags = (nextProfile) => {
    window.dispatchEvent(
      new CustomEvent(FLAGS_UPDATED_EVENT, {
        detail: { studentId: String(studentId), flags: flagsFromProfile(nextProfile) },
      }),
    )
  }

  const toggleFlag = async (key, checked) => {
    const previous = profile
    const optimistic = { ...profile, [key]: checked }
    setProfile(optimistic)
    setSavingFlag(key)
    try {
      const response = await notesApi.updateProfile(studentId, { [key]: checked })
      const saved = { ...optimistic, ...response.data }
      setProfile(saved)
      notifyFlags(saved)
    } catch (error) {
      setProfile(previous)
      message.error(getApiError(error, "Unable to update this item."))
    } finally {
      setSavingFlag(null)
    }
  }

  const contactChanged = contact !== (profile?.guardian_contact || "")

  const saveContact = async () => {
    setSavingContact(true)
    try {
      const response = await notesApi.updateProfile(studentId, { guardian_contact: contact.trim() })
      setProfile((prev) => ({ ...prev, ...response.data }))
      setContact(response.data?.guardian_contact ?? contact.trim())
      message.success("Contact saved")
    } catch (error) {
      message.error(getApiError(error, "Unable to save the contact."))
    } finally {
      setSavingContact(false)
    }
  }

  const loadMore = async () => {
    if (!nextPage) return
    setLoadingMore(true)
    try {
      const response = await notesApi.listNotes(studentId, nextPage)
      setNotes((prev) => {
        const seen = new Set(prev.map((note) => note.id))
        return [...prev, ...(response.data?.results || []).filter((note) => !seen.has(note.id))]
      })
      setNotesCount(response.data?.count ?? notesCount)
      setNextPage(response.data?.next ? nextPage + 1 : null)
    } catch (error) {
      message.error(getApiError(error, "Unable to load older notes."))
    } finally {
      setLoadingMore(false)
    }
  }

  const validate = ({ title, body }) => {
    if (!title.trim()) return "Please enter a title."
    if (title.trim().length > NOTE_TITLE_MAX) return `Title can be at most ${NOTE_TITLE_MAX} characters.`
    if (!body.trim()) return "Please enter the note."
    return null
  }

  const createNote = async () => {
    const problem = validate(draft)
    if (problem) {
      message.warning(problem)
      return
    }
    setCreating(true)
    try {
      await notesApi.createNote(studentId, { title: draft.title.trim(), body: draft.body.trim() })
      setDraft({ title: "", body: "" })
      await loadFirstPage()
      message.success("Note added")
    } catch (error) {
      message.error(getApiError(error, "Unable to add the note."))
    } finally {
      setCreating(false)
    }
  }

  const saveEdit = async () => {
    const problem = validate(editing)
    if (problem) {
      message.warning(problem)
      return
    }
    setSavingEdit(true)
    try {
      const response = await notesApi.updateNote(studentId, editing.id, {
        title: editing.title.trim(),
        body: editing.body.trim(),
      })
      // Editing doesn't change a note's position (list is ordered by creation date).
      setNotes((prev) => prev.map((note) => (note.id === editing.id ? { ...note, ...response.data } : note)))
      setEditing(null)
      message.success("Note updated")
    } catch (error) {
      message.error(getApiError(error, "Unable to update the note."))
    } finally {
      setSavingEdit(false)
    }
  }

  const deleteNote = async (noteId) => {
    setDeletingId(noteId)
    try {
      await notesApi.deleteNote(studentId, noteId)
      setNotes((prev) => prev.filter((note) => note.id !== noteId))
      setNotesCount((count) => Math.max(0, count - 1))
      message.success("Note deleted")
    } catch (error) {
      message.error(getApiError(error, "Unable to delete the note."))
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="cn-loading">
        <Spin />
      </div>
    )
  }

  return (
    <div className={`cn-panel ${compact ? "cn-panel-compact" : ""}`}>
      {readOnly && (
        <div className="cn-readonly">This is a read-only demo student. Notes can be viewed but not changed.</div>
      )}

      {/* Tick boxes + guardian contact */}
      <section className="cn-card">
        <h3 className="cn-card-title">Student Details</h3>
        <div className="cn-flags">
          {NOTE_FLAGS.map(({ key, label }) => {
            const checked = Boolean(profile?.[key])
            return (
              <label
                key={key}
                className={`cn-flag ${checked ? "cn-flag-on" : ""} ${readOnly ? "cn-flag-disabled" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={readOnly || savingFlag === key}
                  onChange={(event) => toggleFlag(key, event.target.checked)}
                />
                <span className="cn-flag-box" aria-hidden="true" />
                <span className="cn-flag-label">{label}</span>
              </label>
            )
          })}
        </div>

        <div className="cn-contact">
          <label className="cn-field-label" htmlFor={`cn-contact-${studentId}`}>
            Family / Parent / Guardian Contact
          </label>
          <div className="cn-contact-row">
            <Input
              id={`cn-contact-${studentId}`}
              size="large"
              value={contact}
              disabled={readOnly}
              placeholder="e.g. Parent: Jane Murphy, 087 123 4567"
              onChange={(event) => setContact(event.target.value)}
              onPressEnter={() => contactChanged && saveContact()}
            />
            {!readOnly && (
              <Button
                size="large"
                className="cn-btn-primary"
                loading={savingContact}
                disabled={!contactChanged}
                onClick={saveContact}
              >
                Save
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Add note */}
      {!readOnly && (
        <section className="cn-card">
          <h3 className="cn-card-title">Add a Note</h3>
          <Input
            size="large"
            maxLength={NOTE_TITLE_MAX}
            showCount
            placeholder="Title, e.g. CAO meeting"
            value={draft.title}
            onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
          />
          <TextArea
            className="cn-textarea"
            autoSize={{ minRows: 3, maxRows: 8 }}
            placeholder="Write the note…"
            value={draft.body}
            onChange={(event) => setDraft((prev) => ({ ...prev, body: event.target.value }))}
          />
          <div className="cn-actions">
            <Button
              size="large"
              className="cn-btn-primary"
              icon={<PlusOutlined />}
              loading={creating}
              disabled={!draft.title.trim() || !draft.body.trim()}
              onClick={createNote}
            >
              Add Note
            </Button>
          </div>
        </section>
      )}

      {/* Notes, newest first */}
      <section className="cn-card">
        <div className="cn-notes-head">
          <h3 className="cn-card-title">Notes</h3>
          <span className="cn-count">{notesCount}</span>
        </div>

        {notes.length === 0 ? (
          <Empty description="No notes yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <ul className="cn-notes">
            {notes.map((note) => {
              const isEditing = editing?.id === note.id
              const edited = note.updated_at && note.created_at && note.updated_at !== note.created_at
              return (
                <li key={note.id} className="cn-note">
                  {isEditing ? (
                    <div className="cn-note-edit">
                      <Input
                        size="large"
                        maxLength={NOTE_TITLE_MAX}
                        showCount
                        value={editing.title}
                        onChange={(event) => setEditing((prev) => ({ ...prev, title: event.target.value }))}
                      />
                      <TextArea
                        className="cn-textarea"
                        autoSize={{ minRows: 3, maxRows: 10 }}
                        value={editing.body}
                        onChange={(event) => setEditing((prev) => ({ ...prev, body: event.target.value }))}
                      />
                      <div className="cn-actions">
                        <Button onClick={() => setEditing(null)}>Cancel</Button>
                        <Button className="cn-btn-primary" loading={savingEdit} onClick={saveEdit}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="cn-note-top">
                        <h4 className="cn-note-title">{note.title}</h4>
                        {!readOnly && (
                          <div className="cn-note-tools">
                            <Button
                              type="text"
                              aria-label="Edit note"
                              icon={<EditOutlined />}
                              className="cn-tool"
                              onClick={() => setEditing({ id: note.id, title: note.title || "", body: note.body || "" })}
                            />
                            <Popconfirm
                              title="Delete this note?"
                              okText="Delete"
                              okButtonProps={{ danger: true }}
                              onConfirm={() => deleteNote(note.id)}
                            >
                              <Button
                                type="text"
                                aria-label="Delete note"
                                icon={<DeleteOutlined />}
                                className="cn-tool cn-tool-danger"
                                loading={deletingId === note.id}
                              />
                            </Popconfirm>
                          </div>
                        )}
                      </div>
                      <p className="cn-note-body">{note.body}</p>
                      <div className="cn-note-meta">
                        <span>{note.author_name}</span>
                        <span className="cn-dot" aria-hidden="true" />
                        <span>{formatNoteDate(note.created_at)}</span>
                        {edited && (
                          <span className="cn-edited" title={`Edited ${formatNoteDate(note.updated_at)}`}>
                            Edited
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {nextPage && (
          <div className="cn-more">
            <Button onClick={loadMore} loading={loadingMore}>
              Load older notes
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}

export default StudentNotesPanel
