import React from "react";
import { useLocation } from "react-router-dom";

const Table = ({ columns, data, renderCell, onViewDetails }) => {
  const location = useLocation();
  const isCounselorDashboard = location.pathname.includes("/conselorDashboard");

  return (
    <div>
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1476B7] text-white">
              {columns.map((column) => (
                <th key={column.key} className="p-3 text-left">
                  {column.label}
                </th>
              ))}
              {/* Render the Actions header ONLY if we're on the counselor dashboard */}
              {isCounselorDashboard && (
                <th className="p-3 text-left">Actions</th>
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
                {columns.map((column) => (
                  <td key={column.key} className="p-3 border-t text-[#737373]">
                    {renderCell
                      ? renderCell(column.key, row[column.key], row)
                      : row[column.key] || "N/A"}
                  </td>
                ))}
                {/* Render the Actions cell ONLY if we're on the counselor dashboard */}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
