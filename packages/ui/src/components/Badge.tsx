import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium leading-none transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-border bg-surface-2 text-text-muted',
        axis:
          'border-axis/30 bg-axis/10 text-axis',
        signal:
          'border-signal/30 bg-signal/10 text-signal',
        outline:
          'border-border-strong bg-transparent text-text',
        warn:
          'border-warn/30 bg-warn/10 text-warn',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
