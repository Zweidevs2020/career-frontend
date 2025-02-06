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

const AdvancedTable = ({ initialData, columns, onViewDetails }) => {
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
      Object.values(item).some(
        (val) =>
          val &&
          typeof val === "string" &&
          val.toLowerCase().includes(lowercasedFilter)
      )
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

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
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
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
        renderCell={(key, value) => highlightText(value)}
        onViewDetails={onViewDetails}
      />
    </div>
  );
};

export default AdvancedTable;
