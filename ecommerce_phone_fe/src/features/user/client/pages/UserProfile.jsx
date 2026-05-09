import { useEffect, useState } from "react";
import axiosClient from "../../../../service/axiosClient";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  // ================= LOAD =================
  useEffect(() => {
    axiosClient
      .get("/api/users/me")
      .then((res) => setUser(res.data))
      .catch(() => alert("Không tải được thông tin"));
  }, []);

  // ================= CHANGE =================
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setSuccess(false);

      await axiosClient.put("/api/users/me", user);

      setSuccess(true);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow rounded-xl mt-1">
      <h1 className="text-2xl font-bold mb-6">👤 Thông tin tài khoản</h1>

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          ✅ Cập nhật thành công!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* EMAIL */}
        <div>
          <label>Email</label>
          <input
            value={user.email}
            disabled
            className="w-full border p-3 rounded bg-gray-100"
          />
        </div>

        {/* NAME */}
        <div>
          <label>Họ tên</label>
          <input
            name="name"
            value={user.name || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </div>

        {/* PHONE */}
        <div>
          <label>SĐT</label>
          <input
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </div>

        {/* ADDRESS */}
        <div>
          <label>Địa chỉ</label>
          <input
            name="address"
            value={user.address || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            {loading ? "Đang lưu..." : "Cập nhật"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/change-password")}
            className="bg-yellow-500 text-white px-6 py-3 rounded"
          >
            Đổi mật khẩu
          </button>
        </div>
      </form>
    </div>
  );
}
