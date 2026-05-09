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
    <div className="max-w-6xl mx-auto bg-white p-8 shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6">Sản phẩm</h2>

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

        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg">
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
}