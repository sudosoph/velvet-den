import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 cursor-pointer shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-zinc-900 text-zinc-50 shadow-2xs hover:bg-zinc-800',
        accent: 'bg-rose-600 text-white shadow-2xs hover:bg-rose-700',
        outline: 'border border-zinc-200 bg-white text-zinc-900 shadow-2xs hover:bg-zinc-50',
        secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200/80',
        ghost: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-lg px-5 text-sm',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-zinc-900 text-zinc-50',
        secondary: 'border-zinc-200/80 bg-zinc-100 text-zinc-700',
        outline: 'border-zinc-200 bg-white text-zinc-700',
        accent: 'border-rose-200 bg-rose-50 text-rose-700',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
      },
    },
    defaultVariants: {
      variant: 'secondary',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge: React.FC<BadgeProps> = ({ className, variant, ...props }) => (
  <span className={cn(badgeVariants({ variant }), className)} {...props} />
);

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-2xs',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';
