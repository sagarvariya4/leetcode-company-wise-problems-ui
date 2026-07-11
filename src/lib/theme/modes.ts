import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { LaptopIcon, LucideProps, MoonIcon, SunIcon } from 'lucide-react';

import { ThemeMode } from '@/lib/theme/types';

export type Mode = {
	label: string;
	value: ThemeMode;
	icon: ForwardRefExoticComponent<
		Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
	>;
	description: string;
	disabled?: boolean;
	hidden?: boolean;
};

export const ThemeModes: Mode[] = [
	{
		label: 'Light',
		value: 'light',
		icon: SunIcon,
		description: 'Light Theme',
	},
	{
		label: 'Dark',
		value: 'dark',
		icon: MoonIcon,
		description: 'Dark Theme',
	},
	{
		label: 'System',
		value: 'system',
		icon: LaptopIcon,
		description: 'System Theme',
	},
];
