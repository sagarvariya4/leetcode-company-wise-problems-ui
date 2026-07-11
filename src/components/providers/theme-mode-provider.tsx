'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { DEFAULT_VAL, THEME_MODES } from '@/lib/theme/types';

export function ThemeModeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return (
		<NextThemesProvider
			attribute="class"
			enableSystem
			disableTransitionOnChange
			enableColorScheme
			themes={[...THEME_MODES]}
			defaultTheme={DEFAULT_VAL}
			{...props}
		>
			{children}
		</NextThemesProvider>
	);
}
