import { useState, useEffect } from "react";
import axiosClient from "../../../../service/axiosClient";

export default function useProductCreate(SPEC_OPTIONS = []) {
  const [productInfo, setProductInfo] = useState({
    name: "",
    brand: "",
    description: "",
    file: null,
  });

  const [colors, setColors] = useState([]);
  const [colorImages, setColorImages] = useState({});
  const [variants, setVariants] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [errors, setErrors] = useState({});

  // validate variant color khi colors thay đổi
  useEffect(() => {
    setVariants((prev) =>
      prev.map((v) =>
        colors.some((c) => c.key === v.color) ? v : { ...v, color: "" }
      )
    );
  }, [colors]);

  // ================= VARIANT =================
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        storage: "",
        color: "",
        price: 0,
        originalPrice: 0,
        stock: 0,
      },
    ]);
  };

  const updateVariant = (index, key, value) => {
    const newVariants = [...variants];
    newVariants[index][key] = value;
    setVariants(newVariants);
  };

  const removeVariant = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  // ================= COLOR =================
  const normalize = (c) => c?.trim().toLowerCase();

  const addColorImages = (colorKey, files) => {
    const key = normalize(colorKey);
    if (!key) return;

    setColorImages((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), ...Array.from(files)],
    }));
  };

  const removeColorImage = (colorKey, index) => {
    const key = normalize(colorKey);
    const newImages = [...(colorImages[key] || [])];
    newImages.splice(index, 1);

    setColorImages((prev) => ({
      ...prev,
      [key]: newImages,
    }));
  };

  const handleDragStartImage = (color, index) => {
    setDragIndex({ color: normalize(color), index });
  };

  const handleDropImage = (colorKey, dropIndex) => {
    const key = normalize(colorKey);

    if (!dragIndex || dragIndex.color !== key) {
      setDragIndex(null);
      return;
    }

    const newImages = [...(colorImages[key] || [])];

    const draggedItem = newImages[dragIndex.index];
    newImages.splice(dragIndex.index, 1);

    let insertIndex = dropIndex;
    if (dragIndex.index < dropIndex) {
      insertIndex = dropIndex - 1;
    }

    newImages.splice(insertIndex, 0, draggedItem);

    setColorImages((prev) => ({
      ...prev,
      [key]: newImages,
    }));

    setDragIndex(null);
  };

  // ================= SPEC =================
  const addSpec = () =>
    setSpecs([...specs, { specKey: "", specName: "", specValue: "" }]);

  const updateSpec = (index, key, value) => {
    setSpecs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
  
      // auto-fill specName khi đổi specKey
      if (key === "specKey") {
        const opt = SPEC_OPTIONS.find(o => o.specKey === value);
        updated[index].specName = opt ? opt.specName : "";
      }
  
      return updated;
    });
  };

  const removeSpec = (index) => {
    const newSpecs = [...specs];
    newSpecs.splice(index, 1);
    setSpecs(newSpecs);
  };

  // ================= VALIDATE =================
  const validate = () => {
    const newErrors = {};

    if (!productInfo.name.trim()) {
      newErrors.name = "Tên sản phẩm không được để trống";
    }

    if (!productInfo.brand.trim()) {
      newErrors.brand = "Hãng không được để trống";
    }

    if (colors.length === 0) {
      newErrors.color = "Phải có ít nhất 1 màu";
    }

    if (variants.length === 0) {
      newErrors.variants = "Phải có ít nhất 1 phiên bản";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!validate()) return;

    try {
      const formData = new FormData();

      formData.append("name", productInfo.name);
      formData.append("brand", productInfo.brand);
      formData.append("description", productInfo.description);
      formData.append("colors", JSON.stringify(colors));

      if (productInfo.file) {
        formData.append("image", productInfo.file);
      }

      formData.append(
        "variants",
        JSON.stringify(
          variants
            .filter((v) => v.color)
            .map((v) => ({
              storage: v.storage,
              colorKey: v.color,
              price: v.price,
              originalPrice: v.originalPrice,
              stock: v.stock,
            }))
        )
      );

      formData.append("specifications", JSON.stringify(specs));

      Object.keys(colorImages).forEach((color) => {
        colorImages[color].forEach((file) => {
          formData.append(`colorImages[${color}]`, file);
        });
      });

      await axiosClient.post("/api/products", formData);

      alert("Thêm sản phẩm thành công!");

      // reset
      setProductInfo({
        name: "",
        brand: "",
        description: "",
        rating: 5,
        file: null,
      });
      setVariants([]);
      setSpecs([]);
      setColorImages({});
      setColors([]);
    } catch (err) {
      console.error("Create failed:", err);
      alert("❌ Thêm sản phẩm thất bại!");
    }
  };

  return {
    productInfo,
    setProductInfo,
    colors,
    setColors,
    colorImages,
    variants,
    specs,
    errors,

    addVariant,
    updateVariant,
    removeVariant,

    addColorImages,
    removeColorImage,
    handleDragStartImage,
    handleDropImage,

    addSpec,
    updateSpec,
    removeSpec,

    handleSave,
    setErrors,
    normalize,
  };
}
