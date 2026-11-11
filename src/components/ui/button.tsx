import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Hub CTA treatment: Midnight pill with white text, inverted on hover.
// Keep an outline on dark surfaces and on white hover states.
const brandButtonColors =
  "border border-og-midnight bg-og-midnight text-white hover:bg-white hover:text-og-midnight dark:border-white/60 dark:hover:border-white";
// Secondary actions next to a filled one: the same pill, outlined, filling on hover.
const outlineButtonColors =
  "border border-og-midnight bg-white text-og-midnight hover:bg-og-midnight hover:text-white dark:border-white/40 dark:bg-transparent dark:text-white dark:hover:border-white dark:hover:bg-white/10 dark:hover:text-white";

/**
 * Two sizes only. `default` (40px) is the one main action on a surface; `sm` (32px)
 * is for repeated or in-card controls: copy, filters, row actions. `lg` is kept as an
 * alias of `default` so older calls still compile.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: brandButtonColors,
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: outlineButtonColors,
        secondary: brandButtonColors,
        // The main action on a Midnight surface: white pill, inverting to Midnight on hover.
        inverse: "border border-white bg-white text-og-midnight hover:bg-og-midnight hover:text-white",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-foreground underline underline-offset-4 hover:decoration-2",
      },
      size: {
        default: "h-10 px-5",
        sm: "tap-target h-8 gap-1.5 px-3 text-[13px] [&_svg]:size-3.5",
        lg: "h-10 px-5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
