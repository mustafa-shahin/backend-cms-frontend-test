import { BaseEntity } from "./api";

export interface ContactDetails extends BaseEntity {
  primaryPhone?: string;
  secondaryPhone?: string;
  mobile?: string;
  fax?: string;
  email?: string;
  secondaryEmail?: string;
  website?: string;
  linkedInProfile?: string;
  twitterProfile?: string;
  facebookProfile?: string;
  instagramProfile?: string;
  whatsAppNumber?: string;
  telegramHandle?: string;
  additionalContacts: Record<string, any>;
  isDefault: boolean;
  contactType?: string;
}

export interface CreateContactDetails {
  primaryPhone?: string;
  secondaryPhone?: string;
  mobile?: string;
  fax?: string;
  email?: string;
  secondaryEmail?: string;
  website?: string;
  linkedInProfile?: string;
  twitterProfile?: string;
  facebookProfile?: string;
  instagramProfile?: string;
  whatsAppNumber?: string;
  telegramHandle?: string;
  additionalContacts: Record<string, any>;
  isDefault: boolean;
  contactType?: string;
}

export interface UpdateContactDetails extends CreateContactDetails {}
