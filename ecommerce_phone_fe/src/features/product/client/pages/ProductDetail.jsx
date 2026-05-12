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
    <div className="max-w-7xl mx-auto py-4 px-2 md:px-8">
      <Breadcrumb product={data.product} />

      <h1 className="text-xl font-semibold mb-4">
        {data.product.name} {data.variant ? ` ${data.variant.storage}` : ""} {"Chính hãng"}
      </h1>

      <div className="flex flex-col md:grid md:grid-cols-14 gap-4 md:gap-6">
        {/* Gallery */}
        <div className="order-1 md:order-none md:col-start-1 md:col-span-8">
          <ProductGallery {...data} />
        </div>

        {/* RIGHT: Info & Promotions */}
        <div className="order-2 md:order-none md:col-start-9 md:col-span-6 md:row-span-3 md:sticky md:top-4 flex flex-col md:self-start md:row-start-1">
          <ProductInfo {...data} />
          <div className="pt-4"><ProductPromotions /></div>
        </div>

        {/* Commit */}
        <div className="order-3 md:order-none md:col-start-1 md:col-span-8">
          <ProductCommit brand={data.product.brand} />
        </div>

        {/* Specs */}
        <div className="order-4 md:order-none md:col-start-1 md:col-span-8">
          <ProductSpecs specs={data.product.specifications} />
        </div>
      </div>

      <ReviewSection productId={id} />
    </div>
  );
}
