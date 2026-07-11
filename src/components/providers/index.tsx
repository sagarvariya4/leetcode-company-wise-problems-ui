import { ReactNode } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CookieStoreProvider } from '@/components/providers/cookie-store-provider';
import { Dialogs } from '@/components/providers/dialogs';
import { NuqsURLParamStoreProvider } from '@/components/providers/nuqs-url-param-store-provider';
import { ThemeModeProvider } from '@/components/providers/theme-mode-provider';
import { ThemePresetProvider } from '@/components/providers/theme-preset-provider';

export function Provider({ children }: { children: ReactNode }) {
	return (
		<NuqsURLParamStoreProvider>
			<CookieStoreProvider>
				<ThemePresetProvider>
					<ThemeModeProvider>
						<TooltipProvider>
							{children}
							<Toaster />
							<Dialogs />
						</TooltipProvider>
					</ThemeModeProvider>
				</ThemePresetProvider>
			</CookieStoreProvider>
		</NuqsURLParamStoreProvider>
	);
}
