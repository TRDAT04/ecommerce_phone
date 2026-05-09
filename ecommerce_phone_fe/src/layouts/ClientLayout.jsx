import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import TopBar from "../components/common/TopBar";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-neutral-50 to-neutral-100 text-gray-800">
      
      {/* Header */}
      <header className=" top-0 z-50 backdrop-blur bg-white/80 shadow-sm">
        <TopBar />
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
        <div className="min-h-[60vh]">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-10">
        <Footer />
      </footer>
    </div>
  );
}