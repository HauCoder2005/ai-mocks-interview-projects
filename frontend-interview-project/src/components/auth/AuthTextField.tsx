import type { InputHTMLAttributes, ReactNode } from "react";

import styles from "./Auth.module.css";

type AuthTextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: ReactNode;
  error?: string;
};

/**
 * Renders a spacious authentication input with an embedded leading icon.
 *
 * @param props - Input attributes and authentication field metadata.
 * @param props.label - Visible label associated with the input element.
 * @param props.icon - Decorative leading icon rendered inside the input shell.
 * @param props.error - Optional validation message displayed below the field.
 * @returns A labeled authentication input field with optional error feedback.
 */
export default function AuthTextField({
  label,
  icon,
  error,
  id,
  name,
  ...inputProps
}: AuthTextFieldProps) {
  const inputId = id ?? name;

  return (
    <div className={styles.fieldGroup}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputShell}>
        {icon}
        <input
          {...inputProps}
          id={inputId}
          name={name}
          className={styles.input}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      </div>
      {error ? (
        <p id={`${inputId}-error`} className={styles.fieldError}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
