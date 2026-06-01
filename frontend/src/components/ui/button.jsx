import React from "react";

const variants = {
  default:
    "bg-primary text-primary-foreground btn-3d btn-3d-primary hover:bg-primary-dark active:bg-primary-dark",
  secondary:
    "bg-secondary text-secondary-foreground btn-3d hover:bg-secondary/80",
  destructive:
    "bg-destructive text-destructive-foreground btn-3d btn-3d-destructive hover:bg-destructive/90",
  outline:
    "border-2 border-primary/30 bg-background text-foreground btn-3d btn-3d-outline hover:bg-accent hover:text-accent-foreground hover:border-primary/50",
  ghost:
    "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  success:
    "bg-success text-success-foreground btn-3d btn-3d-success hover:bg-success/90",
};

const sizes = {
  default: "h-10 px-5 py-2 text-sm",
  sm: "h-8 rounded-lg px-3 text-xs",
  lg: "h-12 rounded-xl px-8 text-base",
  icon: "h-9 w-9",
};

export const Button = React.forwardRef(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      asChild = false,
      disabled = false,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? React.Fragment : "button";
    const base =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none";

    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
        {...props}
      >
        {loading && (
          <span className="relative flex h-4 w-4 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-white/40" />
            <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          </span>
        )}
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";
