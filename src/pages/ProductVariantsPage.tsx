import React from "react";
import EntityManager from "../components/entities/EntityManager";
import { ProductVariant } from "../types/ProductVariant";
import { productVariantEntityConfig } from "../config/EntityConfig";

const ProductVariantsPage: React.FC = () => {
  return <EntityManager<ProductVariant> config={productVariantEntityConfig} />;
};

export default ProductVariantsPage;
