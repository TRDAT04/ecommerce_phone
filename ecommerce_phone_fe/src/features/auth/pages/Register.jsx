import { useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";
import {
  User, Mail, Phone, MapPin, Lock,
  Loader2, ArrowRight, Eye, EyeOff,
  AlertCircle, CheckCircle, Smartphone,
} from "lucide-react";

const FIELDS = [
  { name: "name",            label: "Họ và tên",        icon: User,   placeholder: "Nguyễn Văn A",         type: "text" },
  { name: "email",           label: "Email",             icon: Mail,   placeholder: "example@email.com",    type: "email" },
  { name: "phone",           label: "Số điện thoại",     icon: Phone,  placeholder: "0912 345 678",         type: "tel" },
  { name: "address",        label: "Địa chỉ",           icon: MapPin, placeholder: "Số nhà, đường, phường...", type: "text" },
];

export default function Register() {
  const navigate = useNavigate();

  const {
    form,
    touched,
    showPwd,
    showConfirm,
    loading,
    apiError,
    validCount,
    totalFields,
    getError,
    hasError,
    handleChange,
    handleBlur,
    toggleShowPwd,
    toggleShowConfirm,
    handleSubmit
  } = useRegister();

  const inputClass = (name) =>
    `flex items-center gap-3 rounded-xl border px-4 py-3 bg-gray-50 transition-all
    focus-within:bg-white focus-within:shadow-sm
    ${hasError(name)
      ? "border-red-400 focus-within:ring-2 focus-within:ring-red-100"
      : touched[name] && !getError(name)
        ? "border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100"
        : "border-gray-200 focus-within:ring-2 focus-within:ring-emerald-300 focus-within:border-emerald-400"
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-md">
            <Smartphone size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">NextMobile</h1>
          <p className="mt-1 text-sm text-gray-500">Tạo tài khoản miễn phí</p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-green-700 px-8 py-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <User size={20} />
                Đăng ký tài khoản
              </h2>
              {/* Progress */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">{validCount}/{totalFields}</span>
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-300"
                    style={{ width: `${(validCount / totalFields) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* API Error */}
            {apiError && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-red-50 px-4 py-3 ring-1 ring-red-200">
                <AlertCircle size={16} className="flex-shrink-0 text-red-500" />
                <p className="text-sm font-medium text-red-600">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Standard fields */}
              {FIELDS.map(({ name, label, icon: Icon, placeholder, type }) => {
                const err = getError(name);
                const isValid = touched[name] && !err;
                return (
                  <div key={name}>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      {label} <span className="text-red-500">*</span>
                    </label>
                    <div className={inputClass(name)}>
                      <Icon size={17} className={err ? "text-red-400" : isValid ? "text-emerald-500" : "text-gray-400"} />
                      <input
                        name={name}
                        type={type}
                        value={form[name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                      />
                      {isValid && <CheckCircle size={15} className="flex-shrink-0 text-emerald-500" />}
                    </div>
                    {err && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle size={12} /> {err}
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className={inputClass("password")}>
                  <Lock size={17} className={getError("password") ? "text-red-400" : "text-gray-400"} />
                  <input
                    name="password"
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tối thiểu 6 ký tự"
                    autoComplete="new-password"
                    className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  />
                  <button type="button" onClick={toggleShowPwd} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
                    {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {getError("password") && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle size={12} /> {getError("password")}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Nhập lại mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className={inputClass("confirmPassword")}>
                  <Lock size={17} className={getError("confirmPassword") ? "text-red-400" : "text-gray-400"} />
                  <input
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Nhập lại mật khẩu"
                    autoComplete="new-password"
                    className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  />
                  <button type="button" onClick={toggleShowConfirm} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                  {touched.confirmPassword && !getError("confirmPassword") && form.confirmPassword && (
                    <CheckCircle size={15} className="flex-shrink-0 text-emerald-500" />
                  )}
                </div>
                {getError("confirmPassword") && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle size={12} /> {getError("confirmPassword")}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3.5 font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Tạo tài khoản
                    <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-500">
              Đã có tài khoản?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-emerald-600 transition hover:text-emerald-700 hover:underline"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          © 2026 NextMobile. Bảo mật SSL.
        </p>
      </div>
    </div>
  );
}
