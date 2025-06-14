import { Address, CreateAddress } from "./Address";
import { BaseEntity } from "./api";
import { ContactDetails, CreateContactDetails } from "./ContactDetails";

export interface LocationOpeningHour extends BaseEntity {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  isOpen24Hours: boolean;
  notes?: string;
}

export interface Location extends BaseEntity {
  name: string;
  description?: string;
  locationCode?: string;
  locationType: string;
  isMainLocation: boolean;
  isActive: boolean;
  locationSettings: Record<string, any>;
  additionalInfo: Record<string, any>;
  openingHours: LocationOpeningHour[];
  addresses: Address[];
  contactDetails: ContactDetails[];
}

export interface CreateLocation {
  name: string;
  description?: string;
  locationCode?: string;
  locationType: string;
  isMainLocation: boolean;
  isActive: boolean;
  locationSettings: Record<string, any>;
  additionalInfo: Record<string, any>;
  openingHours: CreateLocationOpeningHour[];
  addresses: CreateAddress[];
  contactDetails: CreateContactDetails[];
}

export interface CreateLocationOpeningHour {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  isOpen24Hours: boolean;
  notes?: string;
}

export interface UpdateLocation extends CreateLocation {}
export type Locations = Location;
