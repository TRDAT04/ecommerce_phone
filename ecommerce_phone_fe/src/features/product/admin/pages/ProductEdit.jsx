import { useParams, useNavigate } from "react-router-dom";
import { useProductEdit } from "../hooks/useProductEdit";
import { SPEC_OPTIONS } from "../constants/specOptions";

import BasicInfo from "../components/product_edit/BasicInfo";
import ProductImageUploader from "../components/product_edit/ProductImageUploader";
import ColorManager from "../components/product_edit/ColorManager";
import VariantTable from "../components/product_edit/VariantTable";
import SpecsManager from "../components/product_edit/SpecsManager";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const edit = useProductEdit(id);

  if (!edit.product) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 bg-white shadow-sm rounded-2xl border border-gray-100 my-6">
      <h2 className="text-3xl font-bold text-gray-800 tracking-tight border-b border-gray-100 pb-4">Sửa sản phẩm</h2>

      <form onSubmit={edit.handleSubmit} className="space-y-8">

        <BasicInfo product={edit.product} handleChange={edit.handleChange} />

        <ProductImageUploader
          product={edit.product}
          handleSelectImage={edit.handleSelectImage}
        />

        <ColorManager
          id={id}
          product={edit.product}
          navigate={navigate}
          draftColor={edit.draftColor}
          showColorInput={edit.showColorInput}
          setDraftColor={edit.setDraftColor}
          setShowColorInput={edit.setShowColorInput}
          addColor={edit.addColor}
          deleteColor={edit.deleteColor}
        />

        <VariantTable
          product={edit.product}
          handleVariantChange={edit.handleVariantChange}
          addVariant={edit.addVariant}
          deleteVariant={edit.deleteVariant}
        />

        <SpecsManager
          product={edit.product}
          SPEC_OPTIONS={SPEC_OPTIONS}
          handleSpecChange={edit.handleSpecChange}
          addSpec={edit.addSpec}
          deleteSpec={edit.deleteSpec}
        />

        <div className="pt-6 border-t border-gray-100">
          <button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-sm shadow-emerald-600/20 text-lg">
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}