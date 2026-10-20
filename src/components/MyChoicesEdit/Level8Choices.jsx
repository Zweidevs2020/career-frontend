import React, { useCallback, useEffect, useMemo, useState } from "react"
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button, Empty, Input, Popconfirm, Select, Spin, Table, Tabs, Tag, Tooltip, message } from "antd"
import {
  CheckCircleFilled,
  DeleteOutlined,
  MenuOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { deleteApiWithAuth, getApiWithAuth, patchApiWithAuth, postApiWithAuth } from "../../utils/api"
import "./Level8Choices.css"

const MAX_CHOICES = 10
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

const uniqueOptions = (courses, key) =>
  Array.from(new Set(courses.map((course) => course?.[key]).filter(Boolean)))
    .sort((a, b) => String(a).localeCompare(String(b)))
    .map((value) => ({ value, label: value }))

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

  const [searchText, setSearchText] = useState("")
  const [region, setRegion] = useState(null)
  const [county, setCounty] = useState(null)
  const [college, setCollege] = useState(null)

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

  const choiceCodes = useMemo(() => new Set(choices.map((item) => item.code)), [choices])
  const limitReached = choices.length >= MAX_CHOICES
  const unsortedCount = choices.filter(isUnsorted).length

  const regionOptions = useMemo(() => uniqueOptions(courses, "region"), [courses])
  const hasRegion = regionOptions.length > 0

  const countyOptions = useMemo(
    () => uniqueOptions(region ? courses.filter((course) => course.region === region) : courses, "county"),
    [courses, region],
  )
  const hasCounty = countyOptions.length > 0

  const collegeOptions = useMemo(() => {
    let scoped = courses
    if (region) scoped = scoped.filter((course) => course.region === region)
    if (county) scoped = scoped.filter((course) => course.county === county)
    return uniqueOptions(scoped, "college")
  }, [courses, region, county])

  const filteredCourses = useMemo(() => {
    const query = searchText.trim().toLowerCase()
    return courses.filter((course) => {
      if (region && course.region !== region) return false
      if (county && course.county !== county) return false
      if (college && course.college !== college) return false
      if (!query) return true
      return [course.code, course.title, course.college, course.county, course.region].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      )
    })
  }, [courses, searchText, region, county, college])

  const hasFilters = Boolean(searchText.trim() || region || county || college)

  const clearFilters = () => {
    setSearchText("")
    setRegion(null)
    setCounty(null)
    setCollege(null)
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
    if (choiceCodes.has(course.code)) {
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
    const response = await deleteApiWithAuth(`choices/delete-${ENDPOINT}/${item.id}/`)
    if (response?.data?.status === 204 || response?.data?.status === 200) {
      message.success("Course removed")
      await loadData()
    } else {
      message.error(getErrorMessage(response, "Unable to remove this course"))
    }
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
        if (choiceCodes.has(course.code)) {
          return (
            <Tooltip title="Already in My L8 Choices">
              <CheckCircleFilled className="l8-added-icon" />
            </Tooltip>
          )
        }
        return (
          <Tooltip title={limitReached ? `Limit of ${MAX_CHOICES} courses reached` : "Add to My Choices"}>
            <Button
              type="text"
              shape="circle"
              aria-label={`Add ${course.title} to My Choices`}
              className="l8-add-btn"
              disabled={limitReached}
              loading={adding === course.code}
              icon={<PlusCircleOutlined />}
              onClick={() => handleAdd(course)}
            />
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
    {
      title: "Points",
      key: "points",
      width: 75,
      render: (_, item) => item.point ?? item.points ?? "—",
    },
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
            <Select
              allowClear
              showSearch
              size="large"
              placeholder="Region"
              value={region}
              options={regionOptions}
              onChange={(value) => {
                setRegion(value ?? null)
                setCounty(null)
                setCollege(null)
              }}
            />
          )}
          {hasCounty && (
            <Select
              allowClear
              showSearch
              size="large"
              placeholder="County"
              value={county}
              options={countyOptions}
              onChange={(value) => {
                setCounty(value ?? null)
                setCollege(null)
              }}
            />
          )}
          <Select
            allowClear
            showSearch
            size="large"
            placeholder="College"
            value={college}
            options={collegeOptions}
            onChange={(value) => setCollege(value ?? null)}
            optionFilterProp="label"
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
        items={[
          { key: "search", label: "Course Search", children: searchTab },
          { key: "choices", label: `My L8 Choices (${choices.length})`, children: choicesTab },
        ]}
      />
    </div>
  )
}

export default Level8Choices
