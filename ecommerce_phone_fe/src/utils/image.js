const API_URL = import.meta.env.VITE_API_URL;

export const getImageUrl = (url) => {
  if (!url) return "";

  // nếu là link full rồi thì giữ nguyên
  if (url.startsWith("http")) return url;

  // nếu là path từ backend thì nối domain
  return `${API_URL}${url}`;
};