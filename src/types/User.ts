import { Address, CreateAddress, UpdateAddress } from "./Address";
import { BaseEntity } from "./api";
import {
  ContactDetails,
  CreateContactDetails,
  UpdateContactDetails,
} from "./ContactDetails";
import { UserRole } from "./enums";

export interface User extends BaseEntity {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  isLocked: boolean;
  lastLoginAt?: string;
  avatar?: string;
  timezone?: string;
  language?: string;
  emailVerifiedAt?: string;
  preferences: Record<string, any>;
  addresses: Address[];
  contactDetails: ContactDetails[];
}

export interface CreateUser {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  avatar?: string;
  timezone?: string;
  language?: string;
  role: UserRole;
  preferences: Record<string, any>;
  addresses: CreateAddress[];
  contactDetails: CreateContactDetails[];
}

export interface UpdateUser {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  avatar?: string;
  timezone?: string;
  language?: string;
  role: UserRole;
  preferences: Record<string, any>;
  addresses: UpdateAddress[];
  contactDetails: UpdateContactDetails[];
}
