import { useParams, useNavigate } from "react-router-dom";

export default function Success() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-xl">
        {/* ICON */}
        <div className="mb-4 text-6xl">🎉</div>

        {/* TITLE */}
        <h1 className="mb-2 text-2xl font-bold text-green-600">
          Đặt hàng thành công!
        </h1>
        <p className="mb-4 text-gray-600">
          Cảm ơn bạn đã mua hàng tại{" "}
          <span className="font-semibold">NextMobile</span>
        </p>

        {/* ORDER ID */}
        <div className="mb-4 rounded-xl bg-gray-100 p-4">
          <p className="text-sm text-gray-500">Mã đơn hàng</p>
          <p className="text-xl font-bold text-red-500">#{id}</p>
        </div>

        <p className="mb-6 text-sm text-gray-500">
          Vui lòng lưu mã đơn và số điện thoại để tra cứu đơn hàng
        </p>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/track-order")}
            className="flex-1 rounded-lg border border-gray-300 py-3 hover:bg-gray-100"
          >
            📦 Tra cứu đơn
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 rounded-lg bg-red-500 py-3 text-white hover:bg-red-600"
          >
            🛍️ Tiếp tục mua
          </button>
        </div>
      </div>
    </div>
  );
}