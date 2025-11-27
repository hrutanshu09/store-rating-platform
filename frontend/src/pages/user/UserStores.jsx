import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const load = async () => {
    const res = await axios.get("/stores");
    setStores(res.data);
  };

  const openRateModal = (store) => {
    setSelectedStore(store);
    setRatingValue(store.userRating || 0);
    setReviewText(store.userReview || "");
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (!ratingValue) {
      alert("Please select a rating");
      return;
    }

    try {
      if (!selectedStore.userRating) {
        await axios.post("/ratings", {
          storeId: selectedStore.id,
          rating: ratingValue,
          review: reviewText
        });
      } else {
        await axios.put(`/ratings/${selectedStore.id}`, {
          rating: ratingValue,
          review: reviewText
        });
      }

      setShowRatingModal(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting rating");
    }
  };

  const openReviews = async (storeId) => {
    const res = await axios.get(`/ratings/${storeId}`);
    setReviews(res.data);
    setShowReviewModal(true);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-container">
      <h2>Stores</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Rating</th>
            <th>Your Rating</th>
            <th>Reviews</th>
          </tr>
        </thead>

        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{Number(s.overallRating).toFixed(1)}</td>
              <td>
                <button onClick={() => openRateModal(s)}>
                  {s.userRating ? `${s.userRating} ⭐` : "Rate"}
                </button>
              </td>
              <td>
                <button onClick={() => openReviews(s.id)}>View Reviews</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* RATING MODAL */}
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
            <button className="cancel-btn" onClick={() => setShowRatingModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* REVIEWS MODAL */}
      {showReviewModal && (
        <div className="modal">
          <div className="modal-box">
            <h3>Store Reviews</h3>

            {reviews.length === 0 && <p>No reviews yet.</p>}

            {reviews.map((r, idx) => (
              <div key={idx} className="review-item">
                <strong>{r.userName}</strong> — {r.rating} ⭐
                <div className="review-text">{r.review}</div>
              </div>
            ))}

            <button className="cancel-btn" onClick={() => setShowReviewModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
