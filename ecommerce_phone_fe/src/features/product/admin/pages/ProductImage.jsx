import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../../service/axiosClient";
import { getImageUrl } from "../../../../utils/image";
import { ArrowLeft, Save, UploadCloud, X, GripHorizontal } from "lucide-react";

export default function ProductImage() {
  const { id, color } = useParams();
  const navigate = useNavigate();

  const productId = Number(id);
  const selectedColor = color;

  // ================= STATE =================
  const [images, setImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [changed, setChanged] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  // ================= LOAD =================
  const loadImages = async () => {
    try {
      setLoading(true);

      const res = await axiosClient.get(`/api/product-images`, {
        params: {
          productId,
          color: selectedColor,
        },
      });

      const safe = Array.isArray(res.data) ? res.data : [];
      setImages(safe);
    } catch (err) {
      console.error(err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId && selectedColor) {
      loadImages();
    }
  }, [productId, selectedColor]);

  // ================= UPLOAD (LOCAL ONLY) =================
  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const temp = files.map((file) => ({
      id: `temp_${Math.random()}`,
      imageUrl: URL.createObjectURL(file),
      file,
      isTemp: true,
    }));

    setImages((prev) => [...prev, ...temp]);
    setNewFiles((prev) => [...prev, ...temp]);
    setChanged(true);

    e.target.value = "";
  };

  // ================= DELETE =================
  const handleDelete = (img) => {
    if (img.isTemp) {
      setImages((prev) => prev.filter((i) => i.id !== img.id));
      setNewFiles((prev) => prev.filter((i) => i.id !== img.id));
      setChanged(true); 
      return;
    }

    setImages((prev) => prev.filter((i) => i.id !== img.id));
    setDeletedIds((prev) => [...prev, img.id]);
    setChanged(true);
  };

  // ================= DRAG =================
  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDrop = (dropIndex) => {
    if (dragIndex === null) return;

    const arr = [...images];
    const item = arr[dragIndex];

    arr.splice(dragIndex, 1);
    arr.splice(dropIndex, 0, item);

    setImages(arr);
    setChanged(true);
    setDragIndex(null);
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      setLoading(true);

      let uploaded = [];

      // 1. upload new
      if (newFiles.length > 0) {
        const formData = new FormData();
        formData.append("productId", productId);
        formData.append("color", selectedColor);
        
        newFiles.forEach((f) => {
          formData.append("files", f.file);
        });
        
        const res = await axiosClient.post(`/api/product-images`, formData);

        uploaded = res.data;
      }

    
      let uploadIndex = 0;

      let finalImages = images.map((img) => {
        if (img.isTemp) {
          return uploaded[uploadIndex++] || img;
        }
        return img;
      });

      // 2. delete
      await Promise.all(
        deletedIds.map((id) => axiosClient.delete(`/api/product-images/${id}`)))

      // 3. sort
      const idList = finalImages
      .filter((i) => !i.isTemp)
      .map((i) => i.id);

      await axiosClient.put(`/api/product-images/sort`, idList, {
        params: {
          productId,
          color: selectedColor,
        },
      });

      setImages(finalImages);
      setNewFiles([]);
      setDeletedIds([]);
      setChanged(false);

      alert("Lưu thành công!");
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.isTemp) {
          URL.revokeObjectURL(img.imageUrl);
        }
      });
    };
  }, []); 
  // ================= UI =================
  const fileInputRef = useRef(null);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-sm rounded-2xl border border-gray-100 my-6">
      <button
        onClick={() => navigate(`/admin/products/edit/${productId}`)}
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </button>

      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Ảnh màu: <span className="text-emerald-600">{selectedColor}</span></h2>

        {changed && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-emerald-600/20"
          >
            <Save className="w-5 h-5" /> Lưu tất cả
          </button>
        )}
      </div>

      {/* Dropzone */}
      <div 
        className="mb-8 border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="bg-emerald-100 p-3 rounded-full mb-4 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8 text-emerald-600" />
        </div>
        <p className="text-gray-700 font-medium text-lg">Click để chọn ảnh hoặc kéo thả vào đây</p>
        <p className="text-gray-400 text-sm mt-1">Hỗ trợ JPG, PNG, WEBP</p>
        <input type="file" multiple onChange={handleUpload} className="hidden" ref={fileInputRef} />
      </div>

      {loading && <div className="text-center py-4 text-gray-500">Đang tải...</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {images.map((img, idx) => (
          <div
            key={img.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(idx)}
            className="group relative border border-gray-200 rounded-2xl overflow-hidden cursor-move bg-white shadow-sm hover:shadow-md hover:border-emerald-300 transition-all"
          >
            <div className="absolute top-2 left-2 bg-black/40 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-10 pointer-events-none">
              <GripHorizontal className="w-4 h-4" />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(img); }}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 shadow-sm z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-full aspect-square bg-gray-50 p-2">
              <img
                src={img.isTemp ? img.imageUrl : getImageUrl(img.imageUrl)}
                className="w-full h-full object-contain mix-blend-multiply"
                alt=""
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
