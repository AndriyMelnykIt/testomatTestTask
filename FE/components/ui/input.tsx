import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	className?: string;
}

export function Input({ id, value, onChange, placeholder = '', className = '', type = 'text', ...rest }: InputProps) {
	return (
		<input
			id={id}
			type={type}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			className={`w-full border rounded px-3 py-2 bg-[var(--card)] text-[var(--foreground)] ${className}`}
			{...rest}
		/>
	);
}
