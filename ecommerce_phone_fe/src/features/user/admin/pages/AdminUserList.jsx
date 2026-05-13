import { Search, Users, ShieldCheck, Shield, User, Edit, Trash2, Crown } from "lucide-react";
import { useAdminUsers } from "../hooks/useAdminUsers";

const ROLE_MAP = {
  ROLE_SUPER_ADMIN: {
    label: "Super Admin",
    color: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    dot: "bg-rose-400",
    icon: Crown,
  },
  ROLE_ADMIN: {
    label: "Admin",
    color: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    dot: "bg-blue-400",
    icon: Shield,
  },
  ROLE_USER: {
    label: "User",
    color: "bg-gray-100 text-gray-600",
    dot: "bg-gray-400",
    icon: User,
  },
};

export default function AdminUserList() {
  const {
    filteredUsers,
    loading,
    search,
    setSearch,
    isCurrentSuper,
    handleDelete,
    handleChangeRole,
    navigate,
  } = useAdminUsers();

  const isSuperAdmin = (u) => u.role === "ROLE_SUPER_ADMIN";

  // Stats
  const total = filteredUsers.length;
  const admins = filteredUsers.filter((u) => u.role === "ROLE_ADMIN").length;
  const supers = filteredUsers.filter((u) => u.role === "ROLE_SUPER_ADMIN").length;

  return (
    <div className="min-h-screen bg-gray-50/60 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-md">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Quản lý tài khoản</h1>
            <p className="text-sm text-gray-500">Tổng cộng {total} người dùng</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: "Tổng người dùng", value: total, icon: Users, bg: "from-gray-700 to-gray-900" },
            { label: "Admin", value: admins, icon: Shield, bg: "from-blue-500 to-indigo-600" },
            { label: "Super Admin", value: supers, icon: Crown, bg: "from-rose-500 to-red-600" },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className={`overflow-hidden rounded-2xl bg-gradient-to-br ${card.bg} p-4 shadow-sm`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-white/70">{card.label}</p>
                    <p className="mt-1 text-2xl font-extrabold text-white">{card.value}</p>
                  </div>
                  <div className="rounded-lg bg-white/20 p-2">
                    <Icon size={18} className="text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 overflow-hidden rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100 focus-within:ring-blue-200">
          <Search size={17} className="flex-shrink-0 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, số điện thoại..."
            className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Xoá
            </button>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="h-8 w-8 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            {/* Table header */}
            <div className="hidden border-b border-gray-100 bg-gray-50/80 px-5 py-3 sm:grid sm:grid-cols-6">
              {["ID", "Người dùng", "Số điện thoại", "Địa chỉ", "Phân quyền", "Hành động"].map((h, i) => (
                <span key={h} className={`text-xs font-semibold uppercase tracking-wide text-gray-500 ${i === 5 ? "text-center" : ""}`}>
                  {h}
                </span>
              ))}
            </div>

            {/* Empty */}
            {filteredUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Users size={36} className="mb-3 text-gray-200" />
                <p className="font-medium text-gray-400">
                  {search ? "Không tìm thấy người dùng nào" : "Chưa có tài khoản nào"}
                </p>
              </div>
            )}

            {/* Rows */}
            <div className="divide-y divide-gray-50">
              {filteredUsers.map((u) => {
                const targetIsSuper = isSuperAdmin(u);
                const roleInfo = ROLE_MAP[u.role] || ROLE_MAP.ROLE_USER;
                const RoleIcon = roleInfo.icon;

                // Avatar initials
                const initials = (u.name || u.email || "U")
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <div
                    key={u.id}
                    className={`grid items-center gap-4 px-5 py-4 sm:grid-cols-6 ${targetIsSuper ? "bg-rose-50/30" : "hover:bg-gray-50"
                      }`}
                  >
                    {/* ID */}
                    <div className="text-sm font-bold text-gray-500">#{u.id}</div>

                    {/* User info */}
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white ${targetIsSuper
                          ? "bg-gradient-to-br from-rose-400 to-red-600"
                          : u.role === "ROLE_ADMIN"
                            ? "bg-gradient-to-br from-blue-400 to-indigo-600"
                            : "bg-gradient-to-br from-gray-400 to-gray-600"
                        }`}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-800">{u.name || "—"}</p>
                        <p className="truncate text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="text-sm text-gray-600">{u.phone || "—"}</div>

                    {/* Address */}
                    <div className="max-w-[160px] truncate text-sm text-gray-600">{u.address || "—"}</div>

                    {/* Role */}
                    <div>
                      <div className={`mb-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${roleInfo.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${roleInfo.dot}`} />
                        <RoleIcon size={12} />
                        {roleInfo.label}
                      </div>
                      <select
                        value={u.role}
                        disabled={targetIsSuper}
                        onChange={(e) => handleChangeRole(u, e.target.value)}
                        className={`block w-full rounded-lg border px-2 py-1.5 text-xs outline-none transition focus:ring-2 ${targetIsSuper
                            ? "cursor-not-allowed border-rose-200 bg-rose-50 text-rose-600"
                            : "border-gray-200 bg-gray-50 text-gray-700 focus:border-blue-400 focus:ring-blue-100"
                          }`}
                      >
                        <option value="ROLE_USER">USER</option>
                        <option value="ROLE_ADMIN">ADMIN</option>
                        {(targetIsSuper || isCurrentSuper) && (
                          <option value="ROLE_SUPER_ADMIN">SUPER ADMIN</option>
                        )}
                      </select>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-2">
                      {/* NÚT SỬA:
                          - Nếu target là SUPER_ADMIN VÀ người dùng hiện tại KHÔNG phải SUPER_ADMIN → disable (gray)
                          - Nếu người dùng hiện tại LÀ SUPER_ADMIN → luôn được sửa (amber)
                          - Các user thường → blue
                      */}
                      <button
                        disabled={targetIsSuper && !isCurrentSuper}
                        onClick={() => {
                          if (isCurrentSuper || !targetIsSuper) navigate(`/admin/users/${u.id}`);
                        }}
                        title={
                          targetIsSuper && !isCurrentSuper
                            ? "Chỉ Super Admin mới có thể sửa tài khoản này"
                            : "Chỉnh sửa"
                        }
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all ${
                          targetIsSuper && !isCurrentSuper
                            ? "cursor-not-allowed bg-gray-300 opacity-60"
                            : targetIsSuper && isCurrentSuper
                            ? "bg-amber-500 hover:bg-amber-600 active:scale-95 shadow-sm shadow-amber-200"
                            : "bg-blue-500 hover:bg-blue-600 active:scale-95"
                        }`}
                      >
                        <Edit size={12} />
                        Sửa
                      </button>

                      {/* NÚT XOÁ: Super Admin luôn không được xoá */}
                      <button
                        disabled={targetIsSuper}
                        onClick={() => { if (!targetIsSuper) handleDelete(u); }}
                        title={targetIsSuper ? "Không thể xoá tài khoản Super Admin" : "Xoá"}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all ${
                          targetIsSuper
                            ? "cursor-not-allowed bg-gray-300 opacity-60"
                            : "bg-red-500 hover:bg-red-600 active:scale-95"
                        }`}
                      >
                        <Trash2 size={12} />
                        Xoá
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}