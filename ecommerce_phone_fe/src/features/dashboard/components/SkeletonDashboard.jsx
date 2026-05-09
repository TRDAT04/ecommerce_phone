export default function SkeletonDashboard() {
  return (
    <div className="space-y-8 animate-pulse">
      
      {/* ===== OVERVIEW CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            </div>

            <div className="h-6 w-20 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* ===== CHART ===== */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="h-5 w-32 bg-gray-300 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* fake chart line */}
        <div className="relative h-[300px] w-full">
          <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gray-200 rounded-xl"></div>
          <div className="absolute bottom-10 left-4 right-4 h-1 bg-gray-300 rounded"></div>
          <div className="absolute bottom-20 left-8 right-8 h-1 bg-gray-300 rounded"></div>
          <div className="absolute bottom-32 left-12 right-12 h-1 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="h-5 w-40 bg-gray-300 rounded mb-6"></div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-4 items-center"
            >
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-6 bg-gray-300 rounded-full w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}