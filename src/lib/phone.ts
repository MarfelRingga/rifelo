/**
 * Rifelo Unified Phone Standardization & Normalization Module
 * Enforces canonical database storage format: pure numeric digits with country code (e.g. 628xxxxxxxxxx)
 * Provides auto-detection, validation, and human-friendly display formatting.
 */

/**
 * Normalizes any phone number input into canonical numeric format (e.g. 628xxxxxxxxxx).
 * Handles:
 * - Local prefix with 0: "08123456789" -> "628123456789"
 * - Prefix without 0: "8123456789" -> "628123456789"
 * - International with +: "+62 812-3456-7890" -> "6281234567890"
 * - International raw: "6281234567890" -> "6281234567890"
 * - Formatted symbols (spaces, dashes, parentheses, dots): stripped automatically
 */
export function normalizePhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';

  const trimmed = phone.trim();
  let digits = trimmed.replace(/\D/g, '');

  if (!digits) return '';

  // Indonesian mobile numbers
  if (digits.startsWith('0')) {
    // 0812... -> 62812...
    digits = '62' + digits.substring(1);
  } else if (digits.startsWith('8')) {
    // 812... -> 62812...
    digits = '62' + digits;
  } else if (digits.startsWith('0062')) {
    // 00628... -> 628...
    digits = digits.substring(2);
  }

  return digits;
}

/**
 * Validates whether the given phone string represents a valid mobile number.
 */
export function isValidPhoneNumber(phone: string | null | undefined): boolean {
  if (!phone) return false;
  const normalized = normalizePhoneNumber(phone);
  
  // Indonesian numbers: must start with 628 and have 10 to 14 digits
  if (normalized.startsWith('628')) {
    return normalized.length >= 10 && normalized.length <= 15;
  }

  // General international mobile numbers: 8 to 16 digits
  return normalized.length >= 8 && normalized.length <= 16;
}

/**
 * Formats a canonical or raw phone number for human-friendly, professional UI display.
 * e.g. "6285353889520" -> "+62 853-5388-9520"
 */
export function formatPhoneDisplay(phone: string | null | undefined): string {
  if (!phone) return '';
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return '';

  // Indonesian mobile formatting: +62 8xx-xxxx-xxxx
  if (normalized.startsWith('628')) {
    const rest = normalized.slice(2); // starts with 8...
    if (rest.length <= 9) {
      return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 6)}-${rest.slice(6)}`;
    }
    if (rest.length === 10) {
      return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 6)}-${rest.slice(6)}`;
    }
    if (rest.length === 11) {
      return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
    }
    // 12 or 13 digits
    return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
  }

  // Default international format
  return `+${normalized}`;
}

/**
 * Generates a clean, valid WhatsApp URL direct link.
 * e.g. https://wa.me/6281234567890
 */
export function getWhatsAppUrl(phone: string | null | undefined, text?: string): string {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return '';
  const baseUrl = `https://wa.me/${normalized}`;
  return text ? `${baseUrl}?text=${encodeURIComponent(text)}` : baseUrl;
}

/**
 * Backward compatibility alias for signup/login/reset-password
 */
export function formatIndonesianPhoneNumber(phone: string): string {
  return normalizePhoneNumber(phone);
}
