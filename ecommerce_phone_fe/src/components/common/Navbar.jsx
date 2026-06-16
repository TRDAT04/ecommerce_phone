import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { logoutApi } from "../../features/auth/api/authService";
import SearchBar from "../../features/search/components/SearchBar";
import {
  Search,
  ShoppingCart,
  User,
  Package,
  LogOut,
  Settings,
  Menu,
  X,
  Filter,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileKeyword, setMobileKeyword] = useState("");

  const handleMobileSearch = () => {
    const kw = mobileKeyword.trim();
    if (!kw) return;
    navigate(`/search?keyword=${encodeURIComponent(kw)}`);
    setMobileKeyword("");
  };

  const menuRef = useRef();

  const [cartCount, setCartCount] = useState(0);

  // AUTH
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const role = user?.role;

  // ================= MENU =================
  const userMenu = [
    {
      label: "Đơn hàng của tôi",
      path: "/my-orders",
      icon: Package,
    },
    {
      label: "Tra cứu đơn khác",
      path: "/track-order",
      icon: Package,
    },
    {
      label: "Thông tin tài khoản",
      path: "/profile",
      icon: User,
    },
    {
      label: "Đăng xuất",
      action: "logout",
      icon: LogOut,
    },
  ];

  const adminMenu = [
    {
      label: "Trang quản trị",
      path: "/admin/dashboard",
      icon: Settings,
    },
    {
      label: "Đăng xuất",
      action: "logout",
      icon: LogOut,
    },
  ];

  const guestMenu = [
    {
      label: "Đăng nhập",
      path: "/login",
      icon: User,
    },
    {
      label: "Đăng ký",
      path: "/register",
      icon: User,
    },
  ];

  const finalMenu = !user
    ? guestMenu
    : role === "ROLE_ADMIN" || role === "ROLE_SUPER_ADMIN" || role === "ROLE_DEMO_ADMIN"
      ? adminMenu
      : userMenu;

  // ================= LOGOUT =================
  const handleLogout = async () => {
    await logoutApi(); // Gọi BE: blacklist access token + xóa refresh cookie
    logout();          // Clear Zustand store + localStorage
    setOpen(false);
    navigate("/");
  };

  // CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= CART =================
  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || {
      items: [],
    };

    const total = cart.items.reduce((sum, i) => sum + i.quantity, 0);

    setCartCount(total);
  };

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => loadCart();

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  // ================= UI =================
  return (
    <nav className="relative z-[300] border-b border-black/5 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* LEFT */}
          <div className="flex items-center gap-10">
            {/* LOGO */}
            <div
              onClick={() => navigate("/")}
              className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-xl md:text-2xl font-black tracking-tight text-transparent"
            >
              NextMobile
            </div>
          </div>

          {/* SEARCH */}
          <div className="hidden max-w-2xl flex-1 md:flex">
            <SearchBar />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">
            {/* ORDER */}
            <button
              onClick={() => navigate(user ? "/my-orders" : "/track-order")}
              className="hidden items-center gap-2 text-sm font-medium transition hover:text-emerald-600 md:flex"
            >
              <Package className="h-5 w-5" />

              <span>{user ? "Đơn hàng" : "Tra cứu đơn"}</span>
            </button>

            {/* CART */}
            <button
              onClick={() => navigate("/cart")}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 transition hover:bg-emerald-50"
            >
              <ShoppingCart className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* ACCOUNT + DROPDOWN */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex h-11 items-center gap-2 rounded-xl bg-neutral-100 px-3 transition hover:bg-emerald-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  <User className="h-4 w-4" />
                </div>

                <span className="hidden text-sm font-medium sm:block">
                  {user ? user.name : "Tài khoản"}
                </span>
              </button>

              {/* DROPDOWN */}
              {open && (
                <div className="animate-in fade-in zoom-in-95 absolute top-full mt-2 right-0 z-50 w-64 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl duration-200">
                <div className="border-b bg-neutral-50 p-4">
                  <p className="font-semibold text-gray-800">
                    {user ? `Xin chào, ${user.name}` : "Tài khoản"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Quản lý tài khoản của bạn
                  </p>
                </div>

                <div className="py-2">
                  {finalMenu.map((item, index) => {
                    const Icon = item.icon;

                    if (item.action === "logout") {
                      return (
                        <button
                          key={index}
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm transition hover:bg-red-50 hover:text-red-500"
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </button>
                      );
                    }

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-neutral-100"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
            </div>{/* end relative wrapper */}
          </div>

        </div>{/* end flex h-16 */}

        {/* MOBILE SEARCH & FILTER */}
        <div className="pb-3 md:hidden flex gap-3 px-1">
          <div className="relative flex-1">
            <SearchBar />
          </div>
          {(location.pathname === "/" || location.pathname === "/search") && (
            <button
              onClick={() => window.dispatchEvent(new Event("toggleMobileFilter"))}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-neutral-100 transition hover:bg-emerald-50 hover:text-emerald-600 text-gray-600"
            >
              <Filter className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
