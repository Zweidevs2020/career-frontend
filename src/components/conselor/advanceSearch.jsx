// import React, { useState, useEffect } from "react";
// import Table from "./table";

// const Spinner = () => (
//   <div
//     style={{
//       display: "inline-block",
//       width: "1rem",
//       height: "1rem",
//       border: "2px solid #fff",
//       borderBottomColor: "transparent",
//       borderRadius: "50%",
//       animation: "spin 1s linear infinite",
//     }}
//   >
//     <style>{`
//       @keyframes spin {
//         to { transform: rotate(360deg); }
//       }
//     `}</style>
//   </div>
// );

// const AdvancedTable = ({ initialData, columns, onViewDetails, cvDetails }) => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     setData(initialData);
//     setFilteredData(initialData);
//   }, [initialData]);

//   useEffect(() => {
//     if (!searchTerm) {
//       setFilteredData(data);
//       return;
//     }
//     const lowercasedFilter = searchTerm.toLowerCase();
//     const filtered = data.filter((item) =>
//       Object.values(item).some(
//         (val) =>
//           val &&
//           typeof val === "string" &&
//           val.toLowerCase().includes(lowercasedFilter)
//       )
//     );
//     setFilteredData(filtered);
//   }, [searchTerm, data]);

//   const highlightText = (text) => {
//     if (!text || typeof text !== "string") return text;
//     if (!searchTerm) return text;
//     const parts = text.toString().split(new RegExp(`(${searchTerm})`, "gi"));
//     return parts.map((part, index) =>
//       part.toLowerCase() === searchTerm.toLowerCase() ? (
//         <span key={index} style={{ backgroundColor: "#fef08a" }}>
//           {part}
//         </span>
//       ) : (
//         part
//       )
//     );
//   };

//   return (
//     <div style={{ width: "100%", padding: "1rem" }}>
//       <div
//         style={{
//           marginBottom: "1rem",
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         <h3 className="md:text-xl sm:text-sm font-semibold mb-6 text-black text-start">
//           Students List
//         </h3>
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="md:w-[14.75rem] sm:w-full"
//           style={{
//             // width: "14.75rem",
//             height: "2.4375rem",
//             padding: "0.5rem",
//             border: "1px solid #d1d5db",
//             borderRadius: "0.25rem",
//             transition: "all 0.3s",
//             color: "black",
//           }}
//         />
//       </div>
//       <Table
//         columns={columns}
//         data={filteredData}
//         renderCell={(key, value) => highlightText(value)}
//         onViewDetails={onViewDetails}
//         cvDetails={cvDetails}
//       />
//     </div>
//   );
// };

// export default AdvancedTable;

import React, { useState, useEffect } from "react";
import Table from "./table";

const Spinner = () => (
  <div
    style={{
      display: "inline-block",
      width: "1rem",
      height: "1rem",
      border: "2px solid #fff",
      borderBottomColor: "transparent",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    }}
  >
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const AdvancedTable = ({ initialData, columns, onViewDetails, cvDetails }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setData(initialData);
    setFilteredData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
      return;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = data.filter((item) =>
      columns.some((column) => {
        // Use column.key (as used in your Table component) as the lookup key.
        const key =
          typeof column === "object" && column.key ? column.key : column;
        const value = item[key];
        return (
          value && value.toString().toLowerCase().includes(lowercasedFilter)
        );
      })
    );
    setFilteredData(filtered);
  }, [searchTerm, data, columns]);

  const highlightText = (text) => {
    if (!text || typeof text !== "string") return text;
    if (!searchTerm) return text;
    const parts = text.toString().split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: "#fef08a" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div style={{ width: "100%", padding: "1rem" }}>
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h3 className="md:text-xl sm:text-sm font-semibold mb-6 text-black text-start">
          Students List
        </h3>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-[14.75rem] sm:w-full"
          style={{
            height: "2.4375rem",
            padding: "0.5rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.25rem",
            transition: "all 0.3s",
            color: "black",
          }}
        />
      </div>
      <Table
        columns={columns}
        data={filteredData}
        renderCell={(key, value, row) => highlightText(value)}
        onViewDetails={onViewDetails}
        cvDetails={cvDetails}
      />
    </div>
  );
};

export default AdvancedTable;
