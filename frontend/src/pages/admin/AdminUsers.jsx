import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
    // Validation
  const validateName = (name) => name.length >= 20 && name.length <= 60;
  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
  const validatePassword = (pwd) =>
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]).{8,16}$/.test(pwd);
  const validateAddress = (addr) => addr.length <= 400;


  // ----- NEW: modal and form state -----
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER"
  });

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

  const loadUsers = async () => {
    const query = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });

    query.append("sortBy", sort.sortBy);
    query.append("sortOrder", sort.sortOrder);
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
        prev.sortBy === column && prev.sortOrder === "ASC"
          ? "DESC"
          : "ASC"
    }));
  };

  const sortArrow = (column) => {
    if (sort.sortBy !== column) return "⬍";
    return sort.sortOrder === "ASC" ? "⬆" : "⬇";
  };

  // ----- NEW: add user -----
  const createUser = async () => {
  if (!validateName(newUser.name)) return alert("Name must be 20–60 characters");
  if (!validateEmail(newUser.email)) return alert("Invalid email");
  if (!validatePassword(newUser.password))
    return alert("Password must be 8–16 chars, include 1 uppercase & 1 special character");
  if (!validateAddress(newUser.address)) return alert("Address max 400 chars");

  try {
    await axios.post("/admin/users", newUser);

      setShowAddModal(false);

      // Reset form
      setNewUser({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER"
      });

      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
    }
  };

  return (
    <div className="page-container">
      <h2>Users</h2>

      <button
        style={{ width: "200px", marginBottom: "20px" }}
        onClick={() => setShowAddModal(true)}
      >
        + Add User
      </button>

      {/* Filters */}
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

      <table>
        <thead>
          <tr>
            <th onClick={() => toggleSort("name")}>
              Name <span className="sort-btn">{sortArrow("name")}</span>
            </th>
            <th onClick={() => toggleSort("email")}>
              Email <span className="sort-btn">{sortArrow("email")}</span>
            </th>
            <th onClick={() => toggleSort("address")}>
              Address <span className="sort-btn">{sortArrow("address")}</span>
            </th>
            <th onClick={() => toggleSort("role")}>
              Role <span className="sort-btn">{sortArrow("role")}</span>
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

      {/* Pagination */}
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

      {/* -------- ADD USER MODAL -------- */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-box">
            <h3>Add New User</h3>

            <input
              placeholder="Name"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
            />

            <input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />

            <input
              placeholder="Password"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />

            <input
              placeholder="Address"
              value={newUser.address}
              onChange={(e) =>
                setNewUser({ ...newUser, address: e.target.value })
              }
            />

            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
            >
              <option value="USER">USER</option>
              <option value="OWNER">OWNER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <button onClick={createUser}>Create User</button>

            <button
              className="cancel-btn"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
