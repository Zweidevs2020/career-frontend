// Level 8 style "My Choices" interface for every other section (L5, L6/7, Apprenticeships,
// Tertiary, UCAS NI, EU Courses and Other). Each section only differs by the config at the
// bottom of this file; the look and behaviour match Level8Choices.
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button, Empty, Input, Popconfirm, Select, Spin, Switch, Table, Tabs, Tag, Tooltip, message } from "antd"
import {
  CheckCircleFilled,
  CheckOutlined,
  CloseCircleFilled,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  MenuOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons"
import { deleteApiWithAuth, getApiWithAuth, patchApiWithAuth, postApiWithAuth } from "../../utils/api"
import "./Level8Choices.css"
import "./ChoicesSection.css"

const MAX_CHOICES = 30
// How long a newly added item stays highlighted if the student doesn't drag it into place.
const RECENT_HIGHLIGHT_MS = 24 * 60 * 60 * 1000

/* ---------------------------------- helpers ---------------------------------- */

// Non-EU identities ignore case and surrounding whitespace (matches the backend duplicate check).
const norm = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()

const isUnsorted = (item) => !Number(item?.order_number)

// Unsorted items first, then the student's ranked items by order_number.
const sortChoices = (items) =>
  [...items].sort((a, b) => {
    const aUnsorted = isUnsorted(a)
    const bUnsorted = isUnsorted(b)
    if (aUnsorted !== bUnsorted) return aUnsorted ? -1 : 1
    return (Number(a.order_number) || 0) - (Number(b.order_number) || 0)
  })

// The api helpers return { data: axiosResponse } on success and the raw error response on failure.
const isOk = (response, codes = [200, 201]) => codes.includes(response?.data?.status)

const firstMessage = (value) => {
  if (typeof value === "string") return value
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = firstMessage(item)
      if (found) return found
    }
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      const found = firstMessage(item)
      if (found) return found
    }
  }
  return null
}

const getErrorMessage = (response, fallback) => {
  const body = response?.status >= 400 ? response?.data : response?.data?.data
  return firstMessage(body?.message) || firstMessage(body?.detail) || firstMessage(body) || fallback
}

// Distinct values of a field with how many items carry each one.
const countOptions = (items, getValue) => {
  const counts = new Map()
  items.forEach((item) => {
    const value = getValue(item)
    if (value) counts.set(value, (counts.get(value) || 0) + 1)
  })
  return Array.from(counts, ([value, count]) => ({ value, count })).sort((a, b) =>
    String(a.value).localeCompare(String(b.value)),
  )
}

const readJson = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key)
    return stored === null ? fallback : JSON.parse(stored)
  } catch (error) {
    return fallback
  }
}

const writeJson = (key, value) => {
  try {
    if (value === undefined) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    // Preference just won't survive a reload
  }
}

const pruneRecent = (recent, validIds) => {
  const now = Date.now()
  return Object.fromEntries(
    Object.entries(recent || {}).filter(
      ([id, addedAt]) => now - addedAt < RECENT_HIGHLIGHT_MS && (!validIds || validIds.has(String(id))),
    ),
  )
}

const valueOf = (column, item) => (column.value ? column.value(item) : item?.[column.key])

/* ------------------------------ shared UI pieces ------------------------------ */

const MultiSelectFilter = ({ label, placeholder, options, value, onChange }) => {
  const selected = new Set(value)
  const selectOptions = options.map((option) => ({
    value: option.value,
    text: option.value,
    label: (
      <span className="l8-option">
        <span
          className={`l8-option-check ${selected.has(option.value) ? "l8-option-check-on" : ""}`}
          aria-hidden="true"
        />
        <span className="l8-option-text">{option.value}</span>
        <span className="l8-option-count">{option.count}</span>
      </span>
    ),
  }))

  return (
    <div className="l8-filter">
      <span className="l8-filter-label">
        {label}
        {value.length > 0 && <span className="l8-filter-badge">{value.length}</span>}
      </span>
      <Select
        mode="multiple"
        allowClear
        size="large"
        placeholder={placeholder}
        value={value}
        options={selectOptions}
        onChange={onChange}
        optionLabelProp="text"
        maxTagCount="responsive"
        menuItemSelectedIcon={null}
        showSearch
        filterOption={(input, option) =>
          String(option?.text ?? "")
            .toLowerCase()
            .includes(input.trim().toLowerCase())
        }
        popupClassName="l8-filter-dropdown"
        notFoundContent={<span className="l8-filter-empty">No matches</span>}
        dropdownRender={(menu) => (
          <>
            {menu}
            {value.length > 0 && (
              <div className="l8-filter-footer">
                <span>{value.length} selected</span>
                <Button type="link" size="small" onClick={() => onChange([])}>
                  Clear
                </Button>
              </div>
            )}
          </>
        )}
      />
    </div>
  )
}

const SortableRow = ({ children, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props["data-row-key"],
  })
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  }

  return (
    <tr {...props} ref={setNodeRef} style={style}>
      {React.Children.map(children, (child) => {
        if (child?.key === "sort") {
          return React.cloneElement(child, {
            children: (
              <MenuOutlined
                className="l8-drag-handle"
                {...attributes}
                {...listeners}
                style={{ touchAction: "none", cursor: "grab" }}
              />
            ),
          })
        }
        return child
      })}
    </tr>
  )
}

const ExternalLink = ({ href, label }) =>
  href ? (
    <a href={href} target="_blank" rel="noreferrer" className="l8-link">
      {label}
    </a>
  ) : (
    "—"
  )

const renderCell = (column, item) => {
  const value = valueOf(column, item)
  if (column.type === "link") return <ExternalLink href={value} label={column.linkLabel || "View course"} />
  return value === null || value === undefined || value === "" ? "—" : value
}

const tabLabel = (className, icon, text, count) => (
  <span className={`l8-tab ${className}`}>
    {icon}
    {text}
    {count !== undefined && <span className="l8-tab-count">{count}</span>}
  </span>
)

/* --------------------- saved choices: load, rank, remove --------------------- */

const useSavedChoices = (config) => {
  const recentKey = `choices_recently_added_${config.key}`
  const [loading, setLoading] = useState(true)
  const [catalogue, setCatalogue] = useState([])
  const [choices, setChoices] = useState([])
  const [removing, setRemoving] = useState(null)
  const [recentlyAdded, setRecentlyAdded] = useState(() => pruneRecent(readJson(recentKey, {})))

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  )

  const loadData = useCallback(async () => {
    const response = await getApiWithAuth(config.collection)
    if (isOk(response, [200])) {
      const body = response.data.data || {}
      const saved = body.user_data || body.data?.user_data || []
      setCatalogue(body.level_data || body.data?.level_data || [])
      setChoices(sortChoices(saved))
      setLoading(false)
      return saved
    }
    message.error(getErrorMessage(response, `Unable to load ${config.title}`))
    setLoading(false)
    return null
  }, [config.collection, config.title])

  useEffect(() => {
    loadData()
  }, [loadData])

  const updateRecent = useCallback(
    (update) => {
      setRecentlyAdded((prev) => {
        const next = update(prev)
        if (next === prev) return prev
        writeJson(recentKey, Object.keys(next).length ? next : undefined)
        return next
      })
    },
    [recentKey],
  )

  // Forget highlights for items that were removed elsewhere (once, after the first load).
  const prunedOnLoad = useRef(false)
  useEffect(() => {
    if (loading || prunedOnLoad.current) return
    prunedOnLoad.current = true
    const validIds = new Set(choices.map((item) => String(item.id)))
    updateRecent((prev) => {
      const next = pruneRecent(prev, validIds)
      return Object.keys(next).length === Object.keys(prev).length ? prev : next
    })
  }, [choices, loading, updateRecent])

  // Remove each highlight the moment its time runs out, even if the page stays open.
  useEffect(() => {
    const times = Object.values(recentlyAdded)
    if (!times.length) return undefined
    const nextExpiry = Math.min(...times) + RECENT_HIGHLIGHT_MS - Date.now()
    const timer = setTimeout(() => updateRecent((prev) => pruneRecent(prev)), Math.max(nextExpiry, 0) + 50)
    return () => clearTimeout(timer)
  }, [recentlyAdded, updateRecent])

  const clearRecent = useCallback(
    (id) =>
      updateRecent((prev) => {
        if (!(String(id) in prev)) return prev
        const { [String(id)]: _removed, ...rest } = prev
        return rest
      }),
    [updateRecent],
  )

  const isRecent = (item) => String(item?.id) in recentlyAdded
  const unsortedCount = choices.filter(isUnsorted).length
  const limitReached = choices.length >= MAX_CHOICES

  // Adds to the bottom of the list, re-fetches, and highlights the new record.
  const addChoice = async (payload, matches) => {
    const lastOrder = choices.reduce((max, item) => Math.max(max, Number(item.order_number) || 0), 0)
    const previousIds = new Set(choices.map((item) => String(item.id)))
    const response = await postApiWithAuth(config.collection, { ...payload, order_number: lastOrder + 1 })
    const ok = isOk(response)

    const saved = await loadData()
    const added =
      saved?.find((item) => !previousIds.has(String(item.id))) || (ok ? saved?.find((item) => matches(item)) : null)

    if (ok && added) {
      updateRecent((prev) => ({ ...prev, [String(added.id)]: Date.now() }))
      message.success(`Added to the bottom of My ${config.short} Choices`)
      return true
    }
    message.error(getErrorMessage(response, `Unable to add this ${config.noun}`))
    return false
  }

  const handleDelete = async (item) => {
    setRemoving(item.id)
    const response = await deleteApiWithAuth(config.remove(item.id))
    if (isOk(response, [200, 204])) {
      clearRecent(item.id)
      message.success(`${config.nounTitle} removed`)
      await loadData()
    } else {
      message.error(getErrorMessage(response, `Unable to remove this ${config.noun}`))
    }
    setRemoving(null)
  }

  // Drag and drop: PATCH every changed rank, then re-fetch.
  const onDragEnd = async ({ active, over }) => {
    if (!active?.id || !over?.id || active.id === over.id) return
    const from = choices.findIndex((item) => item.id === active.id)
    const to = choices.findIndex((item) => item.id === over.id)
    if (from < 0 || to < 0) return

    // Dragging a recently added item counts as sorting it, so its highlight ends.
    clearRecent(active.id)
    const previous = choices
    const reordered = arrayMove(choices, from, to)
    setChoices(reordered.map((item, index) => ({ ...item, order_number: index + 1 })))
    const updates = reordered
      .map((item, index) => ({ item, order: index + 1 }))
      .filter(({ item, order }) => Number(item.order_number) !== order)
    const results = await Promise.all(
      updates.map(({ item, order }) => patchApiWithAuth(config.update(item.id), { order_number: order })),
    )
    const failed = results.find((response) => !isOk(response))
    if (failed) {
      setChoices(previous)
      message.error(getErrorMessage(failed, "Unable to save the new order"))
    }
    await loadData()
  }

  const numberColumn = {
    title: "No.",
    key: "no",
    width: 58,
    render: (_, item, index) => (
      <>
        {isRecent(item) && (
          <Tooltip title="Recently added. Drag it into place to confirm its position.">
            <span className="l8-new-badge l8-recent-tag">Recently added</span>
          </Tooltip>
        )}
        {isUnsorted(item) ? <Tag color="orange">Unsorted</Tag> : index + 1 - unsortedCount}
      </>
    ),
  }

  const removeColumn = {
    title: "Remove",
    key: "remove",
    width: 96,
    align: "center",
    render: (_, item) => (
      <Popconfirm
        title={`Remove this ${config.noun}?`}
        okText="Remove"
        okButtonProps={{ danger: true }}
        onConfirm={() => handleDelete(item)}
      >
        <Button
          type="text"
          danger
          loading={removing === item.id}
          aria-label={`Remove ${config.noun}`}
          icon={<DeleteOutlined />}
        />
      </Popconfirm>
    ),
  }

  const rowClassName = (item) => (isUnsorted(item) ? "l8-row-unsorted" : isRecent(item) ? "l8-row-recent" : "")

  const renderChoicesTable = (columns, emptyText) => (
    <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext items={choices.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <Table
          rowKey="id"
          columns={[{ title: "", key: "sort", width: 42 }, numberColumn, ...columns, removeColumn]}
          dataSource={choices}
          pagination={false}
          components={{ body: { row: SortableRow } }}
          rowClassName={rowClassName}
          locale={{ emptyText: <Empty description={emptyText} /> }}
          className="l8-table l8-choices-table"
        />
      </SortableContext>
    </DndContext>
  )

  const unsortedHint =
    unsortedCount > 0 ? (
      <span className="l8-hint">
        {unsortedCount} {unsortedCount === 1 ? `${config.noun} is` : `${config.nounPlural} are`} not sorted yet. Drag
        the handle to rank {unsortedCount === 1 ? "it" : "them"}.
      </span>
    ) : null

  return {
    loading,
    catalogue,
    choices,
    setChoices,
    removing,
    limitReached,
    loadData,
    addChoice,
    handleDelete,
    renderChoicesTable,
    unsortedHint,
  }
}

/* ------------------------ catalogue-based sections ------------------------ */

const CatalogueSection = ({ config }) => {
  const saved = useSavedChoices(config)
  const { loading, catalogue, choices, removing, limitReached, addChoice, handleDelete } = saved
  const pointsKey = `choices_show_points_${config.key}`

  const [activeTab, setActiveTab] = useState("search")
  const [adding, setAdding] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [selected, setSelected] = useState(() => Object.fromEntries(config.filters.map((f) => [f.key, []])))
  const [showPoints, setShowPoints] = useState(() => readJson(pointsKey, true) !== false)

  const catalogueIdentity = config.identity
  const savedIdentity = config.savedIdentity || config.identity
  const choiceByIdentity = useMemo(
    () => new Map(choices.map((item) => [savedIdentity(item), item])),
    [choices, savedIdentity],
  )

  // Only show columns the data actually has (sections differ, and some fields are optional).
  const hasValue = useCallback(
    (column) =>
      !column.optional ||
      catalogue.some((item) => valueOf(column, item)) ||
      choices.some((item) => valueOf(column, item)),
    [catalogue, choices],
  )

  // Each filter narrows the options of the filters after it (e.g. Region -> County -> College).
  const filterSteps = useMemo(() => {
    const steps = []
    let scoped = catalogue
    config.filters.forEach((filter) => {
      const getValue = filter.value || ((item) => item?.[filter.key])
      const options = countOptions(scoped, getValue)
      steps.push({ filter, options, getValue })
      const values = selected[filter.key] || []
      if (values.length) scoped = scoped.filter((item) => values.includes(getValue(item)))
    })
    return { steps, scoped }
  }, [catalogue, config.filters, selected])

  // Drop selections that are no longer reachable after a parent filter changes.
  useEffect(() => {
    setSelected((prev) => {
      let changed = false
      const next = { ...prev }
      filterSteps.steps.forEach(({ filter, options }) => {
        const available = new Set(options.map((option) => option.value))
        const current = prev[filter.key] || []
        const kept = current.filter((value) => available.has(value))
        if (kept.length !== current.length) {
          next[filter.key] = kept
          changed = true
        }
      })
      return changed ? next : prev
    })
  }, [filterSteps])

  const filteredCourses = useMemo(() => {
    const query = searchText.trim().toLowerCase()
    if (!query) return filterSteps.scoped
    const searchValues = config.searchValues || ((item) => config.searchKeys.map((key) => item?.[key]))
    return filterSteps.scoped.filter((item) =>
      searchValues(item).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      ),
    )
  }, [filterSteps.scoped, searchText, config])

  const hasFilters = Boolean(searchText.trim() || Object.values(selected).some((values) => values.length))

  const clearFilters = () => {
    setSearchText("")
    setSelected(Object.fromEntries(config.filters.map((f) => [f.key, []])))
  }

  const toggleShowPoints = (checked) => {
    setShowPoints(checked)
    writeJson(pointsKey, checked)
  }

  const handleAdd = async (course) => {
    if (limitReached) {
      message.warning(
        `You can only have ${MAX_CHOICES} ${config.nounPlural} in My ${config.short} Choices. Remove one to add another.`,
      )
      return
    }
    const identity = catalogueIdentity(course)
    if (choiceByIdentity.has(identity)) {
      message.info(`This ${config.noun} is already in My ${config.short} Choices`)
      return
    }
    setAdding(identity)
    await addChoice(config.payload(course), (item) => savedIdentity(item) === identity)
    setAdding(null)
  }

  const visibleColumns = config.columns.filter(hasValue)
  const pointsColumn = visibleColumns.find((column) => column.type === "points")

  const searchColumns = [
    ...visibleColumns.map((column) => ({
      title: column.title,
      key: column.key,
      width: column.searchWidth || column.width,
      render: (_, item) => renderCell(column, item),
    })),
    {
      title: "Add to My Choices",
      key: "add",
      width: 150,
      align: "center",
      fixed: "right",
      render: (_, course) => {
        const identity = catalogueIdentity(course)
        const savedItem = choiceByIdentity.get(identity)
        const name = valueOf(config.columns.find((column) => column.isName) || {}, course) || config.noun
        if (savedItem) {
          return (
            <Popconfirm
              title={`Remove from My ${config.short} Choices?`}
              okText="Remove"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(savedItem)}
            >
              <Tooltip title={`Remove from My ${config.short} Choices`}>
                <button
                  type="button"
                  aria-label={`Remove ${name} from My Choices`}
                  className="l8-icon-btn l8-icon-btn-added"
                  disabled={removing === savedItem.id}
                >
                  {removing === savedItem.id ? (
                    <LoadingOutlined />
                  ) : (
                    <>
                      <CheckCircleFilled className="l8-added-icon" />
                      <CloseCircleFilled className="l8-remove-icon" />
                    </>
                  )}
                </button>
              </Tooltip>
            </Popconfirm>
          )
        }
        return (
          <Tooltip title={limitReached ? `Limit of ${MAX_CHOICES} ${config.nounPlural} reached` : "Add to My Choices"}>
            <button
              type="button"
              aria-label={`Add ${name} to My Choices`}
              className="l8-icon-btn l8-icon-btn-add"
              disabled={limitReached || adding === identity}
              onClick={() => handleAdd(course)}
            >
              {adding === identity ? <LoadingOutlined /> : <PlusCircleOutlined />}
            </button>
          </Tooltip>
        )
      },
    },
  ]

  const choiceColumns = visibleColumns
    .filter((column) => !column.searchOnly && !(column.type === "points" && !showPoints))
    .map((column) => ({
      title: column.title,
      key: column.key,
      width: column.width,
      render: (_, item) => renderCell(column, item),
    }))

  if (loading) return <Spin className="spinStyle" />

  const visibleFilters = filterSteps.steps.filter(({ options }) => options.length > 0)

  const searchTab = (
    <div className="l8-panel">
      <div className="l8-filters">
        <Input
          allowClear
          size="large"
          className="l8-search"
          prefix={<SearchOutlined />}
          placeholder={config.searchPlaceholder}
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        {visibleFilters.length > 0 && (
          <div className="l8-selects">
            {visibleFilters.map(({ filter, options }) => (
              <MultiSelectFilter
                key={filter.key}
                label={filter.label}
                placeholder={`All ${filter.plural}`}
                options={options}
                value={selected[filter.key] || []}
                onChange={(values) => setSelected((prev) => ({ ...prev, [filter.key]: values }))}
              />
            ))}
          </div>
        )}
      </div>

      <div className="l8-resultbar">
        <span className="l8-count" aria-live="polite">
          {filteredCourses.length}{" "}
          {filteredCourses.length === 1 ? `${config.noun} matches` : `${config.nounPlural} match`} your selection
        </span>
        {hasFilters && (
          <Button type="link" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
        <span className={`l8-quota ${limitReached ? "l8-quota-full" : ""}`}>
          {choices.length}/{MAX_CHOICES} choices used
        </span>
      </div>

      <Table
        rowKey={(course) => course.id ?? catalogueIdentity(course)}
        columns={searchColumns}
        dataSource={filteredCourses}
        pagination={{ pageSize: 25, showSizeChanger: false, hideOnSinglePage: true }}
        scroll={{ x: "max-content" }}
        locale={{ emptyText: <Empty description={`No ${config.nounPlural} match your search`} /> }}
        className="l8-table"
      />
    </div>
  )

  const choicesTab = (
    <div className="l8-panel">
      <div className="l8-resultbar">
        <span className="l8-count">
          {choices.length}/{MAX_CHOICES} {config.nounPlural} selected
        </span>
        {saved.unsortedHint}
        {pointsColumn && (
          <label className="l8-points-toggle">
            <Switch size="small" checked={showPoints} onChange={toggleShowPoints} />
            <span>Show points</span>
          </label>
        )}
      </div>
      {saved.renderChoicesTable(
        choiceColumns,
        `You haven't added any ${config.nounPlural} yet. Use ${config.searchTab} to add some.`,
      )}
    </div>
  )

  return (
    <div className="l8-wrapper">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="large"
        className="l8-tabs"
        items={[
          {
            key: "search",
            label: tabLabel("l8-tab-search", <SearchOutlined />, config.searchTab),
            children: searchTab,
          },
          {
            key: "choices",
            label: tabLabel("l8-tab-choices", <UnorderedListOutlined />, `My ${config.short} Choices`, choices.length),
            children: choicesTab,
          },
        ]}
      />
    </div>
  )
}

/* -------------------- Other Options (free-text ideas) -------------------- */

const OtherOptionsSection = ({ config }) => {
  const saved = useSavedChoices(config)
  const { loading, choices, limitReached, addChoice, loadData } = saved
  const [newIdea, setNewIdea] = useState("")
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)

  const isDuplicate = (idea, exceptId) =>
    choices.some((item) => item.id !== exceptId && norm(item.idea) === norm(idea))

  const handleAdd = async () => {
    const idea = newIdea.trim()
    if (!idea) return
    if (limitReached) {
      message.warning(`You can only have ${MAX_CHOICES} options. Remove one to add another.`)
      return
    }
    if (isDuplicate(idea)) {
      message.info("This option is already in your list")
      return
    }
    setAdding(true)
    const added = await addChoice({ idea }, (item) => norm(item.idea) === norm(idea))
    if (added) setNewIdea("")
    setAdding(false)
  }

  const saveEdit = async () => {
    const idea = editing?.value.trim()
    if (!idea) {
      message.error("Please enter an option")
      return
    }
    if (isDuplicate(idea, editing.id)) {
      message.info("This option is already in your list")
      return
    }
    setSavingEdit(true)
    const response = await patchApiWithAuth(config.update(editing.id), { idea })
    if (isOk(response)) {
      message.success("Option updated")
      setEditing(null)
      await loadData()
    } else {
      message.error(getErrorMessage(response, "Unable to update this option"))
    }
    setSavingEdit(false)
  }

  const ideaColumn = {
    title: "Option",
    key: "idea",
    render: (_, item) =>
      editing?.id === item.id ? (
        <div className="cs-edit-row">
          <Input
            autoFocus
            value={editing.value}
            maxLength={255}
            onChange={(event) => setEditing({ ...editing, value: event.target.value })}
            onPressEnter={saveEdit}
            onKeyDown={(event) => event.key === "Escape" && setEditing(null)}
          />
          <Tooltip title="Save">
            <Button type="text" className="cs-edit-save" loading={savingEdit} icon={<CheckOutlined />} onClick={saveEdit} />
          </Tooltip>
          <Tooltip title="Cancel">
            <Button type="text" className="cs-edit-cancel" icon={<CloseOutlined />} onClick={() => setEditing(null)} />
          </Tooltip>
        </div>
      ) : (
        <div className="cs-idea-cell">
          <span>{item.idea}</span>
          <Tooltip title="Edit">
            <Button
              type="text"
              className="cs-edit-btn"
              aria-label="Edit option"
              icon={<EditOutlined />}
              onClick={() => setEditing({ id: item.id, value: item.idea || "" })}
            />
          </Tooltip>
        </div>
      ),
  }

  if (loading) return <Spin className="spinStyle" />

  return (
    <div className="l8-wrapper">
      <Tabs
        activeKey="choices"
        size="large"
        className="l8-tabs"
        items={[
          {
            key: "choices",
            label: tabLabel("l8-tab-choices", <UnorderedListOutlined />, "My Other Options", choices.length),
            children: (
              <div className="l8-panel">
                <div className="cs-add-bar">
                  <Input
                    size="large"
                    maxLength={255}
                    placeholder="Add another option, e.g. Gap year, Defence Forces, Work"
                    value={newIdea}
                    disabled={limitReached}
                    onChange={(event) => setNewIdea(event.target.value)}
                    onPressEnter={handleAdd}
                  />
                  <Button
                    size="large"
                    className="cs-add-btn"
                    icon={<PlusOutlined />}
                    loading={adding}
                    disabled={limitReached || !newIdea.trim()}
                    onClick={handleAdd}
                  >
                    Add option
                  </Button>
                </div>
                <div className="l8-resultbar">
                  <span className="l8-count">
                    {choices.length}/{MAX_CHOICES} options added
                  </span>
                  {saved.unsortedHint}
                </div>
                {saved.renderChoicesTable([ideaColumn], "You haven't added any other options yet.")}
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}

/* ------------------------------- section configs ------------------------------- */

const COURSE_INFO = { key: "course_information", title: "Course Info", type: "link", width: 120, optional: true }
const POINTS = {
  key: "point",
  title: "Points",
  type: "points",
  width: 80,
  optional: true,
  value: (item) => item?.point ?? item?.points,
}
const REGION = { key: "region", title: "Region", searchOnly: true, optional: true, width: 140 }
const COUNTY = { key: "county", title: "County", searchOnly: true, optional: true, width: 130 }
const withoutId = ({ id, ...rest }) => rest

const euLocation = (item) => item?.location || [item?.city, item?.country].filter(Boolean).join(", ")

const SECTION_CONFIGS = {
  level6: {
    key: "level6",
    title: "Level 6/7 courses",
    short: "L6/7",
    collection: "choices/level6/",
    update: (id) => `choices/update-level6/${id}/`,
    remove: (id) => `choices/delete-level6/${id}/`,
    identity: (item) => norm(item.code),
    payload: withoutId,
    searchKeys: ["code", "title", "college", "county", "region"],
    filters: [
      { key: "region", label: "Region", plural: "regions" },
      { key: "county", label: "County", plural: "counties" },
      { key: "college", label: "College", plural: "colleges" },
    ],
    columns: [
      { key: "code", title: "Code", width: 105, searchWidth: 120 },
      { key: "title", title: "Course Title", width: 285, searchWidth: 320, isName: true },
      { key: "college", title: "College", width: 245, searchWidth: 280 },
      COUNTY,
      REGION,
      POINTS,
      COURSE_INFO,
    ],
  },
  level5: {
    key: "level5",
    title: "Level 5 courses",
    short: "L5",
    collection: "choices/level5/",
    update: (id) => `choices/update-level5/${id}/`,
    remove: (id) => `choices/delete-level5/${id}/`,
    // Catalogue items carry the full code; saved items show an abbreviated code and keep
    // the full identifier in code_display.
    identity: (item) => norm(item.code),
    savedIdentity: (item) => norm(item.code_display || item.code),
    payload: withoutId,
    searchKeys: ["code", "title", "college", "county", "region"],
    filters: [
      { key: "region", label: "Region", plural: "regions" },
      { key: "county", label: "County", plural: "counties" },
      { key: "college", label: "College", plural: "colleges" },
    ],
    columns: [
      { key: "code", title: "Code", width: 120, searchWidth: 140 },
      { key: "title", title: "Course Title", width: 285, searchWidth: 320, isName: true },
      { key: "college", title: "College", width: 245, searchWidth: 280 },
      COUNTY,
      REGION,
      POINTS,
      COURSE_INFO,
    ],
  },
  apprentice: {
    key: "apprentice",
    title: "apprenticeships",
    short: "Apprenticeship",
    noun: "apprenticeship",
    nounPlural: "apprenticeships",
    searchTab: "Apprenticeship Search",
    searchPlaceholder: "Search by apprenticeship, provider or location",
    collection: "choices/apprentice/",
    update: (id) => `choices/update-apprentice/${id}/`,
    remove: (id) => `choices/apprentice/${id}/`,
    identity: (item) => [item.name, item.provider, item.level].map(norm).join("|"),
    payload: withoutId,
    searchKeys: ["name", "provider", "location", "county", "level"],
    filters: [
      { key: "county", label: "County", plural: "counties" },
      { key: "provider", label: "Provider", plural: "providers" },
      { key: "level", label: "Level", plural: "levels" },
    ],
    columns: [
      { key: "name", title: "Apprenticeship", width: 285, searchWidth: 320, isName: true },
      { key: "provider", title: "Provider", width: 220, searchWidth: 260 },
      { key: "level", title: "Level", width: 90, optional: true },
      { key: "location", title: "Location", width: 160, optional: true },
      COUNTY,
      { ...COURSE_INFO, title: "Info", linkLabel: "View details" },
    ],
  },
  tertiary: {
    key: "tertiary",
    title: "Tertiary degrees",
    short: "Tertiary",
    collection: "choices/tertiary-degree/",
    update: (id) => `choices/update-tertiary/${id}/`,
    remove: (id) => `choices/tertiary-degree/${id}/`,
    identity: (item) => norm(item.code),
    payload: withoutId,
    searchKeys: ["code", "title", "college", "level"],
    filters: [
      { key: "college", label: "College", plural: "colleges" },
      { key: "level", label: "Level", plural: "levels" },
    ],
    columns: [
      { key: "code", title: "Code", width: 105, searchWidth: 120, optional: true },
      { key: "title", title: "Course Title", width: 285, searchWidth: 320, isName: true },
      { key: "college", title: "College", width: 245, searchWidth: 280 },
      { key: "duration", title: "Duration", width: 110, optional: true },
      { key: "level", title: "Level", width: 90, optional: true },
      COURSE_INFO,
    ],
  },
  "ucas-ni": {
    key: "ucas-ni",
    title: "UCAS Northern Ireland courses",
    short: "UCAS NI",
    collection: "choices/ucas-ni/",
    update: (id) => `choices/ucas-ni/${id}/`,
    remove: (id) => `choices/ucas-ni/${id}/`,
    identity: (item) => norm(item.code),
    payload: withoutId,
    searchKeys: ["code", "title", "college"],
    filters: [
      { key: "college", label: "College", plural: "colleges" },
      { key: "nfq_level", label: "NFQ Level", plural: "levels" },
    ],
    columns: [
      { key: "code", title: "Course Code", width: 120, searchWidth: 130 },
      { key: "title", title: "Course Title", width: 285, searchWidth: 320, isName: true },
      { key: "college", title: "College", width: 245, searchWidth: 280 },
      { key: "nfq_level", title: "NFQ Level", width: 100, optional: true },
      COURSE_INFO,
    ],
  },
  eu_courses: {
    key: "eu_courses",
    title: "EU courses",
    short: "EU",
    searchPlaceholder: "Search by course title or location (city or country)",
    collection: "choices/eu-courses/",
    update: (id) => `choices/eu-courses/${id}/`,
    remove: (id) => `choices/eu-courses/${id}/`,
    // EU links are exact catalogue identifiers: never change their case or format.
    identity: (item) => String(item.link ?? ""),
    payload: (course) => ({ link: course.link }),
    searchValues: (item) => [item.title, euLocation(item)],
    filters: [
      { key: "country", label: "Country", plural: "countries" },
      { key: "university", label: "University", plural: "universities" },
    ],
    columns: [
      { key: "title", title: "Title", width: 240, searchWidth: 280, isName: true },
      { key: "university", title: "University", width: 220, searchWidth: 250 },
      { key: "location", title: "Location", width: 170, value: euLocation },
      { key: "duration", title: "Duration", width: 100, optional: true },
      { key: "tuition_fee", title: "Tuition Fee", width: 120, optional: true },
      { key: "link", title: "Course Info", type: "link", width: 120 },
    ],
  },
  other: {
    key: "other",
    kind: "ideas",
    title: "other options",
    short: "Other",
    noun: "option",
    nounPlural: "options",
    collection: "choices/other/",
    update: (id) => `choices/update-other/${id}/`,
    remove: (id) => `choices/delete-other/${id}/`,
  },
}

export const getSectionConfig = (sectionId) => {
  const config = SECTION_CONFIGS[sectionId]
  if (!config) return null
  const noun = config.noun || "course"
  return {
    searchTab: "Course Search",
    searchPlaceholder: "Search by course title, code or college",
    filters: [],
    ...config,
    noun,
    nounPlural: config.nounPlural || `${noun}s`,
    nounTitle: noun.charAt(0).toUpperCase() + noun.slice(1),
  }
}

const ChoicesSection = ({ config }) =>
  config.kind === "ideas" ? <OtherOptionsSection config={config} /> : <CatalogueSection config={config} />

export default ChoicesSection
