import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";

export default function AdminStores() {
  const validateName = (name) => name.length >= 20 && name.length <= 60;
  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
  const validateAddress = (addr) => addr.length <= 400;

  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]); // NEW — owners dropdown
  const [reviews, setReviews] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  // NEW — Add Store Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: ""
  });

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: ""
  });

  const [sort, setSort] = useState({
    sortBy: "name",
    sortOrder: "ASC"
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    pages: 1
  });

  // Load stores list
  const loadStores = async () => {
    const query = new URLSearchParams();

    Object.entries(filters).forEach(([key, val]) => {
      if (val) query.append(key, val);
    });

    query.append("sortBy", sort.sortBy);
    query.append("sortOrder", sort.sortOrder);
    query.append("page", pagination.page);
    query.append("limit", pagination.limit);

    const res = await axios.get(`/admin/stores?${query.toString()}`);
    setStores(res.data.data);
    setPagination((prev) => ({ ...prev, pages: res.data.pages }));
  };

  // Load all OWNER users for dropdown
  const loadOwners = async () => {
    const res = await axios.get("/admin/users?role=OWNER&limit=999");
    setOwners(res.data.data || []);
  };

  useEffect(() => {
    loadStores();
  }, [filters, sort, pagination.page]);

  useEffect(() => {
    loadOwners(); // load owners once
  }, []);

  const loadReviews = async (storeId) => {
    try {
      const res = await axios.get(`/ratings/${storeId}`);
      setReviews(res.data);
      setShowReviewsModal(true);
    } catch (err) {
      alert(err.response?.data?.message || "Error loading reviews");
    }
  };

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

  // NEW — Create Store
  const createStore = async () => {
    try {
      await axios.post("/admin/stores", newStore);

      setShowAddModal(false);

      setNewStore({
        name: "",
        email: "",
        address: "",
        ownerId: ""
      });

      loadStores();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating store");
    }
  };

  return (
    <div className="page-container">
      <h2>Stores</h2>

      {/* Add Store Button */}
      <button
        style={{ width: "200px", marginBottom: "20px" }}
        onClick={() => setShowAddModal(true)}
      >
        + Add Store
      </button>

      {/* Filters */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Search store name..."
          value={filters.name}
          onChange={(e) =>
            setFilters({ ...filters, name: e.target.value })
          }
        />

        <input
          placeholder="Search email..."
          value={filters.email}
          onChange={(e) =>
            setFilters({ ...filters, email: e.target.value })
          }
        />

        <input
          placeholder="Search address..."
          value={filters.address}
          onChange={(e) =>
            setFilters({ ...filters, address: e.target.value })
          }
        />
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th onClick={() => toggleSort("name")}>
              Store Name <span className="sort-btn">{sortArrow("name")}</span>
            </th>

            <th onClick={() => toggleSort("email")}>
              Email <span className="sort-btn">{sortArrow("email")}</span>
            </th>

            <th onClick={() => toggleSort("address")}>
              Address <span className="sort-btn">{sortArrow("address")}</span>
            </th>

            <th onClick={() => toggleSort("owner_name")}>
              Owner <span className="sort-btn">{sortArrow("owner_name")}</span>
            </th>

            <th onClick={() => toggleSort("overallRating")}>
              Rating <span className="sort-btn">{sortArrow("overallRating")}</span>
            </th>

            <th>Reviews</th>
          </tr>
        </thead>

        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{s.owner_name}</td>
              <td>{Number(s.overallRating).toFixed(1)}</td>
              <td>
                <button
                  style={{ padding: "8px 14px", fontSize: "16px" }}
                  onClick={() => {
                    setSelectedStore(s);
                    loadReviews(s.id);
                  }}
                >
                  View Reviews
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: 20, display: "flex", gap: "15px" }}>
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

      {/* --- REVIEWS MODAL --- */}
      {showReviewsModal && (
        <div className="modal">
          <div className="modal-box owner-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Reviews for {selectedStore?.name}</h3>

            {reviews.length === 0 && <p>No reviews yet.</p>}

            {reviews.map((r, index) => (
              <div key={index} className="admin-review-card">
                <div className="admin-review-header">
                  <strong>{r.userName}</strong>
                  <span className="admin-review-date">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="review-stars">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                  <span className="admin-review-score">({r.rating}/5)</span>
                </div>

                <div className="admin-review-text">
                  {r.review || <em>No written review.</em>}
                </div>
              </div>
            ))}

            <button className="cancel-btn" onClick={() => setShowReviewsModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* -------- ADD STORE MODAL -------- */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-box">
            <h3>Add New Store</h3>

            <input
              placeholder="Store Name"
              value={newStore.name}
              onChange={(e) =>
                setNewStore({ ...newStore, name: e.target.value })
              }
            />

            <input
              placeholder="Store Email"
              value={newStore.email}
              onChange={(e) =>
                setNewStore({ ...newStore, email: e.target.value })
              }
            />

            <input
              placeholder="Store Address"
              value={newStore.address}
              onChange={(e) =>
                setNewStore({ ...newStore, address: e.target.value })
              }
            />

            <select
              value={newStore.ownerId}
              onChange={(e) =>
                setNewStore({ ...newStore, ownerId: e.target.value })
              }
            >
              <option value="">No Owner Assigned</option>

              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.email})
                </option>
              ))}
            </select>

            <button onClick={createStore}>Create Store</button>

            <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
