import React from "react";
import EntityManager from "../components/entities/EntityManager";
import { Product } from "../types/Product";
import { productEntityConfig } from "../config/EntityConfig";

const ProductsPage: React.FC = () => {
  return <EntityManager<Product> config={productEntityConfig} />;
};

export default ProductsPage;
