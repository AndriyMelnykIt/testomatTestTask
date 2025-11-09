import { LabelHTMLAttributes, ReactNode } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
	children: ReactNode;
	className?: string;
}

export function Label({ htmlFor, children, className = '', ...rest }: LabelProps) {
	return (
		<label htmlFor={htmlFor} className={`block text-sm font-medium ${className}`} {...rest}>
			{children}
		</label>
	);
}
