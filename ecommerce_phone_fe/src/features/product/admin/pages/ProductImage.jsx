import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../../service/axiosClient";
import { getImageUrl } from "../../../../utils/image";

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
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <button
        onClick={() => navigate(`/admin/products/edit/${productId}`)}
        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded"
      >
        ← Quay lại
      </button>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ảnh màu: {selectedColor}</h2>

        {changed && (
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            💾 Lưu tất cả
          </button>
        )}
      </div>

      <input type="file" multiple onChange={handleUpload} />

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-4 gap-4 mt-4">
        {images.map((img, idx) => (
          <div
            key={img.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(idx)}
            className="relative border rounded-lg overflow-hidden cursor-move"
          >
            <div className="w-full aspect-square bg-gray-100">
              <img
                src={img.isTemp ? img.imageUrl : getImageUrl(img.imageUrl)}
                className="w-full h-full object-contain"
                alt=""
              />
            </div>

            <button
              onClick={() => handleDelete(img)}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
