export const MAX_NAME_LENGTH = 15;
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

export const MIN_PASSWORD_LENGTH = 8;
export const PASSWORD_SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isValidPassword = (password) =>
  password.length >= MIN_PASSWORD_LENGTH &&
  PASSWORD_SPECIAL_CHAR_REGEX.test(password);

export const getPasswordValidationMessage = (password) => {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  if (!PASSWORD_SPECIAL_CHAR_REGEX.test(password)) {
    return "Password must contain at least one special character";
  }
  return "";
};