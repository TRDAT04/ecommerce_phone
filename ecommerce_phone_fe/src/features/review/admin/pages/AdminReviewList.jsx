import { useAdminReviews } from "../hooks/useAdminReviews";
import { Search, Trash2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "../../../../utils/image";

export default function AdminReviewList() {
  const {
    reviews,
    loading,
    keyword,
    setKeyword,
    page,
    totalPages,
    handleSearch,
    handlePageChange,
    handleDelete
  } = useAdminReviews();

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Quản lý đánh giá</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý các đánh giá của khách hàng</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-6 flex items-center gap-3 max-w-md">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo sản phẩm, user..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm"
        >
          Tìm
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 text-gray-500 font-medium uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4 text-center">Đánh giá</th>
                <th className="px-6 py-4">Nội dung</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading && reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">Đang tải...</td>
                </tr>
              ) : reviews.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 shrink-0 rounded-xl border border-gray-100 bg-white p-1">
                        <img
                          src={getImageUrl(r.productImage)}
                          alt={r.productName}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="max-w-[200px]">
                        <div className="font-semibold text-gray-900 truncate" title={r.productName}>{r.productName}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold text-xs">
                        {r.userAvatar}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{r.userName}</div>
                        <div className="text-gray-500 text-xs">{r.userEmail}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-0.5">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < r.rating ? "#f59e0b" : "transparent"} 
                          className={i < r.rating ? "text-amber-500" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-gray-700 line-clamp-2 max-w-xs" title={r.content}>
                      {r.content}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {r.createdAt}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="inline-flex items-center justify-center p-2 text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                      title="Xóa đánh giá"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && reviews.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-10 w-10 text-gray-300 mb-3" />
                      <p>Không tìm thấy đánh giá nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Trang {page + 1} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
