import { useParams } from "react-router-dom";
import { useUserEdit } from "../hooks/useUserEdit";

export default function UserEdit() {
  const { id } = useParams();
  const {
    user,
    loading,
    success,
    newPassword,
    setNewPassword,
    handleChange,
    handleSubmit,
    handleResetPassword,
    navigate,
  } = useUserEdit(id);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">
      <h1 className="mb-6 text-2xl font-bold">✏️ Chỉnh sửa user</h1>

      {/* SUCCESS */}
      {success && (
        <div className="mb-4 rounded bg-green-100 p-3 text-green-700">
          ✅ Cập nhật thành công!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* EMAIL */}
        <div>
          <label className="font-semibold">Email</label>
          <input
            value={user.email}
            disabled
            className="w-full rounded border bg-gray-100 p-3"
          />
        </div>

        {/* NAME */}
        <div>
          <label className="font-semibold">Tên</label>
          <input
            name="name"
            value={user.name || ""}
            onChange={handleChange}
            className="w-full rounded border p-3"
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="font-semibold">Số điện thoại</label>
          <input
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            className="w-full rounded border p-3"
          />
        </div>

        {/* ADDRESS */}
        <div>
          <label className="font-semibold">Địa chỉ</label>
          <input
            name="address"
            value={user.address || ""}
            onChange={handleChange}
            className="w-full rounded border p-3"
          />
        </div>

        {/* ROLE */}
        <div>
          <label className="font-semibold">Role</label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="w-full rounded border p-3"
          >
            <option value="ROLE_USER">USER</option>
            <option value="ROLE_ADMIN">ADMIN</option>
          </select>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="rounded bg-gray-300 px-6 py-3 hover:bg-gray-400"
          >
            Quay lại
          </button>
        </div>
      </form>

      {/* RESET PASSWORD */}
      <div className="mt-8 border-t pt-6">
        <h3 className="mb-3 text-lg font-bold text-red-600">🔐 Reset mật khẩu</h3>

        <input
          type="password"
          placeholder="Nhập mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded border p-3"
        />

        <button
          type="button"
          onClick={handleResetPassword}
          className="mt-3 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Reset mật khẩu
        </button>
      </div>
    </div>
  );
}