export const MAX_NAME_LENGTH = 25;
export const PHONE_LENGTH = 11;
export const CNIC_LENGTH = 13;

export const formatName = (value) => value.slice(0, MAX_NAME_LENGTH);

export const formatPhone = (value) => value.replace(/\D/g, "").slice(0, PHONE_LENGTH);

export const formatCnic = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, CNIC_LENGTH);

  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
};

export const isValidPhone = (phone) =>
  formatPhone(phone).length === PHONE_LENGTH;

export const isValidCnic = (cnic) =>
  cnic.replace(/\D/g, "").length === CNIC_LENGTH;

export const isValidName = (name) =>
  name.trim().length > 0 && name.length <= MAX_NAME_LENGTH;