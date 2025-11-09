import { ReactNode } from 'react';

type Variant = 'outline' | 'secondary' | 'destructive';

interface BadgeProps {
	children: ReactNode;
	variant?: Variant;
	className?: string;
}

export function Badge({ children, variant = 'outline', className = '' }: BadgeProps) {
	const variants: Record<Variant, string> = {
		outline: 'border rounded px-2 py-0.5 text-xs',
		secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)] rounded px-2 py-0.5 text-xs',
		destructive: 'bg-destructive text-white rounded px-2 py-0.5 text-xs'
	};
	return <span className={`${variants[variant] || variants.outline} ${className}`}>{children}</span>;
}
