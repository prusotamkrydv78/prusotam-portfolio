import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase',
  {
    variants: {
      variant: {
        default: 'bg-[#111111] text-[rgba(248,245,240,0.65)] px-2 py-0.5',
        accent:  'bg-transparent text-[#FF4D00] border border-[rgba(255,77,0,0.3)] px-2 py-0.5',
        outline: 'bg-transparent text-[rgba(248,245,240,0.4)] border border-[rgba(248,245,240,0.12)] px-2 py-0.5',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className = '', variant, ...props }: BadgeProps) {
  return <span className={badgeVariants({ variant, className })} {...props} />
}
