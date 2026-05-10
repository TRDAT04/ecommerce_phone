import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";

export default function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const navigate = useNavigate();
  

  // ================= LOAD =================
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || {
      items: [],
    };

    
    setCart(data);
  }, []);

  // ================= SAVE =================
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ================= ACTION =================
  const increase = (index) => {
    const newCart = { ...cart };
    newCart.items[index].quantity += 1;
    updateCart(newCart);
  };

  const decrease = (index) => {
    const newCart = { ...cart };

    if (newCart.items[index].quantity > 1) {
      newCart.items[index].quantity -= 1;
      updateCart(newCart);
    }
  };

  const removeItem = (index) => {
    const newCart = { ...cart };
    newCart.items.splice(index, 1);
    updateCart(newCart);
  };

  // ================= TOTAL =================
  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // ================= EMPTY =================
  if (cart.items.length === 0) {
    return (
      <div className="py-20 text-center ">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <ShoppingCart className="text-red-500" size={30} />
          </div>
        </div>

        <h1 className="mb-3 text-xl font-semibold">
          Giỏ hàng của bạn đang trống
        </h1>

        <button
          onClick={() => navigate("/")}
          className="rounded-xl bg-red-500 px-6 py-3 text-white transition hover:bg-red-600"
        >
          Mua sắm ngay
        </button>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 md:grid-cols-3">
      {/* LEFT */}
      <div className="rounded-2xl border border-gray-100 bg-white/80 p-5  md:col-span-2">
        <div className="mb-5 flex items-center gap-2">
          <ShoppingCart size={22} className="text-red-500" />

          <h1 className="text-xl font-bold">Giỏ hàng</h1>
        </div>

        {cart.items.map((item, i) => (
          
          
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border-b border-gray-100 px-2 py-4 transition-all hover:bg-gray-50"
          >
            {/* IMAGE */}
            <img
              src={item.image}
              className="h-24 w-24 object-contain"
            />

            {/* INFO */}
            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.name}</p>

              <p className="mt-1 text-sm text-gray-500">
                {item.storage} · {item.color}
              </p>

              <p className="mt-2 font-semibold text-red-500">
                {item.price.toLocaleString()} đ
              </p>
            </div>

            {/* QUANTITY */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => decrease(i)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 transition hover:bg-gray-100"
              >
                <Minus size={14} />
              </button>

              <span className="min-w-[20px] text-center font-medium">
                {item.quantity}
              </span>

              <button
                onClick={() => increase(i)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 transition hover:bg-gray-100"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* REMOVE */}
            <button
              onClick={() => removeItem(i)}
              className="p-1 text-red-500 transition hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="sticky top-4 h-fit rounded-2xl border border-gray-100 bg-white/80 p-5 ">
        <h2 className="mb-5 text-lg font-semibold">Tóm tắt đơn hàng</h2>

        <div className="mb-3 flex justify-between text-gray-600">
          <span>Tạm tính</span>

          <span>{total.toLocaleString()} đ</span>
        </div>

        <div className="mb-3 flex justify-between text-gray-600">
          <span>Giảm giá</span>

          <span>0 đ</span>
        </div>

        <div className="flex justify-between border-t pt-4 text-lg font-bold">
          <span>Tổng tiền</span>

          <span className="text-red-500">{total.toLocaleString()} đ</span>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
        >
          Mua ngay
          <ArrowRight size={18} />
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-3 w-full rounded-xl border border-gray-300 py-3 transition hover:bg-gray-50"
        >
          Chọn thêm sản phẩm
        </button>
      </div>
    </div>
  );
}
