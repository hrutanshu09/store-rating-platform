import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";

export default function OwnerDashboard() {
  const [data, setData] = useState({ stores: [], raters: [] });
  const [selectedStore, setSelectedStore] = useState(null);
  const [reviews, setReviews] = useState([]);  
  const [modalOpen, setModalOpen] = useState(false);

  const load = async () => {
    const res = await axios.get("/stores/owner/dashboard");
    setData(res.data);
  };

  const loadReviews = async (storeId) => {
    const res = await axios.get(`/ratings/${storeId}`);
    setReviews(res.data);
  };

  const openModal = async (store) => {
    setSelectedStore(store);
    await loadReviews(store.id);
    setModalOpen(true);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-container">

      <h2>Owner Dashboard</h2>

      {/* ------------------------ */}
      {/*     STORE LIST CARDS     */}
      {/* ------------------------ */}
      <h3>Your Stores</h3>

      {data.stores.map((s) => (
        <div 
          key={s.id}
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "18px",
            borderRadius: "12px",
            marginBottom: "18px",
            border: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          <strong style={{ fontSize: "20px" }}>{s.name}</strong>

          <div style={{ marginTop: "6px", opacity: 0.9 }}>
            ⭐ Average Rating: {Number(s.avgRating || 0).toFixed(1)}  
            <span style={{ opacity: 0.7 }}> ({s.totalRatings} reviews)</span>
          </div>

          <button
            style={{ width: "180px", marginTop: "15px" }}
            onClick={() => openModal(s)}
          >
            View Reviews
          </button>
        </div>
      ))}


      {/* ------------------------ */}
      {/*       RATERS LIST        */}
      {/* ------------------------ */}
      <h3>Recent Raters</h3>
      <ul>
        {data.raters.map((r) => (
          <li key={r.userId}>
            {r.name} rated {r.rating}
          </li>
        ))}
      </ul>


      {/* ------------------------------------------------ */}
      {/*               REVIEWS MODAL (OWNER)              */}
      {/* ------------------------------------------------ */}
      {modalOpen && (
  <div className="modal" onClick={() => setModalOpen(false)}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      
      <h3 style={{ marginBottom: "20px" }}>
        Reviews for {selectedStore?.name}
      </h3>

      {/* Review Items */}
      {reviews.length === 0 && (
        <p style={{ opacity: 0.7 }}>No reviews yet.</p>
      )}

      {reviews.map((rev) => (
        <div className="review-item" key={rev.id}>
          <strong>{rev.userName}</strong>
          <span style={{ float: "right", opacity: 0.7 }}>
            {new Date(rev.created_at).toLocaleDateString()}
          </span>

          {/* Stars */}
<div className="review-stars">
  <span className="stars-only">
    <span className="star-icon">{"★".repeat(rev.rating)}</span>
    <span className="star-icon empty">{"☆".repeat(5 - rev.rating)}</span>
  </span>
  <span className="rating-text">({rev.rating}/5)</span>
</div>



          {/* Review text */}
          {rev.review && (
            <div className="review-text">
              "{rev.review}"
            </div>
          )}
        </div>
      ))}

      {/* Cancel Button — Same Style as User Rating Modal */}
      <button
        className="cancel-btn"
        style={{
          width: "100%",
          marginTop: "20px",
          background: "#333",
          color: "white"
        }}
        onClick={() => setModalOpen(false)}
      >
        Close
      </button>

    </div>
  </div>
)}


    </div>
  );
}
