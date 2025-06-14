import React from "react";
import EntityManager from "../../components/entities/EntityManager";
import { fileEntityConfig } from "../../config/EntityConfig";
import { FileEntity } from "../../types";

const LocationsPage: React.FC = () => {
  return <EntityManager<FileEntity> config={fileEntityConfig} />;
};

export default LocationsPage;
