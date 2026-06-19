import type { TransformFnParams } from 'class-transformer';

export const normalizeEmail = ({ value }: TransformFnParams): unknown => {
  const rawValue = value as unknown;

  return typeof rawValue === 'string'
    ? rawValue.trim().toLowerCase()
    : rawValue;
};

export const trimString = ({ value }: TransformFnParams): unknown => {
  const rawValue = value as unknown;

  return typeof rawValue === 'string' ? rawValue.trim() : rawValue;
};
