import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-md text-sm font-medium leading-none',
    'transition-colors duration-fast ease-aq-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'bg-axis text-white hover:bg-axis-hover shadow-sm shadow-axis/20',
        secondary:
          'bg-surface-2 text-text border border-border hover:bg-surface-3 hover:border-border-strong',
        ghost:
          'bg-transparent text-text hover:bg-surface-2',
        outline:
          'bg-transparent text-text border border-border hover:bg-surface-2 hover:border-border-strong',
        link:
          'bg-transparent text-axis underline underline-offset-4 hover:text-axis-hover',
        danger:
          'bg-danger text-white hover:opacity-90',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
