import useProductCreate from "../hooks/useProductCreate";
import { SPEC_OPTIONS } from "../constants/specOptions";
import SpecsEditor from "../components/product_create/SpecsEditor";
import ColorManager from "../components/product_create/ColorManager";
import VariantManager from "../components/product_create/VariantManager";
import BasicInfoForm from "../components/product_create/BasicInfoForm";
export default function ProductCreatePage() {
  const {
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

    handleSave,
    setErrors,
    normalize,
  } = useProductCreate(SPEC_OPTIONS);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Thêm sản phẩm mới</h1>

      <BasicInfoForm
        productInfo={productInfo}
        setProductInfo={setProductInfo}
        errors={errors}
        setErrors={setErrors}
      />

      <ColorManager
        colors={colors}
        setColors={setColors}
        colorImages={colorImages}
        addColorImages={addColorImages}
        removeColorImage={removeColorImage}
        handleDragStartImage={handleDragStartImage}
        handleDropImage={handleDropImage}
        normalize={normalize}
        errors={errors}
      />
      <VariantManager
        variants={variants}
        colors={colors}
        updateVariant={updateVariant}
        removeVariant={removeVariant}
        addVariant={addVariant}
        errors={errors}
      />
      <SpecsEditor
        specs={specs}
        SPEC_OPTIONS={SPEC_OPTIONS}
        updateSpec={updateSpec}
        addSpec={addSpec}
      />

      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-6 py-3"
      >
        Save Product
      </button>
    </div>
  );
}
