import React, { useState, useMemo, useEffect } from "react";

const Table = ({ data = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterText, setFilterText] = useState("");
  const itemsPerPage = 10;

  // Handle page change with bounds checking
  const handlePageChange = (page) => {
    const totalPages = Math.ceil(
      (data.filter((item) =>
        item.name?.toLowerCase().includes(filterText.toLowerCase())
      ).length || 0) / itemsPerPage
    );
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle sort with direction toggle
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Filter data
    let filtered = data.filter((item) => {
      const name = item.name || "";
      return name.toLowerCase().includes(filterText.toLowerCase());
    });

    // Sort data
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (sortColumn === "name" || sortColumn === "email") {
          const comparison = String(aVal || "").localeCompare(String(bVal || ""));
          return sortDirection === "asc" ? comparison : -comparison;
        } else {
          const comparison = (Number(aVal) || 0) - (Number(bVal) || 0);
          return sortDirection === "asc" ? comparison : -comparison;
        }
      });
    }

    return filtered;
  }, [data, filterText, sortColumn, sortDirection]);

  // Paginate data
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = processedData.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterText]);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="table-card">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter by name"
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
            width: "100%",
            maxWidth: "300px",
          }}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
              Name {sortColumn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
              Email {sortColumn === "email" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("phone")} style={{ cursor: "pointer" }}>
              Phone {sortColumn === "phone" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr key={item.id || item._id || index}>
                <td>{item.name || "N/A"}</td>
                <td>{item.email || "N/A"}</td>
                <td>{item.phone || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "2rem" }}>
                No matching records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
            gap: "1rem",
          }}
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "0.5rem 1rem",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "0.5rem 1rem",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              opacity: currentPage === totalPages ? 0.5 : 1,
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
