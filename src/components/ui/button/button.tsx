import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { cn } from "@qwik-ui/utils";
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded text-sm font-medium transition-all duration-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      look: {
        primary: "bg-primary text-primary-foreground shadow-lg hover:shadow-xl border-2 hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90",
        alert: "bg-alert text-alert-foreground shadow-sm hover:bg-alert/90",
        outline: "border bg-background-light text-foreground-light hover:bg-primary/10",
        ghost: "text-primary hover:bg-primary/10",
        link: "text-primary hover:text-primary/80 underline",
      },
      size: {
        sm: "h-8 px-2 py-1.5 text-sm",
        md: "h-12 px-4 py-3 text-base",
        lg: " h-16 px-8 py-4 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      look: "primary",
      size: "md",
    },
  },
);

type ButtonProps = PropsOf<"button"> & VariantProps<typeof buttonVariants>;

export const Button = component$<ButtonProps>(({ size, look, ...props }) => {
  return (
    <button {...props} class={cn(buttonVariants({ size, look }), props.class)}>
      <Slot />
    </button>
  );
});
