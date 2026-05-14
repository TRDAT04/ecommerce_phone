import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 */}
        <h1 className="text-8xl md:text-9xl font-extrabold text-black tracking-tight">
          404
        </h1>

        {/* Text */}
        <h2 className="mt-4 text-2xl md:text-3xl font-bold text-gray-800">
          Trang không tồn tại
        </h2>

       

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-black text-white font-medium hover:opacity-90 transition"
          >
            <Home size={18} />
            Về trang chủ
          </Link>

          
        </div>

        {/* Decorative */}
        <div className="mt-12 text-gray-300 text-sm">
          ERROR PAGE
        </div>
      </div>
    </div>
  );
}