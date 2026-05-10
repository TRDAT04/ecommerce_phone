import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function BannerSlider() {
  const navigate = useNavigate();
  const banners = [
    {
      image:
        "https://cdn.hoanghamobile.vn/i/home/Uploads/2026/04/21/iphone-16e-lock-viettel-web.png",
      productId: 26,
    },

    {
      image:
        "https://cdn.hoanghamobile.vn/i/home/Uploads/2026/04/01/s26-ultra-1200x375-0104.png",
      productId: 27,
    },

    {
      image:
        "https://cdn.hoanghamobile.vn/i/home/Uploads/2026/04/10/note-15-series-web.png",
      productId: 36,
    },
  ];

  const [current, setCurrent] = useState(0);

  const intervalRef = useRef(null);

  // ===== AUTO SLIDE =====
  useEffect(() => {
    startAuto();

    return stopAuto;
  }, []);

  const startAuto = () => {
    stopAuto();

    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3500);
  };

  const stopAuto = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // ===== NEXT / PREV =====
  const next = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div
      className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white"
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
    >
      {/* IMAGE */}
      <div
        className="cursor-pointer overflow-hidden"
        onClick={() => navigate(`/product/${banners[current].productId}`)}
      >
        <img
          src={banners[current].image}
          alt="banner"
          className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>

      {/* LEFT BUTTON */}
      <button
        onClick={prev}
        className="absolute top-1/2 left-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-700 opacity-0 shadow-md backdrop-blur transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={next}
        className="absolute top-1/2 right-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-700 opacity-0 shadow-md backdrop-blur transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/20 px-3 py-1.5 backdrop-blur-sm">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 bg-white"
                : "w-2.5 bg-white/60 hover:bg-white"
            } `}
          />
        ))}
      </div>
    </div>
  );
}
