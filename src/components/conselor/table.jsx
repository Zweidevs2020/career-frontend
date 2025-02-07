// import React from "react";

// const Table = ({ columns, data, renderCell, onEdit, onDelete }) => {
//   return (
//     <div style={{ overflowX: "auto", width: "100%" }}>
//       <table
//         style={{
//           width: "100%",
//           borderCollapse: "collapse",
//           border: "1px solid #e5e7eb",
//           color: "black",
//         }}
//       >
//         <thead style={{ background: "rgb(59, 130, 246)", color: "whitesmoke" }}>
//           <tr>
//             {columns.map((column) => (
//               <th
//                 key={column.key}
//                 style={{
//                   border: "1px solid #e5e7eb",
//                   padding: "0.5rem",
//                   textAlign: "left",
//                 }}
//               >
//                 {column.label}
//               </th>
//             ))}
//             <th
//               style={{
//                 border: "1px solid #e5e7eb",
//                 padding: "0.5rem",
//                 textAlign: "left",
//               }}
//             >
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row) => (
//             <tr
//               key={row.id}
//               style={{ transition: "background-color 0.2s" }}
//               onMouseEnter={(e) =>
//                 (e.currentTarget.style.backgroundColor = "#f9fafb")
//               }
//               onMouseLeave={(e) =>
//                 (e.currentTarget.style.backgroundColor = "transparent")
//               }
//             >
//               {columns.map((column) => (
//                 <td
//                   key={column.key}
//                   style={{ border: "1px solid #e5e7eb", padding: "0.5rem" }}
//                 >
//                   {renderCell
//                     ? renderCell(column.key, row[column.key], row)
//                     : row[column.key]}
//                 </td>
//               ))}
//               <td style={{ border: "1px solid #e5e7eb", padding: "0.5rem" }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: "0.5rem",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <button
//                     onClick={() => onEdit(row.id)}
//                     style={{
//                       backgroundColor: "#3b82f6",
//                       color: "white",
//                       padding: "0.25rem 0.5rem",
//                       borderRadius: "0.25rem",
//                       fontSize: "0.875rem",
//                       transition: "background-color 0.2s",
//                       cursor: "pointer",
//                       border: "none",
//                     }}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.backgroundColor = "#2563eb")
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.backgroundColor = "#3b82f6")
//                     }
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => onDelete(row.id)}
//                     style={{
//                       backgroundColor: "#ef4444",
//                       color: "white",
//                       padding: "0.25rem 0.5rem",
//                       borderRadius: "0.25rem",
//                       fontSize: "0.875rem",
//                       transition: "background-color 0.2s",
//                       cursor: "pointer",
//                       border: "none",
//                     }}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.backgroundColor = "#dc2626")
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.backgroundColor = "#ef4444")
//                     }
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Table;
import { render } from "@testing-library/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Table = ({ columns, data, renderCell, onViewDetails }) => {
  return (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #e5e7eb",
          color: "black",
        }}
      >
        <thead style={{ background: "rgb(59, 130, 246)", color: "whitesmoke" }}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  border: "1px solid #e5e7eb",
                  padding: "0.5rem",
                  textAlign: "left",
                }}
              >
                {column.label}
              </th>
            ))}
            <th
              style={{
                border: "1px solid #e5e7eb",
                padding: "0.5rem",
                textAlign: "left",
              }}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row) => (
            <tr
              key={row.id}
              style={{ transition: "background-color 0.2s" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9fafb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{ border: "1px solid #e5e7eb", padding: "0.5rem" }}
                >
                  {renderCell
                    ? renderCell(column.key, row[column.key], row)
                    : row[column.key] || "NA"}
                </td>
              ))}
              <td style={{ border: "1px solid #e5e7eb", padding: "0.5rem" }}>
                <button
                  onClick={() => onViewDetails(row?.id)}
                  style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.25rem",
                    fontSize: "0.875rem",
                    transition: "background-color 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2563eb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#3b82f6")
                  }
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
