import { VALIDATION_MESSAGES, FILE_CONFIG } from "../config/constants";

/**
 * Email validation regex
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password validation regex (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
 */
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

/**
 * Validate email address
 */
export function validateEmail(email: string): {
  isValid: boolean;
  message?: string;
} {
  if (!email) {
    return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, message: VALIDATION_MESSAGES.EMAIL_INVALID };
  }

  return { isValid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  message?: string;
} {
  if (!password) {
    return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED };
  }

  if (password.length < 8) {
    return { isValid: false, message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH };
  }

  if (!PASSWORD_REGEX.test(password)) {
    return { isValid: false, message: VALIDATION_MESSAGES.PASSWORD_WEAK };
  }

  return { isValid: true };
}

/**
 * Validate password confirmation
 */
export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): { isValid: boolean; message?: string } {
  if (!confirmPassword) {
    return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: VALIDATION_MESSAGES.CONFIRM_PASSWORD_MISMATCH,
    };
  }

  return { isValid: true };
}

/**
 * Format file size in bytes to human readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Validate file size
 */
export function validateFileSize(file: File): {
  isValid: boolean;
  message?: string;
} {
  if (file.size > FILE_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      message: `${VALIDATION_MESSAGES.FILE_TOO_LARGE} (${formatFileSize(
        FILE_CONFIG.MAX_FILE_SIZE
      )})`,
    };
  }

  return { isValid: true };
}

/**
 * Validate file type
 */
export function validateFileType(
  file: File,
  allowedTypes: readonly string[]
): { isValid: boolean; message?: string } {
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: `${
        VALIDATION_MESSAGES.FILE_TYPE_NOT_ALLOWED
      }. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  return { isValid: true };
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): {
  isValid: boolean;
  message?: string;
} {
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  return validateFileType(file, FILE_CONFIG.ALLOWED_IMAGE_TYPES);
}

/**
 * Validate document file
 */
export function validateDocumentFile(file: File): {
  isValid: boolean;
  message?: string;
} {
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  return validateFileType(file, FILE_CONFIG.ALLOWED_DOCUMENT_TYPES);
}

/**
 * Validate video file
 */
export function validateVideoFile(file: File): {
  isValid: boolean;
  message?: string;
} {
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  return validateFileType(file, FILE_CONFIG.ALLOWED_VIDEO_TYPES);
}

/**
 * Validate audio file
 */
export function validateAudioFile(file: File): {
  isValid: boolean;
  message?: string;
} {
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  return validateFileType(file, FILE_CONFIG.ALLOWED_AUDIO_TYPES);
}

/**
 * Validate required field
 */
export function validateRequired(value: any): {
  isValid: boolean;
  message?: string;
} {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED };
  }

  return { isValid: true };
}

/**
 * Validate minimum length
 */
export function validateMinLength(
  value: string,
  minLength: number
): { isValid: boolean; message?: string } {
  if (value && value.length < minLength) {
    return {
      isValid: false,
      message: `Must be at least ${minLength} characters long`,
    };
  }

  return { isValid: true };
}

/**
 * Validate maximum length
 */
export function validateMaxLength(
  value: string,
  maxLength: number
): { isValid: boolean; message?: string } {
  if (value && value.length > maxLength) {
    return {
      isValid: false,
      message: `Must be no more than ${maxLength} characters long`,
    };
  }

  return { isValid: true };
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): {
  isValid: boolean;
  message?: string;
} {
  if (!url) {
    return { isValid: true }; // Optional field
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, message: "Please enter a valid URL" };
  }
}
