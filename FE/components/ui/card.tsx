import { ReactNode } from 'react';

interface BaseProps {
	className?: string;
	children: ReactNode;
}

export function Card({ className = '', children }: BaseProps) {
	return <div className={`rounded-lg border ${className}`}>{children}</div>;
}

export function CardHeader({ className = '', children }: BaseProps) {
	return <div className={`p-4 border-b ${className}`}>{children}</div>;
}

export function CardTitle({ className = '', children }: BaseProps) {
	return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}

export function CardContent({ className = '', children }: BaseProps) {
	return <div className={`p-4 ${className}`}>{children}</div>;
}
