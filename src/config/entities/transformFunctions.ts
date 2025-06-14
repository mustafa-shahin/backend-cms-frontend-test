import { ContactDetails, Addresses } from "../../types";
export const transformDataForForm = (data: any) => {
  const transformed = {
    ...data,
    addresses:
      data.addresses?.length > 0
        ? data.addresses.map((addr: Addresses) => ({
            ...addr,
            // Convert null values to empty strings for text inputs
            street: addr.street || "",
            street2: addr.street2 || "",
            city: addr.city || "",
            state: addr.state || "",
            country: addr.country || "",
            postalCode: addr.postalCode || "",
            region: addr.region || "",
            district: addr.district || "",
            addressType: addr.addressType || "",
            notes: addr.notes || "",
            isDefault: addr.isDefault || false,
          }))
        : [{}],
    contactDetails:
      data.contactDetails?.length > 0
        ? data.contactDetails.map((contact: ContactDetails) => ({
            ...contact,
            // Convert null values to empty strings for text inputs
            primaryPhone: contact.primaryPhone || "",
            secondaryPhone: contact.secondaryPhone || "",
            mobile: contact.mobile || "",
            fax: contact.fax || "",
            email: contact.email || "",
            secondaryEmail: contact.secondaryEmail || "",
            website: contact.website || "",
            linkedInProfile: contact.linkedInProfile || "",
            twitterProfile: contact.twitterProfile || "",
            facebookProfile: contact.facebookProfile || "",
            instagramProfile: contact.instagramProfile || "",
            whatsAppNumber: contact.whatsAppNumber || "",
            telegramHandle: contact.telegramHandle || "",
            contactType: contact.contactType || "",
            isDefault: contact.isDefault || false,
            additionalContacts: contact.additionalContacts || {},
          }))
        : [{}],
  };

  return transformed;
};

export const transformDataForApi = (data: any) => {
  const transformed = { ...data };

  if (transformed.addresses) {
    transformed.addresses = transformed.addresses.filter(
      (addr: any) => addr.street || addr.city || addr.state || addr.country
    );
    if (transformed.addresses.length === 0) {
      delete transformed.addresses;
    }
  }

  // Clean up contact details - remove empty ones
  if (transformed.contactDetails) {
    transformed.contactDetails = transformed.contactDetails.filter(
      (contact: any) => contact.primaryPhone || contact.email || contact.website
    );
    if (transformed.contactDetails.length === 0) {
      delete transformed.contactDetails;
    }
  }
  return transformed;
};
