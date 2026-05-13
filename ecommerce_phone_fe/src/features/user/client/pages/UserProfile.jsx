import { useEffect, useState } from "react";
import axiosClient from "../../../../service/axiosClient";
import { useNavigate } from "react-router-dom";
import {
  User, Phone, MapPin, Mail, KeyRound,
  CheckCircle, Save, ChevronRight,
} from "lucide-react";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient
      .get("/api/users/me")
      .then((res) => setUser(res.data))
      .catch(() => alert("Không tải được thông tin"));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSuccess(false);
      await axiosClient.put("/api/users/me", user);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      alert("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-red-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-500">Đang tải thông tin...</p>
        </div>
      </div>
    );

  // Avatar initials
  const initials = (user.name || user.email || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50/60 px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-5">
        {/* Success Toast */}
        {success && (
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-3.5 ring-1 ring-emerald-200">
            <CheckCircle size={18} className="flex-shrink-0 text-emerald-500" />
            <p className="font-medium text-emerald-700">Cập nhật thông tin thành công!</p>
          </div>
        )}

        {/* Profile Hero Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-8">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-400 to-rose-600 text-xl font-bold text-white shadow-lg">
                {initials}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{user.name || "Chưa cập nhật"}</h1>
                <p className="mt-0.5 text-sm text-gray-400">{user.email}</p>
                <span className="mt-1.5 inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                  {user.role === "ROLE_ADMIN" ? "Quản trị viên" : "Thành viên"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
              <h2 className="flex items-center gap-2 font-semibold text-gray-800">
                <User size={17} className="text-red-500" />
                Thông tin cá nhân
              </h2>
            </div>

            <div className="space-y-4 p-6">
              {/* Email (disabled) */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Mail size={14} className="text-gray-400" />
                  Email
                  <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">Không thể thay đổi</span>
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <Mail size={15} className="flex-shrink-0 text-gray-300" />
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User size={14} className="text-gray-400" />
                  Họ và tên
                </label>
                <input
                  name="name"
                  value={user.name || ""}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Phone size={14} className="text-gray-400" />
                  Số điện thoại
                </label>
                <input
                  name="phone"
                  value={user.phone || ""}
                  onChange={handleChange}
                  placeholder="0123 456 789"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                />
              </div>

              {/* Address */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin size={14} className="text-gray-400" />
                  Địa chỉ
                </label>
                <input
                  name="address"
                  value={user.address || ""}
                  onChange={handleChange}
                  placeholder="Số nhà, đường, phường/xã..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-wrap items-center gap-3 border-t border-gray-50 bg-gray-50/50 px-6 py-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-6 py-2.5 font-semibold text-white shadow-md shadow-red-200 transition-all hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Lưu thay đổi
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/change-password")}
                className="group flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-2.5 font-semibold text-gray-700 transition-all hover:border-amber-400 hover:text-amber-600"
              >
                <KeyRound size={16} />
                Đổi mật khẩu
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
