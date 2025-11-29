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

  /* Disable background scroll when modal is open */
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "auto";
  }, [modalOpen]);

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-container">

      <h2 style={{ marginBottom: "15px" }}>Owner Dashboard</h2>

      {/* ------------------------------------------------ */}
      {/*                 STORE CARDS                      */}
      {/* ------------------------------------------------ */}
      <h3>Your Stores</h3>

      <div className="store-grid">
        {data.stores.map((s) => (
          <div key={s.id} className="store-card">

            <div className="store-card-header">
              <h3>{s.name}</h3>
              <div className="rating-tag">
                ⭐ {Number(s.avgRating || 0).toFixed(1)}
              </div>
            </div>

            <p className="store-address">
              📊 Total Ratings: {s.totalRatings}
            </p>

            {/* MAP PREVIEW */}
            <div className="store-map">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  s.address
                )}&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title={`${s.name} location`}
              />
            </div>

            {/* ACTION */}
            <button onClick={() => openModal(s)}>
              View Reviews
            </button>

          </div>
        ))}
      </div>

      {/* ------------------------------------------------ */}
      {/*               RECENT RATERS                     */}
      {/* ------------------------------------------------ */}
      <h3 style={{ marginTop: "40px" }}>Recent Raters</h3>


        <table className="recent-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Restaurant</th>
              <th>Rating</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {data.raters.map((r) => (
              <tr key={r.userId}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.storeName}</td>
                <td>
                  <span style={{ color: "gold", marginRight: "5px" }}>
                    {"★".repeat(r.rating)}
                  </span>
                  <span style={{ opacity: 0.8 }}>({r.rating}/5)</span>
                </td>
                <td>{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>


      {/* ------------------------------------------------ */}
      {/*                 REVIEWS MODAL                   */}
      {/* ------------------------------------------------ */}
      {modalOpen && (
        <div className="modal" onClick={() => setModalOpen(false)}>
          <div className="modal-box owner-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Reviews for {selectedStore?.name}</h3>

            {reviews.length === 0 && (
              <p style={{ opacity: 0.7 }}>No reviews yet.</p>
            )}

            {reviews.map((rev) => (
              <div key={rev.id} className="review-card">

                <div className="review-header">
                  <span className="review-user">{rev.userName}</span>
                  <span className="review-date">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="review-stars">
                  {"★".repeat(rev.rating)}
                  {"☆".repeat(5 - rev.rating)}
                  <span className="rating-text">({rev.rating}/5)</span>
                </div>

                {rev.review && (
                  <div className="review-text">
                    "{rev.review}"
                  </div>
                )}
              </div>
            ))}

            <button
              className="cancel-btn"
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
