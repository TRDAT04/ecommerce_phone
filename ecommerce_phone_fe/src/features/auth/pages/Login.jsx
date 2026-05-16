import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import {
  Mail, Lock, Eye, EyeOff, Loader2,
  LogIn, AlertCircle, Smartphone,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const {
    form,
    showPass,
    loading,
    error,
    fieldErrors,
    hasFieldError,
    handleChange,
    handleBlur,
    toggleShowPass,
    handleSubmit,
    handleGoogleLogin,
  } = useLogin();
  
  const navigate = useNavigate();

  const inputBase = (name) =>
    `flex items-center gap-3 rounded-xl border px-4 py-3 bg-gray-50 transition-all
    focus-within:bg-white focus-within:shadow-sm
    ${hasFieldError(name)
      ? "border-red-400 focus-within:ring-2 focus-within:ring-red-200"
      : "border-gray-200 focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-emerald-400"
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-md">
            <Smartphone size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">NextMobile</h1>
          <p className="mt-1 text-sm text-gray-500">Đăng nhập vào tài khoản của bạn</p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Card Header */}
          <div className="bg-gradient-to-r  px-8 pt-4">
            <h2 className="flex items-center justify-center gap-2 text-3xl font-bold text-green-700">
              
              Đăng nhập
            </h2>
          </div>

          <div className="p-6">
            {/* API Error */}
            {error && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-red-50 px-4 py-3 ring-1 ring-red-200">
                <AlertCircle size={16} className="flex-shrink-0 text-red-500" />
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className={inputBase("email")}>
                  <Mail size={17} className={hasFieldError("email") ? "text-red-400" : "text-gray-400"} />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="example@email.com"
                    autoComplete="email"
                    className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle size={12} /> {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className={inputBase("password")}>
                  <Lock size={17} className={hasFieldError("password") ? "text-red-400" : "text-gray-400"} />
                  <input
                    name="password"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tối thiểu 6 ký tự"
                    autoComplete="current-password"
                    className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPass}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle size={12} /> {fieldErrors.password}
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
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    Đăng nhập
                    <LogIn size={17} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="text-xs font-medium text-gray-400">HOẶC</span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  handleGoogleLogin(credentialResponse.credential);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                useOneTap
                theme="outline"
                shape="pill"
                locale="vi"
                text="continue_with"
                width="100%"
              />
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-500">
              Chưa có tài khoản?{" "}
              <button
                onClick={() => navigate("/register")}
                className="font-semibold text-emerald-600 transition hover:text-emerald-700 hover:underline"
              >
                Đăng ký ngay
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
