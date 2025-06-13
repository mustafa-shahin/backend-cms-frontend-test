import React from "react";
import EntityManager from "../components/entities/EntityManager";
import { User } from "../types/entities";
import { userEntityConfig } from "../config/EntityConfig";

const UsersPage: React.FC = () => {
  return <EntityManager<User> config={userEntityConfig} />;
};

export default UsersPage;
