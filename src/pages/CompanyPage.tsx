import React from "react";
import EntityManager from "../components/ui/EntityManager";
import { Company } from "../types";
import { companyEntityConfig } from "../config/EntityConfig";

const CompanyPage: React.FC = () => {
  return <EntityManager<Company> config={companyEntityConfig} />;
};

export default CompanyPage;
