import { useEffect, useState } from "react";
import { createProduct } from "../api/productService";
import buildFormData from "../utils/buildFormData";
import toast from "react-hot-toast";

// ================= HOOK =================
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

  // ================= RESET =================
  const resetForm = () => {
    setProductInfo({
      name: "",
      brand: "",
      description: "",
      file: null,
    });

    setVariants([]);
    setSpecs([]);
    setColorImages({});
    setColors([]);
  };

  // validate variant color khi colors thay đổi
  useEffect(() => {
    setVariants((prev) =>
      prev.map((v) =>
        colors.some((c) => c.key === v.color) ? v : { ...v, color: "" },
      ),
    );
  }, [colors]);

  // ================= VARIANT =================
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
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
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= COLOR =================
  const normalize = (c = "") => c.trim().toLowerCase();

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

    setColorImages((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, i) => i !== index),
    }));
  };

  const handleDragStartImage = (color, index) => {
    setDragIndex({
      color: normalize(color),
      index,
    });
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

    const insertIndex = dragIndex.index < dropIndex ? dropIndex - 1 : dropIndex;

    newImages.splice(insertIndex, 0, draggedItem);

    setColorImages((prev) => ({
      ...prev,
      [key]: newImages,
    }));

    setDragIndex(null);
  };

  // ================= SPEC =================
  const addSpec = () => {
    setSpecs((prev) => [
      ...prev,
      {
        specKey: "",
        specName: "",
        specValue: "",
      },
    ]);
  };

  const updateSpec = (index, key, value) => {
    setSpecs((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [key]: value,
      };

      if (key === "specKey") {
        const opt = SPEC_OPTIONS.find((o) => o.specKey === value);

        updated[index].specName = opt ? opt.specName : "";
      }

      return updated;
    });
  };

  const removeSpec = (index) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
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
      const formData = buildFormData({
        name: productInfo.name,
        brand: productInfo.brand,
        description: productInfo.description,
        image: productInfo.file,

        colors,
        variants,

        specifications: specs,

        colorImages,
      });

      await createProduct(formData);

      toast.success("Thêm sản phẩm thành công!");

      resetForm();
    } catch (err) {
      console.error("Create failed:", err);

      toast.error("Thêm sản phẩm thất bại!");
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
