import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";

export default function AdminUserDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  const load = async () => {
    const res = await axios.get(`/admin/users/${id}`);
    setData(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>User Details</h2>

      <p><strong>Name:</strong> {data.user.name}</p>
      <p><strong>Email:</strong> {data.user.email}</p>
      <p><strong>Role:</strong> {data.user.role}</p>

      {data.ownerStores && (
        <>
          <h3>Owned Stores</h3>
          {data.ownerStores.map((s) => (
            <p key={s.id}>{s.name} — Avg Rating: {s.avgRating}</p>
          ))}
        </>
      )}
    </div>
  );
}
