import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);


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

  useEffect(() => {
    loadStores();
  }, [filters, sort, pagination.page]);

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

  return (
    <div className="page-container">
      <h2>Stores</h2>

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
            Store Name
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

            <th onClick={() => toggleSort("owner_name")}>
            Owner
            <span className="sort-btn">{sortArrow("owner_name")}</span>
            </th>

            <th onClick={() => toggleSort("overallRating")}>
            Rating
            <span className="sort-btn">{sortArrow("overallRating")}</span>
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

      {}
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
    <div className="modal-box">
      <h3>Reviews for {selectedStore?.name}</h3>

      {reviews.length === 0 && (
        <p style={{ opacity: 0.7 }}>No reviews yet.</p>
      )}

      {reviews.map((r, idx) => (
        <div key={idx} className="review-item">
          <strong>{r.userName}</strong> — {r.rating} ⭐
          <div className="review-text">{r.review || "(No text review)"}</div>
        </div>
      ))}

      <button
        className="cancel-btn"
        onClick={() => setShowReviewsModal(false)}
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
}
