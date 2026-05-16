import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../../utils/image";
import axiosClient from "../../../../service/axiosClient";
import { Plus, Search, Edit, Trash2, Star } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { usePagination } from "../../../../hooks/usePagination";
import Pagination from "../../../../components/common/Pagination";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get("/api/products");
        setProducts(res.data.content);
      } catch (err) {
        console.error("Lỗi load products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc muốn xóa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (!result.isConfirmed) return;

    try {
      await axiosClient.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Xóa thành công!");
    } catch (err) {
      toast.error("Xóa thất bại!");
    }
  };

  const formatPrice = (price) =>
    price ? price.toLocaleString("vi-VN") + "đ" : "0đ";

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(keyword.toLowerCase())
  );

  const {
    paginatedData: paginatedProducts,
    page,
    totalPages,
    setPage,
    resetPage,
    handlePrev,
    handleNext,
    getPageNumbers,
    rangeText,
  } = usePagination(filteredProducts, 10);

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    resetPage();
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Quản lý sản phẩm</h2>
          <p className="text-sm text-gray-500 mt-1">Danh sách tất cả sản phẩm trong hệ thống</p>
        </div>

        <button
          onClick={() => navigate("/admin/products/create")}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-emerald-600/20"
        >
          <Plus className="w-5 h-5" />
          Thêm sản phẩm
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6 relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Tìm theo tên sản phẩm..."
          value={keyword}
          onChange={handleKeywordChange}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 text-gray-500 font-medium uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Hãng</th>
                <th className="px-6 py-4">Giá</th>
                <th className="px-6 py-4 text-center">Rating</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 shrink-0 rounded-xl border border-gray-100 bg-white p-2">
                        <img
                          src={getImageUrl(p.imageUrl)}
                          alt={p.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{p.name}</div>
                        <div className="text-gray-500 text-xs mt-1">ID: {p.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {p.brand || "N/A"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      {formatPrice(p.minPrice)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-1 bg-yellow-50 text-yellow-700 w-max mx-auto px-2 py-1 rounded-lg text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                      {p.rating}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                      className="inline-flex items-center justify-center p-2 text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
                      title="Sửa sản phẩm"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="inline-flex items-center justify-center p-2 text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-10 w-10 text-gray-300 mb-3" />
                      <p>Không tìm thấy sản phẩm nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <Pagination
          page={page}
          totalPages={totalPages}
          rangeText={rangeText}
          onPrev={handlePrev}
          onNext={handleNext}
          onPageSelect={setPage}
          getPageNumbers={getPageNumbers}
          accentColor="emerald"
        />
      </div>
    </div>
  );
}