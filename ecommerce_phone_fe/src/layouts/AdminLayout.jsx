import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  ChevronRight,
  LogOut,
  Bell,
} from "lucide-react";

import { adminMenu } from "../config/adminMenu";
import { useAuthStore } from "../store/authStore";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside
        className="
          w-64 bg-gray-900 text-white
          flex flex-col
          border-r border-gray-800
        "
      >
        {/* LOGO */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div
              className="
                w-11 h-11 rounded-2xl
                bg-green-500
                flex items-center justify-center
              "
            >
              <LayoutDashboard size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Admin Panel
              </h2>

              <p className="text-xs text-gray-400">
                Ecommerce Dashboard
              </p>
            </div>
          </div>

          
        </div>

        {/* MENU */}
        <nav className="space-y-2 flex-1 p-4">
          {adminMenu.map((item) => {
            const isActive =
              location.pathname.startsWith(item.path);

            const Icon = item.icon;

            // Logout
            if (item.path === "/logout") {
              return (
                <button
                  key={item.path}
                  onClick={handleLogout}
                  className="
                    w-full flex items-center justify-between
                    px-4 py-3 rounded-2xl
                    text-red-400
                    hover:bg-red-500/10
                    transition-all
                  "
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={18} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center justify-between
                  px-4 py-3 rounded-2xl
                  transition-all duration-200
                  group

                  ${
                    isActive
                      ? "bg-green-500 text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {Icon && <Icon size={18} />}

                  <span className="font-medium">
                    {item.label}
                  </span>
                </div>

                <ChevronRight
                  size={16}
                  className={`
                    transition-all
                    ${
                      isActive
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }
                  `}
                />
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header
          className="
            bg-white border-b border-gray-200
            px-6 py-4
            flex justify-between items-center
            sticky top-0 z-10
          "
        >
          {/* LEFT */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Tổng quan hệ thống
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* Notification */}
            <button
              className="
                relative w-10 h-10
                rounded-xl border border-gray-200
                flex items-center justify-center
                hover:bg-gray-50
                transition
              "
            >
              <Bell
                size={18}
                className="text-gray-700"
              />

              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {/* User */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">
                  Admin
                </p>

                <p className="text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>

              <img
                src="https://i.pravatar.cc/40"
                alt="avatar"
                className="w-10 h-10 rounded-full border"
              />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className=" flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}