import * as React from 'react';
import { cn } from '../lib/cn';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof React.JSX.IntrinsicElements;
  size?: 'default' | 'narrow' | 'prose';
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, as: Tag = 'div', size = 'default', ...props }, ref) => {
    const Component = Tag as React.ElementType;
    return (
      <Component
        ref={ref}
        className={cn(
          'mx-auto w-full px-5 md:px-8',
          size === 'default' && 'max-w-container',
          size === 'narrow' && 'max-w-3xl',
          size === 'prose' && 'max-w-prose',
          className,
        )}
        {...props}
      />
    );
  },
);
Container.displayName = 'Container';
