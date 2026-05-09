import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/authService";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Loader2,
  ArrowRight,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.password
    ) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await register(form);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Email đã tồn tại hoặc dữ liệu không hợp lệ!");
    } finally {
      setLoading(false);
    }
  };

  const inputGroup =
    "flex items-center gap-3 border px-4 py-2 rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-green-500 transition";

  const input =
    "w-full bg-transparent outline-none text-gray-700 placeholder-gray-400";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="w-full max-w-md rounded-3xl border border-green-100 bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-green-700">
          Đăng ký tài khoản
        </h2>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div className={inputGroup}>
            <User className="size-5 text-green-600" />
            <input
              placeholder="Họ tên"
              className={input}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* EMAIL */}
          <div className={inputGroup}>
            <Mail className="size-5 text-green-600" />
            <input
              placeholder="Email"
              className={input}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* PHONE */}
          <div className={inputGroup}>
            <Phone className="size-5 text-green-600" />
            <input
              placeholder="Số điện thoại"
              className={input}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          {/* ADDRESS */}
          <div className={inputGroup}>
            <MapPin className="size-5 text-green-600" />
            <input
              placeholder="Địa chỉ"
              className={input}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          {/* PASSWORD */}
          <div className={inputGroup}>
            <Lock className="size-5 text-green-600" />
            <input
              type="password"
              placeholder="Mật khẩu"
              className={input}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition ${
              loading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-green-600 shadow-md hover:bg-green-700 hover:shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" /> Đang xử lý...
              </>
            ) : (
              <>
                Đăng ký <ArrowRight className="size-5" />
              </>
            )}
          </button>
        </form>

        {/* LOGIN LINK */}
        <div className="mt-4 text-center text-sm">
          Đã có tài khoản?{" "}
          <span
            className="cursor-pointer font-medium text-green-700 hover:text-green-800 hover:underline"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </span>
        </div>
      </div>
    </div>
  );
}
