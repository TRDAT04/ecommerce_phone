import { useEffect, useState } from "react";
import axiosClient from "../../../../service/axiosClient";
import { useAuthStore } from "../../../../store/authStore";

import { Star, MessageSquareText, PencilLine, X } from "lucide-react";

const defaultStats = {
  average: 0,
  total: 0,
  counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
};

export default function ReviewSection({ productId }) {
  const [stats, setStats] = useState(defaultStats);
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const user = useAuthStore((s) => s.user);
  const isLoggedIn = !!user;

  // ================= FETCH =================
  const fetchReviews = async () => {
    try {
      const res = await axiosClient.get(`/api/reviews/product/${productId}`);
      const data = res.data || [];

      setReviews(data);

      const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

      data.forEach((r) => {
        counts[r.rating] = (counts[r.rating] || 0) + 1;
      });

      const total = data.length;

      const average =
        total === 0
          ? 0
          : (data.reduce((s, r) => s + r.rating, 0) / total).toFixed(1);

      setStats({ average, total, counts });
    } catch {
      setStats(defaultStats);
      setReviews([]);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  // ================= SUBMIT =================
  const submitReview = async () => {
    try {
      await axiosClient.post(`/api/reviews`, {
        productId,
        rating,
        content,
      });

      alert("Đánh giá thành công!");

      setShowForm(false);
      setRating(5);
      setContent("");
      fetchReviews();
    } catch (e) {
      const msg = e.response?.data?.message;

      if (msg === "Bạn chưa mua sản phẩm này") {
        alert("❌ Bạn cần mua sản phẩm trước khi đánh giá");
      } else if (msg === "Bạn đã đánh giá sản phẩm này rồi") {
        alert("⚠️ Bạn đã đánh giá rồi");
      } else {
        alert("Lỗi gửi đánh giá");
      }
    }
  };

  const handleWriteReview = () => {
    if (!isLoggedIn) {
      alert("🔒 Vui lòng đăng nhập để đánh giá");
      return;
    }

    setShowForm(true);
  };

  // FILTER
  const filteredReviews =
    filter === 0 ? reviews : reviews.filter((r) => r.rating === filter);

  const getPercent = (c) =>
    stats.total === 0 ? 0 : Math.round((c / stats.total) * 100);

  const getAvatar = (name) => name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      {/* HEADER */}
      <div className="mb-8 flex items-center gap-2">
        <MessageSquareText className="text-green-500" size={24} />

        <h2 className="text-2xl font-bold">Đánh giá sản phẩm</h2>
      </div>

      {/* ===================== STATS ======================== */}
      <div className="grid grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="flex flex-col items-center text-center">
          <p className="text-6xl font-bold text-green-500">{stats.average}</p>

          <div className="my-3 flex gap-1">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={
                    i < Math.round(stats.average) ? "#4ade80" : "transparent"
                  }
                  className={
                    i < Math.round(stats.average)
                      ? "text-green-400"
                      : "text-gray-300"
                  }
                />
              ))}
          </div>

          <p className="text-sm text-gray-500">{stats.total} đánh giá</p>

          <button
            onClick={handleWriteReview}
            className="mt-4 flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2 font-medium text-white transition-all hover:bg-green-600"
          >
            <PencilLine size={16} />
            Viết đánh giá
          </button>
        </div>

        {/* RIGHT */}
        <div className="col-span-2 space-y-3">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3">
              <span className="w-6 text-sm font-medium">{star}★</span>

              <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-3 rounded-full bg-green-500 transition-all duration-300"
                  style={{
                    width: `${getPercent(stats.counts[star])}%`,
                  }}
                />
              </div>

              <span className="w-10 text-sm text-gray-500">
                {getPercent(stats.counts[star])}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== FILTER ======================== */}
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={() => setFilter(0)}
          className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
            filter === 0
              ? "border-green-500 bg-green-500 text-white shadow-sm"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          Tất cả
        </button>

        {[5, 4, 3, 2, 1].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
              filter === s
                ? "border-green-500 bg-green-500 text-white shadow-sm"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {s} sao
          </button>
        ))}
      </div>

      {/* ===================== LIST ======================== */}
      <div className="mt-8 space-y-5">
        {filteredReviews.map((r) => (
          <div
            key={r.id}
            className="flex gap-4 rounded-2xl border border-gray-100 p-4 transition-all hover:bg-gray-50 hover:shadow-sm"
          >
            {/* Avatar */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-lg font-bold text-white">
              {getAvatar(r.userName)}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{r.userName}</span>

                <div className="flex gap-0.5">
                  {Array(r.rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill="#4ade80"
                        className="text-green-400"
                      />
                    ))}
                </div>
              </div>

              <p className="mt-2 leading-relaxed text-gray-700">{r.content}</p>

              <p className="mt-2 text-xs text-gray-400">{r.createdAt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== MODAL ======================== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="animate-scaleIn relative w-96 rounded-2xl bg-white p-6 shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="mb-5 text-center text-xl font-bold">
              Đánh giá sản phẩm
            </h3>

            {/* Stars */}
            <div className="mb-5 flex justify-center gap-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    size={32}
                    onClick={() => setRating(i + 1)}
                    fill={i < rating ? "#4ade80" : "transparent"}
                    className={`cursor-pointer transition ${
                      i < rating
                        ? "scale-105 text-green-400"
                        : "text-gray-300 hover:text-green-300"
                    }`}
                  />
                ))}
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-24 w-full resize-none rounded-xl border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Chia sẻ trải nghiệm của bạn..."
            />

            <div className="mt-5 flex gap-3">
              <button
                onClick={submitReview}
                className="flex-1 rounded-xl bg-green-500 py-2.5 font-medium text-white transition hover:bg-green-600"
              >
                Gửi đánh giá
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl bg-gray-100 py-2.5 transition hover:bg-gray-200"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
