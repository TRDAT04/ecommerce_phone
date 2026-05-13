import { useState } from "react";
import axiosClient from "../../../../service/axiosClient";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../store/authStore";
import {
  Lock, Eye, EyeOff, ShieldCheck,
  KeyRound, ArrowLeft, AlertCircle,
} from "lucide-react";

export default function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const validate = () => {
    if (!form.oldPassword) return "Vui lòng nhập mật khẩu cũ";
    if (!form.newPassword) return "Vui lòng nhập mật khẩu mới";
    if (form.newPassword.length < 6) return "Mật khẩu mới tối thiểu 6 ký tự";
    if (form.newPassword !== form.confirmPassword)
      return "Mật khẩu nhập lại không khớp";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);

    try {
      setLoading(true);
      await axiosClient.put("/api/users/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data;
      setError(typeof msg === "string" ? msg : "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };
  const strength = getStrength(form.newPassword);
  const strengthLabel = ["", "Rất yếu", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"][strength];
  const strengthColor = [
    "", "bg-red-400", "bg-orange-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-500",
  ][strength];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/60 px-4 py-10">
      <div className="w-full max-w-md space-y-4">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-800"
        >
          <ArrowLeft size={15} />
          Quay lại
        </button>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
              <KeyRound size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Đổi mật khẩu</h1>
            <p className="mt-1 text-sm text-gray-400">Cập nhật mật khẩu để bảo vệ tài khoản</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 ring-1 ring-red-200">
                <AlertCircle size={16} className="flex-shrink-0 text-red-500" />
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}

            {/* Old Password */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Lock size={14} className="text-gray-400" />
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <input
                  type={show.old ? "text" : "password"}
                  name="oldPassword"
                  value={form.oldPassword}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu cũ"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, old: !s.old }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {show.old ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Lock size={14} className="text-gray-400" />
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={show.new ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, new: !s.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {show.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength Bar */}
              {form.newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i <= strength ? strengthColor : "bg-gray-100"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`mt-1 text-xs font-medium ${
                    strength <= 2 ? "text-red-500" : strength <= 3 ? "text-amber-500" : "text-emerald-600"
                  }`}>
                    {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Lock size={14} className="text-gray-400" />
                Nhập lại mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={show.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu mới"
                  className={`w-full rounded-xl border bg-gray-50 px-4 py-3 pr-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-2 ${
                    form.confirmPassword && form.newPassword !== form.confirmPassword
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-gray-200 focus:border-amber-400 focus:ring-amber-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.confirmPassword && form.newPassword !== form.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">Mật khẩu không khớp</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 font-semibold text-white shadow-lg shadow-amber-200 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <ShieldCheck size={17} />
                  Xác nhận đổi mật khẩu
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              Sau khi đổi mật khẩu, bạn sẽ được đăng xuất và yêu cầu đăng nhập lại
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
