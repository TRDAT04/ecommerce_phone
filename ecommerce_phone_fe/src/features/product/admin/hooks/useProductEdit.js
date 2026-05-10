import { useEffect, useState } from "react";
import axiosClient from "../../../../service/axiosClient";
import buildFormData from "../utils/buildFormData";

export const useProductEdit = (id) => {
  const [product, setProduct] = useState(null);
  const [draftColor, setDraftColor] = useState("");
  const [showColorInput, setShowColorInput] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    axiosClient.get(`/api/products/${id}`).then((res) => {
      const data = res.data;

      setProduct({
        ...data,
        variants: data.variants ?? [],
        specifications: data.specifications ?? [],
        colors: data.colors ?? [],
      });
    });
  }, [id]);

  // ================= BASIC =================
  const handleChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= VARIANTS =================
  const handleVariantChange = (index, field, value) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index
          ? { ...variant, [field]: value }
          : variant
      ),
    }));
  };

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: null,
          storage: "",
          colorKey: "",
          price: 0,
          originalPrice: 0,
          stock: 0,
        },
      ],
    }));
  };

  const deleteVariant = (index) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // ================= COLORS =================
  const toKey = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

  const addColor = () => {
    if (!draftColor.trim()) return;

    const name = draftColor.trim();
    const key = toKey(name);

    setProduct((prev) => {
      const exists = prev.colors.some((c) => c.key === key);

      if (exists) return prev;

      return {
        ...prev,
        colors: [...prev.colors, { name, key }],
      };
    });

    setDraftColor("");
    setShowColorInput(false);
  };

  const deleteColor = (colorKey) => {
    const isUsed = product.variants.some(
      (v) => v.colorKey === colorKey
    );

    if (isUsed) return;

    setProduct((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c.key !== colorKey),
    }));
  };

  // ================= IMAGE =================
  const handleSelectImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    setProduct((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: preview,
    }));
  };

  // ================= SPEC =================
  const handleSpecChange = (index, field, value) => {
    setProduct((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index
          ? { ...spec, [field]: value }
          : spec
      ),
    }));
  };

  const addSpec = () => {
    setProduct((prev) => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        {
          id: null,
          specKey: "",
          specName: "",
          specValue: "",
        },
      ],
    }));
  };

  const deleteSpec = (index) => {
    setProduct((prev) => ({
      ...prev,
      specifications: prev.specifications.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = buildFormData({
        name: product.name,
        brand: product.brand,
        description: product.description,
        image: product.imageFile,
        colors: product.colors,
        variants: product.variants,
        specifications: product.specifications,
      });

      await axiosClient.put(
        `/api/products/${id}`,
        formData
      );

      alert("Cập nhật thành công!");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(err);

      const res = err.response?.data;

      if (res) {
        alert(res.message || "Có lỗi xảy ra!");

        if (res.code === "VARIANT_IN_USE") {
          console.log("Variant đang được dùng");
        }

        if (res.code === "COLOR_IN_USE") {
          console.log("Color đang được dùng");
        }
      } else {
        alert("Lỗi server hoặc mất kết nối!");
      }
    }
  };

  return {
    product,
    draftColor,
    showColorInput,

    setDraftColor,
    setShowColorInput,
    handleChange,

    handleVariantChange,
    addVariant,
    deleteVariant,

    addColor,
    deleteColor,

    handleSelectImage,
    handleSpecChange,
    addSpec,
    deleteSpec,

    handleSubmit,
  };
};