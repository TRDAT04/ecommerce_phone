import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../service/axiosClient";

export const useSearch = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);

  const lastKeyword = useRef(""); // tránh gọi API trùng
  const wrapperRef = useRef(null); // detect click outside

  //  CLICK OUTSIDE → tắt suggest box
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //  DEBOUNCE + hạn chế gọi trùng keyword
  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      setShowSuggest(false);
      lastKeyword.current = ""; // ✅ fix bug 1
      return;
    }

    const timeout = setTimeout(() => {
      if (lastKeyword.current === keyword.trim()) return; // ✅ fix bug 2
      lastKeyword.current = keyword.trim();
      fetchSuggestions(keyword);
    }, 300);

    return () => clearTimeout(timeout);
  }, [keyword]);

  //  ============== CALL API SUGGEST ==============
  const fetchSuggestions = async (value) => {
    console.log("🔍 Fetching suggestions for:", value);

    try {
      const res = await axiosClient.get(`api/products/suggest`, {
        params: { keyword: value },
      });

      console.log("📡 API response:", res.data);

      setSuggestions(res.data);
      setShowSuggest(res.data.length > 0);
    } catch (err) {
      console.error("❌ Suggest API error:", err);
    }
  };

  //  SEARCH PAGE
  const handleSearch = () => {
    if (!keyword.trim()) return;

    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    reset();
  };

  // CLICK PRODUCT → DETAIL PAGE
  const goToProduct = (id) => {
    navigate(`/product/${id}`);
    reset();
  };

  const reset = () => {
    setKeyword("");
    setSuggestions([]);
    setShowSuggest(false);
    lastKeyword.current = "";
  };

  return {
    keyword,
    setKeyword,
    suggestions,
    showSuggest,
    setShowSuggest,
    handleSearch,
    goToProduct,
    wrapperRef,
  };
};
