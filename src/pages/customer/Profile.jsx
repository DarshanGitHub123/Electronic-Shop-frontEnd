import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/users/profile").then(res => setUser(res.data));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-sm mx-auto border p-4 rounded">
      <h2 className="font-semibold text-lg mb-3">Profile</h2>

      <p className="text-sm">
        <strong>Name:</strong> {user.name}
      </p>
      <p className="text-sm">
        <strong>Email:</strong> {user.email}
      </p>
      <p className="text-sm">
        <strong>Role:</strong> {user.role}
      </p>
    </div>
  );
}
