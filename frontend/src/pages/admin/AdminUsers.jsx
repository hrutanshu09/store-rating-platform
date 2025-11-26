import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: ""
  });

  const [sort, setSort] = useState({
    sortBy: "id",
    sortOrder: "ASC"
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    pages: 1
  });

  // Load Users list
  const loadUsers = async () => {
    const query = new URLSearchParams();

    // Filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });

    // Sorting
    query.append("sortBy", sort.sortBy);
    query.append("sortOrder", sort.sortOrder);

    // Pagination
    query.append("page", pagination.page);
    query.append("limit", pagination.limit);

    const res = await axios.get(`/admin/users?${query.toString()}`);

    setUsers(res.data.data);
    setPagination((prev) => ({
      ...prev,
      pages: res.data.pages
    }));
  };

  useEffect(() => {
    loadUsers();
  }, [filters, sort, pagination.page]);

  const toggleSort = (column) => {
    setSort((prev) => ({
      sortBy: column,
      sortOrder:
        prev.sortBy === column && prev.sortOrder === "ASC" ? "DESC" : "ASC"
    }));
  };

  const sortArrow = (column) => {
    if (sort.sortBy !== column) return "⬍";
    return sort.sortOrder === "ASC" ? "⬆" : "⬇";
  };

  return (
    <div className="page-container">
      <h2>Users</h2>

      {/* FILTER INPUTS */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Search by name..."
          value={filters.name}
          onChange={(e) =>
            setFilters({ ...filters, name: e.target.value })
          }
        />

        <input
          placeholder="Search by email..."
          value={filters.email}
          onChange={(e) =>
            setFilters({ ...filters, email: e.target.value })
          }
        />

        <input
          placeholder="Search by address..."
          value={filters.address}
          onChange={(e) =>
            setFilters({ ...filters, address: e.target.value })
          }
        />

        <select
          value={filters.role}
          onChange={(e) =>
            setFilters({ ...filters, role: e.target.value })
          }
        >
          <option value="">All Roles</option>
          <option value="USER">USER</option>
          <option value="OWNER">OWNER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      {/* TABLE */}
      <table>
        <thead>
        <tr>
            <th onClick={() => toggleSort("name")}>
            Name
            <span className="sort-btn">{sortArrow("name")}</span>
            </th>

            <th onClick={() => toggleSort("email")}>
            Email
            <span className="sort-btn">{sortArrow("email")}</span>
            </th>

            <th onClick={() => toggleSort("address")}>
            Address
            <span className="sort-btn">{sortArrow("address")}</span>
            </th>

            <th onClick={() => toggleSort("role")}>
            Role
            <span className="sort-btn">{sortArrow("role")}</span>
            </th>
        </tr>
        </thead>



        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {}
      <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
        <button
          disabled={pagination.page === 1}
          onClick={() =>
            setPagination((p) => ({ ...p, page: p.page - 1 }))
          }
        >
          Prev
        </button>

        <span>
          Page {pagination.page} / {pagination.pages}
        </span>

        <button
          disabled={pagination.page === pagination.pages}
          onClick={() =>
            setPagination((p) => ({ ...p, page: p.page + 1 }))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}
