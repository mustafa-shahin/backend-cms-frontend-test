import React from "react";
import EntityManager from "../components/ui/EntityManager";
import { Folder } from "../types";
import { folderEntityConfig } from "../config/EntityConfig";

const FoldersPage: React.FC = () => {
  return <EntityManager<Folder> config={folderEntityConfig} />;
};

export default FoldersPage;
