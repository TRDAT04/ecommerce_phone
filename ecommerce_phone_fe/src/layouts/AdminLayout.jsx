import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Bell, Menu, X, ChevronRight, Home } from "lucide-react";
import { adminMenu } from "../config/adminMenu";
import { useAuthStore } from "../store/authStore";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Current page label
  const currentPage = adminMenu.find((item) =>
    item.path !== "/logout" && location.pathname.startsWith(item.path)
  );

  // Avatar initials
  const initials = (user?.name || user?.email || "A")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const SidebarContent = () => (
    <div className="sticky top-0 flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <Link
          to="/"
          title="Quay lại cửa hàng"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg transition-transform hover:scale-105 hover:shadow-emerald-500/30 active:scale-95"
        >
          <Home size={20} className="text-white" />
        </Link>
        <div>
          <h2 className="text-base font-bold text-white leading-tight">Admin Panel</h2>
          <p className="text-[11px] text-gray-400">NextMobile Dashboard</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {adminMenu.map((item) => {
          const Icon = item.icon;
          const isActive = item.path !== "/logout" && location.pathname.startsWith(item.path);

          if (item.path === "/logout") {
            return (
              <button
                key="logout"
                onClick={handleLogout}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/10 group-hover:bg-red-500/20">
                  <LogOut size={16} />
                </div>
                {item.label}
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-900/30"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}
            >
              {Icon && (
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isActive ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"
                }`}>
                  <Icon size={16} />
                </div>
              )}
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} className="opacity-70" />}
            </Link>
          );
        })}
      </nav>

    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/80">
      {/* === DESKTOP SIDEBAR === */}
     <aside className="hidden h-screen w-60 flex-shrink-0 flex-col bg-gray-950 lg:flex">
        <SidebarContent />
      </aside>

      {/* === MOBILE SIDEBAR OVERLAY === */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 h-full w-60 bg-gray-950">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* === MAIN CONTENT === */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm lg:px-6">
          {/* Left: hamburger + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-100 lg:hidden"
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-gray-400">Admin</span>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="font-semibold text-gray-800">
                {currentPage?.label || "Dashboard"}
              </span>
            </div>
          </div>

          {/* Right: actions + user */}
          <div className="flex items-center gap-2">
            {/* Bell */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-100">
              <Bell size={17} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* User chip */}
            <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 text-[11px] font-bold text-white shadow-sm">
                {initials}
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-gray-800 leading-tight">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[10px] text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}