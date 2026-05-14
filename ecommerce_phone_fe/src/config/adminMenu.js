import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  MessageSquareText
} from "lucide-react";

export const adminMenu = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Quản lý sản phẩm",
    path: "/admin/products",
    icon: Package,
  },
  {
    label: "Quản lý đơn hàng",
    path: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Quản lý tài khoản",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Quản lý đánh giá",
    path: "/admin/reviews",
    icon: MessageSquareText,
  },
  {
    label: "Đăng xuất",
    path: "/logout",
    icon: LogOut,
  },
];