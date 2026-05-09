import { useParams, useNavigate } from "react-router-dom";

export default function Success() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full text-center">

        {/* ICON */}
        <div className="text-6xl mb-4">🎉</div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          Đặt hàng thành công!
        </h1>

        <p className="text-gray-600 mb-4">
          Cảm ơn bạn đã mua hàng tại <span className="font-semibold">NextMobile</span>
        </p>

        {/* ORDER ID */}
        <div className="bg-gray-100 p-4 rounded-xl mb-4">
          <p className="text-sm text-gray-500">Mã đơn hàng</p>
          <p className="text-xl font-bold text-red-500">#{id}</p>
        </div>

        {/* NOTE */}
        <p className="text-sm text-gray-500 mb-6">
          Vui lòng lưu mã đơn và số điện thoại để tra cứu đơn hàng
        </p>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/track-order")}
            className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-100"
          >
            📦 Tra cứu đơn
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
          >
            🛍️ Tiếp tục mua
          </button>
        </div>
      </div>
    </div>
  );
}