export type ValidationResult = {
  valid: boolean;
  message?: string;
};

export function required(value: string, message = "This field is required"): ValidationResult {
  return value.trim() ? { valid: true } : { valid: false, message };
}
