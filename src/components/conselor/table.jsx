import React from "react";
import { Tooltip } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/delete.png"; // Import the delete icon
import caoPointsIcon from "../../assets/66.png";
import goalsIcon from "../../assets/67.png";
import cvIcon from "../../assets/13.png";
import selfAssessmentIcon from "../../assets/14.png";
import studyIcon from "../../assets/16.png";
import choicesIcon from "../../assets/12.png";
import educationalGuidanceIcon from "../../assets/15.png";
import aiReportIcon from "../../assets/17.png";
import workDiaryIcon from "../../assets/18.png";

const progressColors = {
  not_started: "#DC2626",
  in_progress: "#D97706",
  complete: "#16A34A",
  unknown: "#94A3B8",
};

const progressLabels = {
  not_started: "Not started",
  in_progress: "In progress",
  complete: "Complete",
  unknown: "Progress unavailable",
};

const progressModules = [
  {
    key: "cao_points",
    label: "CAO Points",
    image: caoPointsIcon,
    path: (id) => `/consellor/student-cao/${id}`,
  },
  {
    key: "goals",
    label: "My Goals",
    image: goalsIcon,
    path: (id) => `/consellor/student-goals/${id}`,
  },
  {
    key: "cv",
    label: "My CV",
    image: cvIcon,
    path: (id) => `/consellor/student-cv/${id}`,
  },
  {
    key: "self_assessment",
    label: "My Self Assessment",
    image: selfAssessmentIcon,
    path: (id) => `/consellor/self/${id}`,
  },
  {
    key: "study",
    label: "My Study",
    image: studyIcon,
    path: null,
  },
  {
    key: "choices",
    label: "My Choices",
    image: choicesIcon,
    path: (id) => `/consellor/student-choices/${id}`,
  },
  {
    key: "education_guidance",
    label: "Educational Guidance",
    image: educationalGuidanceIcon,
    path: (id) => `/consellor/student-guidance-report/${id}`,
  },
  {
    key: "ai_report",
    label: "My AI Report",
    image: aiReportIcon,
    path: (id) => `/consellor/student-educational-report/${id}`,
  },
  {
    key: "work_diary",
    label: "My Work Diary",
    image: workDiaryIcon,
    path: (id) => `/consellor/student-details/${id}`,
  },
];

const StudentProgress = ({ student, onNavigate }) => (
  <div
    className="inline-flex min-w-[472px] items-start gap-3 px-2 py-1.5"
    aria-label={`${student.full_name} module progress`}
  >
    {progressModules.map(({ key, label, image, path }) => {
      const moduleProgress = student.progress?.[key];
      const status = progressColors[moduleProgress?.status]
        ? moduleProgress.status
        : "unknown";
      const percentage = Number.isFinite(moduleProgress?.percentage)
        ? moduleProgress.percentage
        : null;
      const completedSteps = moduleProgress?.completed_steps;
      const totalSteps = moduleProgress?.total_steps;
      const hasStepDetails =
        Number.isFinite(completedSteps) && Number.isFinite(totalSteps);
      const isClickable = typeof path === "function";

      const tooltip = (
        <div className="min-w-[150px] py-0.5">
          <div className="flex items-center gap-2 font-semibold">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: progressColors[status] }}
            />
            {label}
          </div>
          <div className="mt-1 text-white/80">
            {percentage === null
              ? progressLabels[status]
              : `${percentage}% complete`}
          </div>
          {hasStepDetails && (
            <div className="text-white/80">{`${completedSteps} of ${totalSteps} steps`}</div>
          )}
          {!isClickable && (
            <div className="mt-1 text-white/60">Counsellor view unavailable</div>
          )}
          {student.is_read_only && (
            <div className="mt-1 text-white/60">Read-only demo student</div>
          )}
        </div>
      );

      return (
        <Tooltip title={tooltip} key={key}>
          <span className="flex w-10 shrink-0 flex-col items-center">
            <button
              type="button"
              onClick={() => isClickable && onNavigate(path(student.id))}
              className={`relative flex h-10 w-10 items-center justify-center rounded-md border border-[#E2E8F0] bg-white p-0.5 shadow-sm outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#1476B7] focus-visible:ring-offset-2 ${
                isClickable
                  ? "cursor-pointer hover:-translate-y-px hover:shadow-md"
                  : "cursor-default opacity-80"
              }`}
              aria-label={`${label}: ${progressLabels[status]}`}
            >
              <img
                src={image}
                alt=""
                className="h-9 w-9 rounded-md object-cover"
              />
              <span
                className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: progressColors[status] }}
                aria-hidden="true"
              />
            </button>
            {status === "in_progress" && percentage !== null ? (
              <span
                className="mt-1 inline-flex h-4 min-w-[30px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold leading-none"
                style={{
                  backgroundColor: `${progressColors[status]}18`,
                  color: progressColors[status],
                }}
              >
                {percentage}%
              </span>
            ) : (
              <span className="mt-1 h-4" />
            )}
          </span>
        </Tooltip>
      );
    })}
  </div>
);

const Table = ({
  columns,
  data,
  renderCell,
  onViewDetails,
  onToggleStudentSelection,
  onSelectAllStudents,
  selectedStudentIds,
  onDeleteSingleStudent, // New prop for single delete
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isCounselorDashboard = location.pathname.includes("/counsellor-Dashboard");
  const isAllSelected =
    data &&
    data.some((row) => !row.is_read_only) &&
    selectedStudentIds &&
    selectedStudentIds.length === data.filter((row) => !row.is_read_only).length;
  const hasWritableStudents = data?.some((row) => !row.is_read_only);

  return (
    <div>
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1476B7] text-white">
              {isCounselorDashboard && hasWritableStudents && (
                <th className="p-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onSelectAllStudents}
                    className="form-checkbox h-4 w-4 text-[#1476B7] rounded"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`p-3 text-left ${
                    column.key === "progress" ? "min-w-[472px]" : ""
                  }`}
                >
                  {column.label}
                </th>
              ))}
              {/* Render the Actions header ONLY if we're on the counselor dashboard */}
              {isCounselorDashboard && (
                <th className="p-3 text-left">Actions</th>
              )}
              {isCounselorDashboard && hasWritableStudents && (
                <th className="p-3 text-left">Delete</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data && data.map((row, index) => (
              <tr
                key={row.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition-colors`}
              >
                {isCounselorDashboard && hasWritableStudents && (
                  <td className="p-3 border-t w-12">
                    {!row.is_read_only && (
                      <input
                        type="checkbox"
                        checked={selectedStudentIds && selectedStudentIds.includes(row.id)}
                        onChange={() => onToggleStudentSelection(row.id)}
                        className="form-checkbox h-4 w-4 text-[#1476B7] rounded"
                      />
                    )}
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="p-3 border-t text-[#737373]">
                    {column.key === "progress" ? (
                      <StudentProgress student={row} onNavigate={navigate} />
                    ) : renderCell ? (
                      renderCell(column.key, row[column.key], row)
                    ) : (
                      row[column.key] || "N/A"
                    )}
                  </td>
                ))}
                {isCounselorDashboard && (
                  <td className="p-3 border-t">
                    <button
                      onClick={() => onViewDetails(row.id)}
                      className="text-[#1476B7] hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                )}
                {isCounselorDashboard && hasWritableStudents && (
                  <td className="p-3 border-t">
                    {!row.is_read_only && (
                      <button
                        onClick={() => onDeleteSingleStudent(row.id)}
                        className="p-1 rounded hover:bg-gray-200"
                      >
                        <img src={deleteIcon} alt="Delete" className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                )}
                {/* Render the Actions cell ONLY if we're on the counselor dashboard */}
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
