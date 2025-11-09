import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'default' | 'secondary' | 'outline' | 'destructive';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: Variant;
	className?: string;
}

export function Button({ children, onClick, disabled, variant = 'default', className = '', ...rest }: ButtonProps) {
	const styles: Record<Variant, string> = {
		default: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90',
		secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:opacity-90',
		outline: 'border hover:bg-[var(--muted)]',
		destructive: 'bg-destructive text-white hover:opacity-90'
	};
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`px-3 py-2 rounded ${styles[variant] || styles.default} disabled:opacity-50 ${className}`}
			{...rest}
		>
			{children}
		</button>
	);
}
