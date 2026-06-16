import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Map path → title. Dynamic segments (":id", ":color") dùng prefix match.
const ROUTE_TITLES = {
  "/": " Nextmobile",
  "/login": "Đăng nhập",
  "/register": "Đăng ký ",
  "/search": "Tìm kiếm sản phẩm ",
  "/cart": "Giỏ hàng ",
  "/checkout": "Thanh toán ",
  "/track-order": "Tra cứu đơn hàng",
  "/my-orders": "Đơn hàng của tôi ",
  "/profile": "Hồ sơ cá nhân ",
  "/change-password": "Đổi mật khẩu ",
  // Dynamic routes (prefix match)
  "/product/": "Chi tiết sản phẩm ",
  "/success/": "Đặt hàng thành công ",
  "/order/": "Chi tiết đơn hàng ",
  // Admin
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Quản lý sản phẩm ",
  "/admin/products/create": "Thêm sản phẩm ",
  "/admin/orders": "Quản lý đơn hàng ",
  "/admin/users": "Quản lý người dùng ",
  "/admin/reviews": "Quản lý đánh giá ",
};

function getTitle(pathname) {
  // Exact match first
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];

  // Admin dynamic routes (edit pages)
  if (pathname.startsWith("/admin/products/edit/")) return "Chỉnh sửa sản phẩm | Nextmobile Admin";
  if (pathname.startsWith("/admin/products/") && pathname.includes("/images/")) return "Ảnh sản phẩm | Nextmobile Admin";
  if (pathname.startsWith("/admin/orders/")) return "Chi tiết đơn hàng | Nextmobile Admin";
  if (pathname.startsWith("/admin/users/")) return "Chi tiết người dùng | Nextmobile Admin";

  // Client dynamic routes
  for (const [prefix, title] of Object.entries(ROUTE_TITLES)) {
    if (prefix.endsWith("/") && pathname.startsWith(prefix)) return title;
  }

  return "Nextmobile";
}

export default function TitleUpdater() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = getTitle(pathname);
  }, [pathname]);

  return null; // Component không render gì
}
