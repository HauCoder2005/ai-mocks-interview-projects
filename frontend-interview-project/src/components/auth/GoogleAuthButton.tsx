import styles from "./Auth.module.css";

type GoogleAuthButtonProps = {
  children: string;
};

/**
 * Renders the shared Google authentication action button.
 *
 * @param props - Google button content.
 * @param props.children - Vietnamese label displayed beside the Google mark.
 * @returns A full-width social authentication button with an inline Google SVG.
 */
export default function GoogleAuthButton({ children }: GoogleAuthButtonProps) {
  return (
    <button type="button" className={styles.googleButton}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="#4285F4"
          d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.78h5.39a4.61 4.61 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.97-4.34 2.97-7.3Z"
        />
        <path
          fill="#34A853"
          d="M10 20c2.7 0 4.98-.9 6.64-2.46l-3.24-2.5c-.9.6-2.05.96-3.4.96-2.61 0-4.83-1.76-5.62-4.13H1.03v2.58A10 10 0 0 0 10 20Z"
        />
        <path
          fill="#FBBC04"
          d="M4.38 11.87A6 6 0 0 1 4.06 10c0-.65.11-1.28.32-1.87V5.55H1.03a10 10 0 0 0 0 8.9l3.35-2.58Z"
        />
        <path
          fill="#EA4335"
          d="M10 3.97c1.47 0 2.79.5 3.83 1.5l2.88-2.88C14.97.97 12.7 0 10 0a10 10 0 0 0-8.97 5.55l3.35 2.58C5.17 5.76 7.39 3.97 10 3.97Z"
        />
      </svg>
      {children}
    </button>
  );
}
