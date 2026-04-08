import { cn } from "@/lib/utils";
import Link from "next/link";
import { forwardRef } from "react";

interface ButtonBaseProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  shimmer?: boolean;
  className?: string;
  children?: React.ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", shimmer, children, ...props }, ref) => {
    const showShimmer = shimmer !== undefined ? shimmer : variant === "primary";

    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary:
        "bg-button-primary text-button-text hover:bg-button-primary-hover rounded-lg",
      secondary:
        "bg-bg-secondary text-text-primary hover:bg-bg-accent rounded-lg",
      outline:
        "border-2 border-text-primary text-text-primary hover:bg-text-primary hover:text-white rounded-lg",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const combinedClassName = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      showShimmer && "shimmer-button",
      className
    );

    const inner = showShimmer ? (
      <>
        <span className="relative z-10">{children}</span>
        <span className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 animate-shimmer" />
        </span>
      </>
    ) : (
      children
    );

    if ("href" in props && props.href !== undefined) {
      const { href, ...linkProps } = props as ButtonAsLink;
      const isExternal = href.startsWith("http") || href.startsWith("mailto:");

      if (isExternal) {
        return (
          <a
            href={href}
            className={combinedClassName}
            ref={ref as React.Ref<HTMLAnchorElement>}
            {...linkProps}
          >
            {inner}
          </a>
        );
      }

      return (
        <Link
          href={href}
          className={combinedClassName}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...linkProps}
        >
          {inner}
        </Link>
      );
    }

    const buttonProps = props as ButtonAsButton;
    return (
      <button
        className={combinedClassName}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...buttonProps}
      >
        {inner}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
