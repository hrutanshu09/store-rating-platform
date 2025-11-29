import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: "", address: "" });

  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  /* ------------------------------ */
  /*  LOAD STORES                  */
  /* ------------------------------ */
  const loadStores = async () => {
    const res = await axios.get("/stores");
    setStores(res.data);
  };

  useEffect(() => {
    loadStores();
  }, []);

  /* ------------------------------ */
  /*  DISABLE SCROLL WHEN MODAL OPEN */
  /* ------------------------------ */
  useEffect(() => {
    if (showRatingModal || showReviewModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showRatingModal, showReviewModal]);

  /* ------------------------------ */
  /*  OPEN RATE MODAL               */
  /* ------------------------------ */
  const openRateModal = (store) => {
    setSelectedStore(store);
    setRatingValue(store.userRating || 0);
    setReviewText(store.userReview || "");
    setShowRatingModal(true);
  };

  /* ------------------------------ */
  /*  SUBMIT RATING                 */
  /* ------------------------------ */
  const submitRating = async () => {
    if (!ratingValue) return alert("Please select a rating");

    try {
      if (!selectedStore.userRating) {
        await axios.post("/ratings", {
          storeId: selectedStore.id,
          rating: ratingValue,
          review: reviewText,
        });
      } else {
        await axios.put(`/ratings/${selectedStore.id}`, {
          rating: ratingValue,
          review: reviewText,
        });
      }

      setShowRatingModal(false);
      loadStores();
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting rating");
    }
  };

  /* ------------------------------ */
  /*  OPEN REVIEWS MODAL            */
  /* ------------------------------ */
  const openReviews = async (storeId) => {
    const res = await axios.get(`/ratings/${storeId}`);
    setReviews(res.data);
    setShowReviewModal(true);
  };

  /* ------------------------------ */
  /*  FILTERED STORES               */
  /* ------------------------------ */
  const filteredStores = stores.filter((store) => {
    return (
      store.name.toLowerCase().includes(search.name.toLowerCase()) &&
      store.address.toLowerCase().includes(search.address.toLowerCase())
    );
  });

  /* ------------------------------ */
  /*  RETURN UI                     */
  /* ------------------------------ */
  return (
    <>
      <div className="page-container">
        <h2 style={{ marginBottom: "15px" }}>Find Stores</h2>

        {/* SEARCH BAR */}
        <div className="store-search-bar">
          <input
            placeholder="Search by store name..."
            value={search.name}
            onChange={(e) =>
              setSearch({ ...search, name: e.target.value })
            }
          />

          <input
            placeholder="Search by address..."
            value={search.address}
            onChange={(e) =>
              setSearch({ ...search, address: e.target.value })
            }
          />
        </div>

        {/* STORE GRID */}
        <div className="store-grid">
          {filteredStores.map((s) => (
            <div key={s.id} className="store-card">

              {/* HEADER */}
              <div className="store-card-header">
                <h3>{s.name}</h3>
                <div className="rating-tag">
                  ⭐ {Number(s.overallRating).toFixed(1)}
                </div>
              </div>

              {/* ADDRESS */}
              <p className="store-address">📍 {s.address}</p>

              {/* MAP */}
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

              {/* YOUR FULL REVIEW BOX */}
              <div
                style={{
                  background: "rgba(0, 255, 100, 0.10)",
                  borderRadius: "10px",
                  padding: "12px",
                  marginTop: "10px",
                  border: "1px solid rgba(0, 255, 100, 0.25)"
                }}
              >
                {s.userRating ? (
                  <>
                    <div style={{ marginBottom: "5px", fontSize: "16px" }}>
                      <strong>Your Rating:</strong> {s.userRating} ⭐
                    </div>

                    {s.userReview ? (
                      <div style={{ fontSize: "14px", opacity: 0.85 }}>
                        <strong>Your Review:</strong>
                        <br />
                        "{s.userReview}"
                      </div>
                    ) : (
                      <div style={{ fontSize: "14px", opacity: 0.6 }}>
                        (You did not write a review)
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ opacity: 0.7 }}>
                    You haven't rated this store yet.
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="store-actions">
                <button onClick={() => openRateModal(s)}>
                  {s.userRating ? "Update Rating" : "Rate Store"}
                </button>

                <button onClick={() => openReviews(s.id)}>
                  View Reviews
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================================
          RATING MODAL (outside container)
      ================================== */}
      {showRatingModal && (
        <div className="modal">
          <div className="modal-box">
            <h3>Rate {selectedStore?.name}</h3>

            <div className="stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`star ${ratingValue >= n ? "filled" : ""}`}
                  onClick={() => setRatingValue(n)}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="Write a review (optional)"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <button onClick={submitRating}>Submit</button>
            <button
              className="cancel-btn"
              onClick={() => setShowRatingModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ================================
          REVIEWS MODAL (outside container)
      ================================== */}
      {showReviewModal && (
        <div className="modal">
          <div className="modal-box">
            <h3>Store Reviews</h3>

            {reviews.length === 0 && <p>No reviews yet.</p>}

            {reviews.map((rev, idx) => (
              <div key={idx} className="review-card">
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

                <div className="review-text">
                  {rev.review || "No review text"}
                </div>
              </div>
            ))}

            <button
              className="cancel-btn"
              onClick={() => setShowReviewModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
