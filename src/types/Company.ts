import { Address, UpdateAddress } from "./Address";
import { BaseEntity } from "./api";
import { ContactDetails, UpdateContactDetails } from "./ContactDetails";

export interface Company extends BaseEntity {
  name: string;
  description?: string;
  logo?: string;
  favicon?: string;
  brandingSettings: Record<string, any>;
  businessSettings: Record<string, any>;
  isActive: boolean;
  timezone?: string;
  currency?: string;
  language?: string;
  locations: Location[];
  addresses: Address[];
  contactDetails: ContactDetails[];
}

export interface UpdateCompany {
  name: string;
  description?: string;
  logo?: string;
  favicon?: string;
  brandingSettings: Record<string, any>;
  businessSettings: Record<string, any>;
  timezone?: string;
  currency?: string;
  language?: string;
  addresses: UpdateAddress[];
  contactDetails: UpdateContactDetails[];
}
