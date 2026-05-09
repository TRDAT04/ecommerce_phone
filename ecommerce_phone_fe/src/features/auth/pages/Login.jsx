import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from "lucide-react";

export default function Login() {
  const { handleLogin, loading, error } = useLogin();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);

  const inputGroup =
    "flex items-center gap-3 border px-4 py-2 rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-green-500 transition";
  const input =
    "w-full bg-transparent outline-none text-gray-700 placeholder-gray-400";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="w-full max-w-md rounded-3xl border border-green-100 bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-green-700">
          Đăng nhập
        </h2>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <div className={inputGroup}>
          <Mail className="size-5 text-green-600" />
          <input
            name="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
            className={input}
            placeholder="Email"
          />
        </div>

        {/* PASSWORD */}
        <div className={`${inputGroup} mt-4`}>
          <Lock className="size-5 text-green-600" />
          <input
            name="password"
            type={showPass ? "text" : "password"}
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
            className={input}
            placeholder="Mật khẩu"
          />

          {/* SHOW/HIDE PASSWORD */}
          <div
            className="cursor-pointer text-gray-500 hover:text-green-600"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={() => handleLogin(form.email, form.password)}
          disabled={loading}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition ${
            loading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-green-600 shadow-md hover:bg-green-700 hover:shadow-lg"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" /> Đang đăng nhập...
            </>
          ) : (
            <>
              Đăng nhập <LogIn className="size-5" />
            </>
          )}
        </button>

        {/* REGISTER LINK */}
        <div className="mt-4 text-center text-sm">
          Chưa có tài khoản?{" "}
          <span
            className="cursor-pointer font-medium text-green-700 hover:text-green-800 hover:underline"
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </span>
        </div>
      </div>
    </div>
  );
}
