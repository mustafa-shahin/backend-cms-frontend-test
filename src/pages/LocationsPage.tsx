import React from "react";
import EntityManager from "../components/entities/EntityManager";
import { Location } from "../types/entities";
import { locationEntityConfig } from "../config/EntityConfig";

const LocationsPage: React.FC = () => {
  return <EntityManager<Location> config={locationEntityConfig} />;
};

export default LocationsPage;
