import React, { useState, Children, isValidElement, cloneElement, ReactNode } from 'react';

type TabsProps = {
	defaultValue: string;
	children: ReactNode;
	className?: string;
	onValueChange?: (value: string) => void;
};

export function Tabs({ defaultValue, children, className = '', onValueChange }: TabsProps) {
	const [value, setValue] = useState(defaultValue);
	const setAndNotify = (v: string) => {
		setValue(v);
		if (onValueChange) onValueChange(v);
	};
	const items = Children.toArray(children).map((child) => {
		if (!isValidElement(child)) return null;
		if ((child.type as any)?.displayName === 'TabsList') {
			return cloneElement(child, { activeValue: value, setValue: setAndNotify });
		}
		if ((child.type as any)?.displayName === 'TabsContent') {
			// @ts-ignore value exists on props for TabsContent
			return (child.props.value === value) ? child : null;
		}
		return null;
	});
	return <div className={className}>{items}</div>;
}

type TabsListProps = {
	children: ReactNode;
	activeValue: string;
	setValue: (v: string) => void;
	className?: string;
};

export function TabsList({ children, activeValue, setValue, className = '' }: TabsListProps) {
	const items = Children.toArray(children).map((child) => {
		if (!isValidElement(child)) return child as any;
		if ((child.type as any)?.displayName === 'TabsTrigger') {
			return cloneElement(child, { activeValue, setValue });
		}
		return child;
	});
	return <div className={`flex gap-2 ${className}`}>{items}</div>;
}
TabsList.displayName = 'TabsList';

type TabsTriggerProps = {
	value: string;
	activeValue?: string;
	setValue?: (v: string) => void;
	children: ReactNode;
	className?: string;
};

export function TabsTrigger({ value, activeValue, setValue, children, className = '' }: TabsTriggerProps) {
	const active = activeValue === value;
	return (
		<button
			onClick={() => setValue && setValue(value)}
			className={`px-3 py-2 rounded border w-full ${active ? 'bg-[var(--secondary)]' : 'bg-[var(--card)]'} ${className}`}
		>
			{children}
		</button>
	);
}
TabsTrigger.displayName = 'TabsTrigger';

type TabsContentProps = {
	children: ReactNode;
	value: string;
	className?: string;
};

export function TabsContent({ children, value, className = '' }: TabsContentProps) {
	return <div className={className}>{children}</div>;
}
TabsContent.displayName = 'TabsContent';
