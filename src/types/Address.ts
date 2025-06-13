import { BaseEntity } from "./api";

export interface Address extends BaseEntity {
  street: string;
  street2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  region?: string;
  district?: string;
  isDefault: boolean;
  addressType?: string;
  notes?: string;
}

export interface CreateAddress {
  street: string;
  street2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  region?: string;
  district?: string;
  isDefault: boolean;
  addressType?: string;
  notes?: string;
}
export interface UpdateAddress extends CreateAddress {}
