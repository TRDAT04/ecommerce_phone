import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../../../service/axiosClient";
import { useNavigate } from "react-router-dom";

export const useProductDetail = (id) => {
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [variant, setVariant] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= FETCH =================
  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosClient.get(`/api/products/${id}`);
        const data = res.data;

        if (!isMounted) return;

        setProduct(data);

        const initStorage = data?.storages?.[0];
        if (!initStorage) return;

        setSelectedStorage(initStorage);

        const initVariant = data?.variants?.find(
          (v) => v.storage === initStorage && v.stock > 0
        );

        if (!initVariant) {
          setVariant(null);
          return;
        }

        setSelectedColor(initVariant.colorKey);
        setVariant(
          data.variantMap?.[`${initStorage}|${initVariant.colorKey}`] || null
        );
      } catch (err) {
        console.error("Fetch product error:", err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // ================= RESET IMAGE =================
  useEffect(() => {
    setImageIndex(0);
  }, [variant]);

  // ================= COLORS =================
  const availableColors = useMemo(() => {
    if (!product || !selectedStorage) return [];

    return (
      product.variants
        ?.filter((v) => v.storage === selectedStorage && v.stock > 0)
        ?.map((v) => ({
          name: v.colorName,
          key: v.colorKey,
        })) || []
    );
  }, [product, selectedStorage]);

  // ================= HANDLERS =================
  const changeStorage = (storage) => {
    if (!product) return;

    setSelectedStorage(storage);

    const variants = product.variants.filter(
      (v) => v.storage === storage && v.stock > 0
    );

    if (variants.length === 0) {
      setVariant(null);
      return;
    }

    let newColor = selectedColor;

    if (!variants.some((v) => v.colorKey === selectedColor)) {
      newColor = variants[0].colorKey;
    }

    setSelectedColor(newColor);
    setVariant(product.variantMap?.[`${storage}|${newColor}`] || null);
  };

  const changeColor = (colorKey) => {
    if (!product || !selectedStorage) return;

    setSelectedColor(colorKey);
    setVariant(product.variantMap?.[`${selectedStorage}|${colorKey}`] || null);
  };

  const changeImage = (direction) => {
    if (!variant?.images?.length) return;

    const total = variant.images.length;

    setImageIndex((prev) => {
      if (direction === "next") return (prev + 1) % total;
      if (direction === "prev") return (prev - 1 + total) % total;
      return prev;
    });
  };

  const setImage = (index) => setImageIndex(index);

  // ================= BUILD ITEM =================
  const buildItem = () => ({
    variantId: variant.id,
    name: product.name,
    price: variant.price,
    image: variant.images?.[0],
    storage: variant.storage,
    color: variant.colorName,
    quantity: 1,
  });

  // ================= ADD TO CART =================
  const addToCart = () => {
    if (!variant || !product) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || { items: [] };

    const existing = cart.items.find((i) => i.variantId === variant.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.items.push(buildItem());
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ================= BUY NOW =================
  const handleBuyNow = () => {
    if (!variant || !product) return;

    localStorage.setItem("buyNow", JSON.stringify(buildItem()));

    navigate("/checkout?type=buyNow");
  };

  return {
    product,
    variant,
    selectedStorage,
    selectedColor,
    imageIndex,
    availableColors,
    loading,
    error,
    changeStorage,
    changeColor,
    changeImage,
    setImage,
    addToCart,
    handleBuyNow,
  };
};
