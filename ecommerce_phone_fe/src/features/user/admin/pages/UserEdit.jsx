import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../../service/axiosClient";
export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ thêm state password
  const [newPassword, setNewPassword] = useState("");

  // ================= LOAD USER =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosClient.get(`/api/admin/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        alert("Không tải được user");
      }
    };

    fetchUser();
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ================= UPDATE USER =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setSuccess(false);

      await axiosClient.put(`/api/admin/users/${id}`, user);

      setSuccess(true);

      // scroll lên đầu
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      return alert("Nhập mật khẩu mới");
    }

    if (!window.confirm("Bạn có chắc muốn reset mật khẩu user này?")) return;

    try {
      await axiosClient.put(`/api/admin/users/${id}/password`, {
        password: newPassword,
      });

      alert("Reset mật khẩu thành công!");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert("Lỗi reset mật khẩu");
    }
  };

  // auto hide success
  useEffect(() => {
    if (!success) return;

    const t = setTimeout(() => setSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [success]);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-6">✏️ Chỉnh sửa user</h1>

      {/* SUCCESS */}
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          ✅ Cập nhật thành công!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* EMAIL */}
        <div>
          <label className="font-semibold">Email</label>
          <input
            value={user.email}
            disabled
            className="w-full border p-3 rounded bg-gray-100"
          />
        </div>

        {/* NAME */}
        <div>
          <label className="font-semibold">Tên</label>
          <input
            name="name"
            value={user.name || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="font-semibold">Số điện thoại</label>
          <input
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </div>

        {/* ADDRESS */}
        <div>
          <label className="font-semibold">Địa chỉ</label>
          <input
            name="address"
            value={user.address || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </div>

        {/* ROLE */}
        <div>
          <label className="font-semibold">Role</label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          >
            <option value="ROLE_USER">USER</option>
            <option value="ROLE_ADMIN">ADMIN</option>
          </select>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded"
          >
            Quay lại
          </button>
        </div>
      </form>

      {/* ================= RESET PASSWORD ================= */}
      <div className="mt-8 border-t pt-6">
        <h3 className="font-bold text-lg mb-3 text-red-600">
          🔐 Reset mật khẩu
        </h3>

        <input
          type="password"
          placeholder="Nhập mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <button
          type="button"
          onClick={handleResetPassword}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-3"
        >
          Reset mật khẩu
        </button>
      </div>
    </div>
  );
}
