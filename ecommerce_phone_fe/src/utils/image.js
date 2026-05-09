const API_URL = "http://localhost:8080";

export const getImageUrl = (url) => {
  if (!url) return "";

  // nếu là link full rồi thì giữ nguyên
  if (url.startsWith("http")) return url;

  // nếu là path từ BE thì nối domain
  return `${API_URL}${url}`;
};