import React from "react";
import EntityManager from "../components/ui/EntityManager";
import { Page } from "../types";
import { pageEntityConfig } from "../config/EntityConfig";

const PagesPage: React.FC = () => {
  return <EntityManager<Page> config={pageEntityConfig} />;
};

export default PagesPage;
