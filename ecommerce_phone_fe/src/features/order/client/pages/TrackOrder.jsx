import { useNavigate } from "react-router-dom";
import { useTrackOrder } from "../hooks/useTrackOrder";

const STATUS_CLASSES = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPING: "bg-purple-100 text-purple-700",
  DONE: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function TrackOrder() {
  const { phone, setPhone, orders, error, setError, handleSearch } = useTrackOrder();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 flex items-center gap-2 text-3xl font-bold text-gray-800">
        🔍 Tra cứu đơn hàng
      </h1>

      {/* SEARCH BOX */}
      <div className="mb-3 flex gap-3">
        <input
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setError("");
          }}
          placeholder="Nhập số điện thoại"
          className={`flex-1 rounded-2xl border px-4 py-3 shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        <button
          onClick={handleSearch}
          className="rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white shadow transition hover:bg-blue-700 active:scale-95"
        >
          Tra cứu
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <p className="mb-4 flex items-center gap-1 text-sm font-medium text-red-500">
          ⚠️ {error}
        </p>
      )}

      {/* ORDERS */}
      <div className="mt-6 space-y-4">
        {orders.map((o) => (
          <div
            key={o.id}
            onClick={() => navigate(`/order/${o.id}`)}
            className="cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition hover:bg-gray-50 hover:shadow-md"
          >
            <div className="mb-1 flex items-center justify-between">
              <p className="text-lg font-bold text-gray-800">🧾 Đơn #{o.id}</p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  STATUS_CLASSES[o.status] || "bg-gray-200 text-gray-700"
                }`}
              >
                {o.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-700">
              Tổng tiền:{" "}
              <span className="text-base font-semibold text-red-600">
                {o.totalPrice?.toLocaleString()} đ
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}