import React from "react";
import EntityManager from "../components/entities/EntityManager";
import { Locations } from "../types";
import { locationEntityConfig } from "../config/entities/locationConfig";

const LocationsPage: React.FC = () => {
  return <EntityManager<Locations> config={locationEntityConfig} />;
};

export default LocationsPage;
