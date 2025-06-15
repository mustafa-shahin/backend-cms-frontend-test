import React from "react";
import EntityManager from "../components/entities/EntityManager";
import { Category } from "../types/Category";
import { categoryEntityConfig } from "../config/EntityConfig";

const CategoriesPage: React.FC = () => {
  return <EntityManager<Category> config={categoryEntityConfig} />;
};

export default CategoriesPage;
