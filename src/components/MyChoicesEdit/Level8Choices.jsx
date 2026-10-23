import React, { useCallback, useEffect, useMemo, useState } from "react"
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button, Empty, Input, Popconfirm, Select, Spin, Switch, Table, Tabs, Tag, Tooltip, message } from "antd"
import {
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
  LoadingOutlined,
  MenuOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons"
import { deleteApiWithAuth, getApiWithAuth, patchApiWithAuth, postApiWithAuth } from "../../utils/api"
import "./Level8Choices.css"

const MAX_CHOICES = 30
const SHOW_POINTS_KEY = "l8_show_points"
const ENDPOINT = "level8"

const isUnsorted = (item) => !Number(item?.order_number)

// Unsorted courses first, then the student's ranked courses by order_number.
const sortChoices = (items) =>
  [...items].sort((a, b) => {
    const aUnsorted = isUnsorted(a)
    const bUnsorted = isUnsorted(b)
    if (aUnsorted !== bUnsorted) return aUnsorted ? -1 : 1
    return (Number(a.order_number) || 0) - (Number(b.order_number) || 0)
  })

const getErrorMessage = (response, fallback) => {
  const data = response?.data
  if (typeof data?.message === "string" && data.message) return data.message
  if (typeof data?.data === "string" && data.data) return data.data
  return fallback
}

// Distinct values of `key` with how many courses carry each one.
const countOptions = (courses, key) => {
  const counts = new Map()
  courses.forEach((course) => {
    const value = course?.[key]
    if (value) counts.set(value, (counts.get(value) || 0) + 1)
  })
  return Array.from(counts, ([value, count]) => ({ value, count })).sort((a, b) =>
    String(a.value).localeCompare(String(b.value)),
  )
}

const readShowPoints = () => {
  try {
    return localStorage.getItem(SHOW_POINTS_KEY) !== "false"
  } catch (error) {
    return true
  }
}

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

const CourseLink = ({ href }) =>
  href ? (
    <a href={href} target="_blank" rel="noreferrer" className="l8-link">
      View course
    </a>
  ) : (
    "—"
  )

const Level8Choices = () => {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])
  const [choices, setChoices] = useState([])
  const [activeTab, setActiveTab] = useState("search")
  const [adding, setAdding] = useState(null)
  const [removing, setRemoving] = useState(null)

  const [searchText, setSearchText] = useState("")
  const [regions, setRegions] = useState([])
  const [counties, setCounties] = useState([])
  const [colleges, setColleges] = useState([])
  const [showPoints, setShowPoints] = useState(readShowPoints)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  )

  const loadData = useCallback(async () => {
    const response = await getApiWithAuth(`choices/${ENDPOINT}/`)
    if (response?.data?.status === 200) {
      setCourses(response.data.data.level_data || [])
      setChoices(sortChoices(response.data.data.user_data || []))
    } else {
      message.error(getErrorMessage(response, "Unable to load Level 8 courses"))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const choiceByCode = useMemo(() => new Map(choices.map((item) => [item.code, item])), [choices])
  const limitReached = choices.length >= MAX_CHOICES
  const unsortedCount = choices.filter(isUnsorted).length

  // Each filter narrows the options offered by the filters after it: Region -> County -> College.
  const regionScoped = useMemo(
    () => (regions.length ? courses.filter((course) => regions.includes(course.region)) : courses),
    [courses, regions],
  )
  const countyScoped = useMemo(
    () => (counties.length ? regionScoped.filter((course) => counties.includes(course.county)) : regionScoped),
    [regionScoped, counties],
  )

  const regionOptions = useMemo(() => countOptions(courses, "region"), [courses])
  const countyOptions = useMemo(() => countOptions(regionScoped, "county"), [regionScoped])
  const collegeOptions = useMemo(() => countOptions(countyScoped, "college"), [countyScoped])
  const hasRegion = regionOptions.length > 0
  const hasCounty = useMemo(() => courses.some((course) => course.county), [courses])

  // Drop selections that are no longer reachable after a parent filter changes.
  useEffect(() => {
    const available = new Set(countyOptions.map((option) => option.value))
    setCounties((prev) => (prev.every((value) => available.has(value)) ? prev : prev.filter((value) => available.has(value))))
  }, [countyOptions])

  useEffect(() => {
    const available = new Set(collegeOptions.map((option) => option.value))
    setColleges((prev) => (prev.every((value) => available.has(value)) ? prev : prev.filter((value) => available.has(value))))
  }, [collegeOptions])

  const filteredCourses = useMemo(() => {
    const query = searchText.trim().toLowerCase()
    return countyScoped.filter((course) => {
      if (colleges.length && !colleges.includes(course.college)) return false
      if (!query) return true
      return [course.code, course.title, course.college, course.county, course.region].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      )
    })
  }, [countyScoped, searchText, colleges])

  const hasFilters = Boolean(searchText.trim() || regions.length || counties.length || colleges.length)

  const clearFilters = () => {
    setSearchText("")
    setRegions([])
    setCounties([])
    setColleges([])
  }

  const toggleShowPoints = (checked) => {
    setShowPoints(checked)
    try {
      localStorage.setItem(SHOW_POINTS_KEY, String(checked))
    } catch (error) {
      // Preference just won't be remembered
    }
  }

  const persistOrder = async (ordered) => {
    const updates = ordered
      .map((item, index) => ({ item, order: index + 1 }))
      .filter(({ item, order }) => Number(item.order_number) !== order)
    await Promise.all(
      updates.map(({ item, order }) =>
        patchApiWithAuth(`choices/update-${ENDPOINT}/${item.id}/`, { order_number: order }),
      ),
    )
  }

  const handleAdd = async (course) => {
    if (limitReached) {
      message.warning(`You can only have ${MAX_CHOICES} courses in My L8 Choices. Remove one to add another.`)
      return
    }
    if (choiceByCode.has(course.code)) {
      message.info("This course is already in My L8 Choices")
      return
    }

    setAdding(course.code)
    const { id, ...rest } = course
    const previousOrder = choices.filter((item) => !isUnsorted(item))
    const response = await postApiWithAuth(`choices/${ENDPOINT}/`, { ...rest, order_number: 1 })

    if (response?.data?.status === 200 || response?.data?.status === 201) {
      // Re-read so we have the new record's id, then put it at the top of the ranked list.
      const refreshed = await getApiWithAuth(`choices/${ENDPOINT}/`)
      if (refreshed?.data?.status === 200) {
        const saved = refreshed.data.data.user_data || []
        const added = saved.find((item) => item.code === course.code)
        const others = previousOrder
          .map((item) => saved.find((s) => s.id === item.id))
          .filter(Boolean)
        const ordered = added ? [added, ...others] : others
        await persistOrder(ordered)
      }
      await loadData()
      message.success("Added to the top of My L8 Choices")
    } else {
      message.error(getErrorMessage(response, "Unable to add this course"))
    }
    setAdding(null)
  }

  const handleDelete = async (item) => {
    setRemoving(item.id)
    const response = await deleteApiWithAuth(`choices/delete-${ENDPOINT}/${item.id}/`)
    if (response?.data?.status === 204 || response?.data?.status === 200) {
      message.success("Course removed")
      await loadData()
    } else {
      message.error(getErrorMessage(response, "Unable to remove this course"))
    }
    setRemoving(null)
  }

  const onDragEnd = async ({ active, over }) => {
    if (!active?.id || !over?.id || active.id === over.id) return
    const from = choices.findIndex((item) => item.id === active.id)
    const to = choices.findIndex((item) => item.id === over.id)
    if (from < 0 || to < 0) return

    const previous = choices
    const reordered = arrayMove(choices, from, to)
    setChoices(reordered.map((item, index) => ({ ...item, order_number: index + 1 })))
    try {
      await persistOrder(reordered)
    } catch (error) {
      setChoices(previous)
      message.error("Unable to save the new order")
    }
    await loadData()
  }

  const searchColumns = [
    { title: "Code", dataIndex: "code", key: "code", width: 120 },
    { title: "Course Title", dataIndex: "title", key: "title", width: 320 },
    { title: "College", dataIndex: "college", key: "college", width: 280 },
    ...(hasCounty ? [{ title: "County", dataIndex: "county", key: "county", width: 130 }] : []),
    ...(hasRegion ? [{ title: "Region", dataIndex: "region", key: "region", width: 150 }] : []),
    {
      title: "Points",
      key: "points",
      width: 90,
      render: (_, course) => course.point ?? course.points ?? "—",
    },
    {
      title: "Course Info",
      dataIndex: "course_information",
      key: "course_information",
      width: 120,
      render: (href) => <CourseLink href={href} />,
    },
    {
      title: "Add to My Choices",
      key: "add",
      width: 150,
      align: "center",
      fixed: "right",
      render: (_, course) => {
        const saved = choiceByCode.get(course.code)
        if (saved) {
          return (
            <Popconfirm
              title="Remove from My L8 Choices?"
              okText="Remove"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(saved)}
            >
              <Tooltip title="Remove from My L8 Choices">
                <button
                  type="button"
                  aria-label={`Remove ${course.title} from My Choices`}
                  className="l8-icon-btn l8-icon-btn-added"
                  disabled={removing === saved.id}
                >
                  {removing === saved.id ? (
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
          <Tooltip title={limitReached ? `Limit of ${MAX_CHOICES} courses reached` : "Add to My Choices"}>
            <button
              type="button"
              aria-label={`Add ${course.title} to My Choices`}
              className="l8-icon-btn l8-icon-btn-add"
              disabled={limitReached || adding === course.code}
              onClick={() => handleAdd(course)}
            >
              {adding === course.code ? <LoadingOutlined /> : <PlusCircleOutlined />}
            </button>
          </Tooltip>
        )
      },
    },
  ]

  const choiceColumns = [
    { title: "", key: "sort", width: 42 },
    {
      title: "No.",
      key: "no",
      width: 58,
      render: (_, item, index) => (isUnsorted(item) ? <Tag color="orange">Unsorted</Tag> : index + 1 - unsortedCount),
    },
    { title: "Code", dataIndex: "code", key: "code", width: 105 },
    { title: "Course Title", dataIndex: "title", key: "title", width: 285 },
    { title: "College", dataIndex: "college", key: "college", width: 245 },
    ...(showPoints
      ? [
          {
            title: "Points",
            key: "points",
            width: 75,
            render: (_, item) => item.point ?? item.points ?? "—",
          },
        ]
      : []),
    {
      title: "Course Info",
      dataIndex: "course_information",
      key: "course_information",
      width: 125,
      render: (href) => <CourseLink href={href} />,
    },
    {
      title: "Remove",
      key: "remove",
      width: 96,
      align: "center",
      render: (_, item) => (
        <Popconfirm
          title="Remove this course?"
          okText="Remove"
          okButtonProps={{ danger: true }}
          onConfirm={() => handleDelete(item)}
        >
          <Button type="text" danger aria-label={`Remove ${item.title}`} icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ]

  const searchTab = (
    <div className="l8-panel">
      <div className="l8-filters">
        <Input
          allowClear
          size="large"
          className="l8-search"
          prefix={<SearchOutlined />}
          placeholder="Search by course title, code or college"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <div className="l8-selects">
          {hasRegion && (
            <MultiSelectFilter
              label="Region"
              placeholder="All regions"
              options={regionOptions}
              value={regions}
              onChange={setRegions}
            />
          )}
          {hasCounty && (
            <MultiSelectFilter
              label="County"
              placeholder="All counties"
              options={countyOptions}
              value={counties}
              onChange={setCounties}
            />
          )}
          <MultiSelectFilter
            label="College"
            placeholder="All colleges"
            options={collegeOptions}
            value={colleges}
            onChange={setColleges}
          />
        </div>
      </div>

      <div className="l8-resultbar">
        <span className="l8-count" aria-live="polite">
          {filteredCourses.length} {filteredCourses.length === 1 ? "course matches" : "courses match"} your selection
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
        rowKey={(course) => course.id ?? course.code}
        columns={searchColumns}
        dataSource={filteredCourses}
        pagination={{ pageSize: 25, showSizeChanger: false, hideOnSinglePage: true }}
        scroll={{ x: "max-content" }}
        locale={{ emptyText: <Empty description="No courses match your search" /> }}
        className="l8-table"
      />
    </div>
  )

  const choicesTab = (
    <div className="l8-panel">
      <div className="l8-resultbar">
        <span className="l8-count">
          {choices.length}/{MAX_CHOICES} courses selected
        </span>
        {unsortedCount > 0 && (
          <span className="l8-hint">
            {unsortedCount} {unsortedCount === 1 ? "course is" : "courses are"} not sorted yet. Drag the handle to rank
            {unsortedCount === 1 ? " it" : " them"}.
          </span>
        )}
        <label className="l8-points-toggle">
          <Switch size="small" checked={showPoints} onChange={toggleShowPoints} />
          <span>Show points</span>
        </label>
      </div>
      <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext items={choices.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <Table
            rowKey="id"
            columns={choiceColumns}
            dataSource={choices}
            pagination={false}
            components={{ body: { row: SortableRow } }}
            rowClassName={(item) => (isUnsorted(item) ? "l8-row-unsorted" : "")}
            locale={{
              emptyText: (
                <Empty description="You haven't added any Level 8 courses yet. Use Course Search to add some." />
              ),
            }}
            className="l8-table l8-choices-table"
          />
        </SortableContext>
      </DndContext>
    </div>
  )

  if (loading) return <Spin className="spinStyle" />

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
            label: (
              <span className="l8-tab l8-tab-search">
                <SearchOutlined />
                Course Search
              </span>
            ),
            children: searchTab,
          },
          {
            key: "choices",
            label: (
              <span className="l8-tab l8-tab-choices">
                <UnorderedListOutlined />
                My L8 Choices
                <span className="l8-tab-count">{choices.length}</span>
              </span>
            ),
            children: choicesTab,
          },
        ]}
      />
    </div>
  )
}

export default Level8Choices
