import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      // Lưu toàn bộ khi login (không có refreshToken - đã chuyển sang HttpOnly Cookie)
      setAuth: ({ user, accessToken }) =>
        set({ user, accessToken }),

      // Chỉ cập nhật accessToken khi silent refresh
      setTokens: ({ accessToken }) =>
        set((state) => ({
          user: state.user,
          accessToken,
        })),

      logout: () =>
        set({
          user: null,
          accessToken: null,
        }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);