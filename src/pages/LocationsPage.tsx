import React from "react";
import EntityManager from "../components/ui/EntityManager";
import { Location } from "../types";
import { locationEntityConfig } from "../config/EntityConfig";

const LocationsPage: React.FC = () => {
  return <EntityManager<Location> config={locationEntityConfig} />;
};

export default LocationsPage;
