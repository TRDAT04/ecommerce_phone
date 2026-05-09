export default function ProductDescription({ description }) {
    return (
      <div className="bg-white rounded-xl shadow p-6 border border-black/20 mt-4">
            <h2 className="text-lg font-bold mb-4">Thông tin sản phẩm</h2>

            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html: description || "<p>Chưa có mô tả</p>",
              }}
            />
          </div>
    );
  }