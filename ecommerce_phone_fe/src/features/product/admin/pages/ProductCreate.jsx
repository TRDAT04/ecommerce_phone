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
    removeSpec,

    handleSave,
    setErrors,
    normalize,
  } = useProductCreate(SPEC_OPTIONS);

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8 bg-white shadow-sm rounded-2xl border border-gray-100 my-6">
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight border-b border-gray-100 pb-4">Thêm sản phẩm mới</h1>

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
        removeSpec={removeSpec}
      />

      <div className="pt-6 border-t border-gray-100">
        <button
          onClick={handleSave}
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-sm shadow-emerald-600/20"
        >
          Lưu sản phẩm
        </button>
      </div>
    </div>
  );
}
