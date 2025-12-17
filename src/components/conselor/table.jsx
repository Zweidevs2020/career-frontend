import React from "react";
import { useLocation } from "react-router-dom";
import deleteIcon from "../../assets/delete.png"; // Import the delete icon

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
  const isCounselorDashboard = location.pathname.includes("/counsellor-Dashboard");
  const isAllSelected = data.length > 0 && selectedStudentIds.length === data.length;

  return (
    <div>
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1476B7] text-white">
              {isCounselorDashboard && (
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
                <th key={column.key} className="p-3 text-left">
                  {column.label}
                </th>
              ))}
              {/* Render the Actions header ONLY if we're on the counselor dashboard */}
              {isCounselorDashboard && (
                <th className="p-3 text-left">Actions</th>
              )}
              {isCounselorDashboard && (
                <th className="p-3 text-left">Delete</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition-colors`}
              >
                {isCounselorDashboard && (
                  <td className="p-3 border-t w-12">
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(row.id)}
                      onChange={() => onToggleStudentSelection(row.id)}
                      className="form-checkbox h-4 w-4 text-[#1476B7] rounded"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="p-3 border-t text-[#737373]">
                    {renderCell
                      ? renderCell(column.key, row[column.key], row)
                      : row[column.key] || "N/A"}
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
                {isCounselorDashboard && (
                  <td className="p-3 border-t">
                    <button
                      onClick={() => onDeleteSingleStudent(row.id)}
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <img src={deleteIcon} alt="Delete" className="h-5 w-5" />
                    </button>
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
