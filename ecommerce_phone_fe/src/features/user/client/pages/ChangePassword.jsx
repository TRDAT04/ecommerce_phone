import { useState } from "react";
import axiosClient from "../../../../service/axiosClient";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../store/authStore";

export default function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= VALIDATE =================
  const validate = () => {
    if (!form.oldPassword) return "Nhập mật khẩu cũ";
    if (!form.newPassword) return "Nhập mật khẩu mới";
    if (form.newPassword.length < 6) return "Mật khẩu tối thiểu 6 ký tự";
    if (form.newPassword !== form.confirmPassword)
      return "Mật khẩu nhập lại không khớp";
    return null;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) return alert(error);

    try {
      setLoading(true);

      await axiosClient.put("/api/users/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      alert("Đổi mật khẩu thành công. Vui lòng đăng nhập lại!");

      // 🔥 logout
      logout();

      // 🔥 redirect login
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">🔒 Đổi mật khẩu</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* OLD PASSWORD */}
        <input
          type="password"
          name="oldPassword"
          placeholder="Mật khẩu cũ"
          value={form.oldPassword}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        {/* NEW PASSWORD */}
        <input
          type="password"
          name="newPassword"
          placeholder="Mật khẩu mới"
          value={form.newPassword}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        {/* CONFIRM */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
}
