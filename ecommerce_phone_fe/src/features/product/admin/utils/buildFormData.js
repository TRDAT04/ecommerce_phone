const buildFormData = ({
    name,
    brand,
    description,
    image,
    colors = [],
    variants = [],
    specifications = [],
    colorImages = {},
  }) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("description", description || "");
  
    if (image) {
      formData.append("image", image);
    }
  
    formData.append("colors", JSON.stringify(colors));
  
    formData.append(
      "variants",
      JSON.stringify(
        variants.map((v) => ({
          storage: v.storage,
          colorKey: v.colorKey || v.color,
          price: v.price,
          originalPrice: v.originalPrice,
          stock: v.stock,
        }))
      )
    );
  
    formData.append(
      "specifications",
      JSON.stringify(specifications)
    );
  
    Object.keys(colorImages).forEach((color) => {
      colorImages[color].forEach((file) => {
        formData.append(`colorImages[${color}]`, file);
      });
    });
  
    return formData;
  };
  export default buildFormData;