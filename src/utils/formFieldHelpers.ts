import {
  FormField,
  SelectOption,
  TextField,
  NumberField,
  TextAreaField,
  SelectField,
  CheckboxField,
} from "../types/FormFields";

const emailPattern = {
  value: /^\S+@\S+$/i,
  message: "Invalid email address",
};

export const createTextField = (
  name: string,
  label: string,
  options?: Omit<TextField, "name" | "label" | "type">
): TextField => ({
  name,
  label,
  type: "text",
  ...options,
});

export const createEmailField = (
  name: string,
  label: string,
  options?: Omit<TextField, "name" | "label" | "type">
): TextField => ({
  name,
  label,
  type: "email",
  validation: { pattern: emailPattern, ...options?.validation },
  ...options,
});

export const createNumberField = (
  name: string,
  label: string,
  options?: Omit<NumberField, "name" | "label" | "type">
): NumberField => ({
  name,
  label,
  type: "number",
  ...options,
});

export const createTextAreaField = (
  name: string,
  label: string,
  rows: number = 3,
  options?: Omit<TextAreaField, "name" | "label" | "type" | "rows">
): TextAreaField => ({
  name,
  label,
  type: "textarea",
  rows,
  ...options,
});

export const createSelectField = (
  name: string,
  label: string,
  options: SelectOption[],
  fieldOptions?: Omit<SelectField, "name" | "label" | "type" | "options">
): SelectField => ({
  name,
  label,
  type: "select",
  options,
  ...fieldOptions,
});

export const createCheckboxField = (
  name: string,
  label: string,
  options?: Omit<CheckboxField, "name" | "label" | "type">
): CheckboxField => ({
  name,
  label,
  type: "checkbox",
  ...options,
});

export const createAddressFields = (): FormField[] => [
  createTextField("addresses.0.street", "Street Address", {
    required: true,
    validation: { required: "Street address is required" },
  }),
  createTextField("addresses.0.street2", "Street Address 2", {
    placeholder: "Apartment, suite, etc.",
  }),
  createTextField("addresses.0.city", "City", {
    required: true,
    validation: { required: "City is required" },
  }),
  createTextField("addresses.0.state", "State/Province", {
    required: true,
    validation: { required: "State/Province is required" },
  }),
  createTextField("addresses.0.country", "Country", {
    required: true,
    validation: { required: "Country is required" },
  }),
  createTextField("addresses.0.postalCode", "Postal Code", {
    required: true,
    validation: { required: "Postal code is required" },
  }),
  createTextField("addresses.0.region", "Region"),
  createTextField("addresses.0.district", "District"),
  createSelectField("addresses.0.addressType", "Address Type", [
    { value: "Home", label: "Home" },
    { value: "Work", label: "Work" },
    { value: "Office", label: "Office" },
    { value: "Main", label: "Main" },
    { value: "Billing", label: "Billing" },
    { value: "Shipping", label: "Shipping" },
  ]),
  createCheckboxField("addresses.0.isDefault", "Default Address"),
  createTextAreaField("addresses.0.notes", "Address Notes", 2),
];

export const createContactDetailsFields = (): FormField[] => [
  createTextField("contactDetails.0.primaryPhone", "Primary Phone", {
    placeholder: "+1 (555) 123-4567",
  }),
  createTextField("contactDetails.0.secondaryPhone", "Secondary Phone", {
    placeholder: "+1 (555) 123-4567",
  }),
  createTextField("contactDetails.0.mobile", "Mobile Phone", {
    placeholder: "+1 (555) 123-4567",
  }),
  createTextField("contactDetails.0.fax", "Fax", {
    placeholder: "+1 (555) 123-4567",
  }),
  createEmailField("contactDetails.0.email", "Contact Email"),
  createEmailField("contactDetails.0.secondaryEmail", "Secondary Email"),
  createTextField("contactDetails.0.website", "Website", {
    placeholder: "https://example.com",
  }),
  createTextField("contactDetails.0.linkedInProfile", "LinkedIn Profile", {
    placeholder: "https://linkedin.com/in/username",
  }),
  createTextField("contactDetails.0.twitterProfile", "Twitter Profile", {
    placeholder: "https://twitter.com/username",
  }),
  createTextField("contactDetails.0.facebookProfile", "Facebook Profile", {
    placeholder: "https://facebook.com/username",
  }),
  createTextField("contactDetails.0.instagramProfile", "Instagram Profile", {
    placeholder: "https://instagram.com/username",
  }),
  createTextField("contactDetails.0.whatsAppNumber", "WhatsApp Number", {
    placeholder: "+1 (555) 123-4567",
  }),
  createTextField("contactDetails.0.telegramHandle", "Telegram Handle", {
    placeholder: "@username",
  }),
  createSelectField("contactDetails.0.contactType", "Contact Type", [
    { value: "Personal", label: "Personal" },
    { value: "Business", label: "Business" },
    { value: "Work", label: "Work" },
    { value: "Emergency", label: "Emergency" },
  ]),
  createCheckboxField("contactDetails.0.isDefault", "Default Contact"),
];
