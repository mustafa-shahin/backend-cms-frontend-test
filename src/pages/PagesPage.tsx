import React from "react";
import EntityManager from "../components/entities/EntityManager";
import { Page } from "../types/Page";
import { pageEntityConfig } from "../config/EntityConfig";

const PagesPage: React.FC = () => {
  return <EntityManager<Page> config={pageEntityConfig} />;
};

export default PagesPage;
