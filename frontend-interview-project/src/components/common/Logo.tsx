import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

type LogoProps = {
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Renders the reusable product logo linked to the home page.
 *
 * @param props - Logo rendering options.
 * @param props.width - Intrinsic image width used by Next.js image optimization.
 * @param props.height - Intrinsic image height used by Next.js image optimization.
 * @param props.className - Optional class name for layout-specific styling.
 * @param props.style - Optional inline style for contexts that still use inline layout styling.
 * @returns A home link containing the Codeser Interview logo image.
 */
export default function Logo({
  width = 150,
  height = 44,
  className,
  style,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={className}
      style={style}
      aria-label="Codeser Interview"
    >
      <Image
        src="/logo.png"
        alt="Codeser Logo"
        width={width}
        height={height}
        priority
        style={{
          width,
          height,
          objectFit: "contain",
          display: "block",
        }}
      />
    </Link>
  );
}
