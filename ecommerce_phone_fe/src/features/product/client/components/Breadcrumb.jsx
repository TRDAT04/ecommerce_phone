import { useNavigate } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb({ product }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center flex-wrap gap-2 text-sm mb-2 text-gray-500  py-2  ">
      
      {/* HOME */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-1 cursor-pointer hover:text-red-500 transition"
      >
        <Home size={16} />
        <span>Trang chủ</span>
      </div>

      <ChevronRight size={16} className="text-gray-400" />

      {/* BRAND */}
      <div
        onClick={() => navigate(`/?brand=${product.brand}`)}
        className="cursor-pointer hover:text-red-500 transition font-medium"
      >
        {product.brand}
      </div>

      <ChevronRight size={16} className="text-gray-400" />

      {/* CURRENT */}
      <div className="text-gray-800 font-semibold line-clamp-1 max-w-[250px]">
        {product.name}
      </div>
    </div>
  );
}