import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../../utils/image";
import axiosClient from "../../../../service/axiosClient";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get("/api/products");

        // 🔥 SỬA TẠI ĐÂY — backend trả về { content: [...] }
        setProducts(res.data.content);

      } catch (err) {
        console.error("Lỗi load products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;

    try {
      await axiosClient.delete(`/api/products/${id}`);

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const formatPrice = (price) =>
    price ? price.toLocaleString("vi-VN") + "đ" : "0đ";

  // 🔥 filter search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>

        <button
          onClick={() => navigate("/admin/products/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {/* 🔍 SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Tìm theo tên sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Hãng</th>
              <th>Giá</th>
              <th>Rating</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} className="border-t text-center hover:bg-gray-50">
                <td>{p.id}</td>

                <td className="p-2">
                  <img
                    src={getImageUrl(p.imageUrl)}
                    alt={p.name}
                    className="w-16 h-16 object-cover mx-auto rounded"
                  />
                </td>

                <td className="font-medium">{p.name}</td>

                <td>
                  <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                    {p.brand || "N/A"}
                  </span>
                </td>
                <td className="text-red-500 font-semibold">
                  {formatPrice(p.minPrice)}
                </td>

                <td>⭐ {p.rating}</td>

                <td className="space-x-2">
                  <button
                    onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                    className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="7" className="py-6 text-gray-500">
                  Không tìm thấy sản phẩm
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}