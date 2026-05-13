import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import TopBar from "../components/common/TopBar";
import { ArrowUp } from "lucide-react";

export default function ClientLayout() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="relative z-50">
        <TopBar />
        <Navbar />
      </header>

      {/* Page Content */}
      <main className="flex-1 w-full">
        <div className="min-h-[60vh]">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll-to-top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Lên đầu trang"
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-200 transition-all hover:scale-110 hover:shadow-xl active:scale-95"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}