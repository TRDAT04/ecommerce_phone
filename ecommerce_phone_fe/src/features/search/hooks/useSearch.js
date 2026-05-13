import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../service/axiosClient";

const RECENT_KEY = "recentSearches";
const MAX_RECENT = 5;

// =========== Helpers ===========
const loadRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
};

const saveRecent = (keyword) => {
  const prev = loadRecent();
  const next = [keyword, ...prev.filter((k) => k !== keyword)].slice(
    0,
    MAX_RECENT,
  );
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
};

// =========== Hook ===========
export const useSearch = () => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(loadRecent);
  const [activeIndex, setActiveIndex] = useState(-1);

  const lastKeyword = useRef("");
  const abortRef = useRef(null);
  const wrapperRef = useRef(null);

  // =========== CLICK OUTSIDE → đóng dropdown ===========
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggest(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =========== DEBOUNCE + AbortController ===========
  useEffect(() => {
    const trimmed = keyword.trim();

    if (!trimmed) {
      setSuggestions([]);
      lastKeyword.current = "";
      setActiveIndex(-1);
      return;
    }

    const timeout = setTimeout(() => {
      if (lastKeyword.current === trimmed) return;
      lastKeyword.current = trimmed;
      fetchSuggestions(trimmed);
    }, 300);

    return () => clearTimeout(timeout);
  }, [keyword]);

  // =========== CALL API SUGGEST ===========
  const fetchSuggestions = useCallback(async (value) => {
    // Cancel request trước
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    try {
      const res = await axiosClient.get("api/products/suggest", {
        params: { keyword: value },
        signal: abortRef.current.signal,
      });

      setSuggestions(res.data || []);
      setShowSuggest(true);
    } catch (err) {
      if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
        setSuggestions([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // =========== KEYBOARD NAVIGATION ===========
  const handleKeyDown = useCallback(
    (e) => {
      if (!showSuggest) return;

      const total = suggestions.length;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % total);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + total) % total);
      } else if (e.key === "Escape") {
        setShowSuggest(false);
        setActiveIndex(-1);
      } else if (e.key === "Enter") {
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          goToProduct(suggestions[activeIndex].id);
        } else {
          handleSearch();
        }
      }
    },
    [showSuggest, suggestions, activeIndex],
  );

  // =========== SEARCH PAGE ===========
  const handleSearch = useCallback(() => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    saveRecent(trimmed);
    setRecentSearches(loadRecent());
    navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
    reset();
  }, [keyword, navigate]);

  // =========== CLICK PRODUCT → DETAIL PAGE ===========
  const goToProduct = useCallback(
    (id) => {
      navigate(`/product/${id}`);
      reset();
    },
    [navigate],
  );

  // =========== RECENT SEARCH ===========
  const handleRecentClick = useCallback(
    (kw) => {
      navigate(`/search?keyword=${encodeURIComponent(kw)}`);
      reset();
    },
    [navigate],
  );

  const clearRecent = useCallback(() => {
    localStorage.removeItem(RECENT_KEY);
    setRecentSearches([]);
  }, []);

  const reset = () => {
    setKeyword("");
    setSuggestions([]);
    setShowSuggest(false);
    setActiveIndex(-1);
    lastKeyword.current = "";
    if (abortRef.current) abortRef.current.abort();
  };

  // =========== FOCUS ===========
  const handleFocus = useCallback(() => {
    setShowSuggest(true);
  }, []);

  return {
    keyword,
    setKeyword,
    suggestions,
    showSuggest,
    loading,
    recentSearches,
    activeIndex,
    setActiveIndex,
    handleSearch,
    handleKeyDown,
    handleFocus,
    handleRecentClick,
    clearRecent,
    goToProduct,
    wrapperRef,
  };
};
