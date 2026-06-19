export type CvFileValidationResult = {
  isValid: boolean;
  error?: string;
};

const MAX_CV_FILE_SIZE_IN_BYTES = 5 * 1024 * 1024;
const ALLOWED_CV_EXTENSIONS = [".pdf", ".doc", ".docx"];

export const isValidEmail = (email: string): boolean => {
  const trimmedEmail = email.trim();

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const isValidCvFile = (file: File): CvFileValidationResult => {
  const fileName = file.name.toLowerCase();
  const hasAllowedExtension = ALLOWED_CV_EXTENSIONS.some((extension) =>
    fileName.endsWith(extension),
  );

  if (!hasAllowedExtension) {
    return {
      isValid: false,
      error: "File CV phải có định dạng .pdf, .doc hoặc .docx.",
    };
  }

  if (file.size >= MAX_CV_FILE_SIZE_IN_BYTES) {
    return {
      isValid: false,
      error: "Dung lượng file CV phải nhỏ hơn 5MB.",
    };
  }

  return {
    isValid: true,
  };
};
