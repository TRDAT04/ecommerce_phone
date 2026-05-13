import { useParams } from "react-router-dom";
import { useUserEdit } from "../hooks/useUserEdit";
import {
  User, Phone, MapPin, Mail, Shield,
  KeyRound, Save, ArrowLeft, CheckCircle,
  Eye, EyeOff, AlertTriangle,
} from "lucide-react";
import { useState } from "react";

export default function UserEdit() {
  const { id } = useParams();
  const {
    user,
    loading,
    success,
    newPassword,
    setNewPassword,
    handleChange,
    handleSubmit,
    handleResetPassword,
    navigate,
  } = useUserEdit(id);

  const [showNewPwd, setShowNewPwd] = useState(false);

  if (!user)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );

  const initials = (user.name || user.email || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isAdmin = user.role === "ROLE_ADMIN" || user.role === "ROLE_SUPER_ADMIN";

  return (
    <div className="min-h-screen bg-gray-50/60 p-6">
      <div className="mx-auto max-w-3xl space-y-5">
        {/* Back */}
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-800"
        >
          <ArrowLeft size={15} />
          Quay lại danh sách
        </button>

        {/* Success Toast */}
        {success && (
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-3.5 ring-1 ring-emerald-200">
            <CheckCircle size={18} className="flex-shrink-0 text-emerald-500" />
            <p className="font-medium text-emerald-700">Cập nhật thành công!</p>
          </div>
        )}

        {/* User Header Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-6">
            <div className="flex items-center gap-4">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-lg ${
                isAdmin
                  ? "bg-gradient-to-br from-blue-400 to-indigo-600"
                  : "bg-gradient-to-br from-gray-400 to-gray-600"
              }`}>
                {initials}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{user.name || "Chưa cập nhật"}</h1>
                <p className="mt-0.5 text-sm text-gray-400">{user.email}</p>
                <span className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isAdmin ? "bg-blue-500/20 text-blue-300" : "bg-white/10 text-gray-300"
                }`}>
                  <Shield size={11} />
                  {user.role === "ROLE_SUPER_ADMIN" ? "Super Admin" : user.role === "ROLE_ADMIN" ? "Admin" : "User"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
              <h2 className="flex items-center gap-2 font-semibold text-gray-800">
                <User size={17} className="text-blue-500" />
                Chỉnh sửa thông tin
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Role */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Shield size={14} className="text-gray-400" />
                  Phân quyền
                </label>
                <select
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="ROLE_USER">User</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap gap-3 border-t border-gray-50 bg-gray-50/50 px-6 py-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-2.5 font-semibold text-white shadow-md shadow-blue-200 transition-all hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
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
                onClick={() => navigate("/admin/users")}
                className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-2.5 font-semibold text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
              >
                <ArrowLeft size={15} />
                Huỷ
              </button>
            </div>
          </div>
        </form>

        {/* Reset Password Section */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-red-100">
          <div className="border-b border-red-50 bg-red-50/50 px-6 py-4">
            <h2 className="flex items-center gap-2 font-semibold text-red-700">
              <KeyRound size={17} className="text-red-500" />
              Reset mật khẩu
            </h2>
          </div>

          <div className="p-6">
            {/* Warning */}
            <div className="mb-4 flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-100">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-amber-500" />
              <p className="text-sm text-amber-700">
                Thao tác này sẽ đặt lại mật khẩu của người dùng. Hãy thông báo cho họ sau khi reset.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type={showNewPwd ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới cho người dùng"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleResetPassword}
                disabled={!newPassword}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-red-200 transition-all hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                <KeyRound size={15} />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}