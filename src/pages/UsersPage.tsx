import React from "react";
import EntityManager from "../components/ui/EntityManager";
import { User } from "../types";
import { userEntityConfig } from "../config/EntityConfig";

const UsersPage: React.FC = () => {
  return <EntityManager<User> config={userEntityConfig} />;
};

export default UsersPage;
