import { useParams } from "react-router-dom";
import { useProductDetail } from "../hooks/useProductDetail";

import ProductGallery from "../components/ProductGallery";
import ProductInfo from "../components/ProductInfo";
import ProductSpecs from "../components/ProductSpecs";
import ProductDescription from "../components/ProductDescription";
import ProductCommit from "../components/ProductCommit";
import Breadcrumb from "../components/Breadcrumb";
import ReviewSection from "../components/ReviewSection";
import ProductPromotions from "../components/ProductPromotions";
export default function ProductDetail() {
  const { id } = useParams();

  const data = useProductDetail(id);

  if (!data.product) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 px-8">
      <Breadcrumb product={data.product} />

      <h1 className="text-xl font-semibold mb-4">
        {data.product.name} {data.variant ? ` ${data.variant.storage}` : "" } {"Chính hãng"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-14 gap-6">
        {/* LEFT */}
        <div className="bg-neutral-50 md:col-span-8 flex flex-col gap-4">
          <ProductGallery {...data} />
          <ProductCommit brand={data.product.brand} />
          <ProductSpecs specs={data.product.specifications} />
          {/* <ProductDescription description={data.product.description} /> */}
        </div>

        {/* RIGHT */}
        <div className="md:col-span-6 sticky top-4 flex flex-col ">
          <ProductInfo {...data} />
          <div className="pt-4"> <ProductPromotions /></div>
         
        </div>
      </div>

      <ReviewSection productId={id} />
    </div>
  );
}
