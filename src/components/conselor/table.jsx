import React from "react";
import { Tooltip } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/delete.png"; // Import the delete icon
import {
  AssesmentSvg,
  CalculatorSvg,
  ChoicesSvg,
  EducationalSvg,
  GoalSvg,
  ProfileSvg,
  ReportIcon,
  StudySvg,
  WorkDiaryIcon,
} from "../../utils/svg";

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
    Icon: CalculatorSvg,
    path: (id) => `/consellor/student-cao/${id}`,
  },
  {
    key: "goals",
    label: "My Goals",
    Icon: GoalSvg,
    path: (id) => `/consellor/student-goals/${id}`,
  },
  {
    key: "cv",
    label: "My CV",
    Icon: ProfileSvg,
    path: (id) => `/consellor/student-cv/${id}`,
  },
  {
    key: "self_assessment",
    label: "My Self Assessment",
    Icon: AssesmentSvg,
    path: (id) => `/consellor/self/${id}`,
  },
  {
    key: "study",
    label: "My Study",
    Icon: StudySvg,
    path: null,
  },
  {
    key: "choices",
    label: "My Choices",
    Icon: ChoicesSvg,
    path: (id) => `/consellor/student-choices/${id}`,
  },
  {
    key: "education_guidance",
    label: "Educational Guidance",
    Icon: EducationalSvg,
    path: (id) => `/consellor/student-guidance-report/${id}`,
  },
  {
    key: "ai_report",
    label: "My AI Report",
    Icon: ReportIcon,
    path: (id) => `/consellor/student-educational-report/${id}`,
  },
  {
    key: "work_diary",
    label: "My Work Diary",
    Icon: WorkDiaryIcon,
    path: (id) => `/consellor/student-details/${id}`,
  },
];

const StudentProgress = ({ student, onNavigate }) => (
  <div className="flex min-w-[340px] items-start gap-2" aria-label={`${student.full_name} module progress`}>
    {progressModules.map(({ key, label, Icon, path }) => {
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
        <div>
          <div className="font-semibold">{label}</div>
          <div>
            {percentage === null
              ? progressLabels[status]
              : `${percentage}% complete`}
          </div>
          {hasStepDetails && (
            <div>{`${completedSteps} of ${totalSteps} steps`}</div>
          )}
          {!isClickable && <div>Counsellor view unavailable</div>}
          {student.is_read_only && <div>Read-only demo student</div>}
        </div>
      );

      return (
        <Tooltip title={tooltip} key={key}>
          <span className="flex w-8 flex-col items-center">
            <button
              type="button"
              onClick={() => isClickable && onNavigate(path(student.id))}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-opacity ${
                isClickable ? "cursor-pointer hover:opacity-80" : "cursor-default"
              }`}
              style={{ backgroundColor: progressColors[status] }}
              aria-label={`${label}: ${progressLabels[status]}`}
            >
              <Icon fill="#FFFFFF" lineColor="#FFFFFF" />
            </button>
            <span className="mt-0.5 h-3 text-[10px] leading-3 text-[#6B7280]">
              {status === "in_progress" && percentage !== null
                ? `${percentage}%`
                : ""}
            </span>
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
                    column.key === "progress" ? "min-w-[340px]" : ""
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
