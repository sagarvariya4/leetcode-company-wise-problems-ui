import '@/styles/globals.css';
import '@/styles/themes.css';
import '@/styles/radius.css';
import '@/styles/menu.css';
import '@/styles/fonts.css';

// TODO: Add all styles
// INFO: Need to add all components in all styles and their style css
// shadcn/ui repo path: apps/v4/styles/radix-luma/ui/accordion.tsx
// shadcn/ui repo path: apps/v4/registry/styles/style-lyra.css
// import '@/styles/style-luma.css';
// import '@/styles/style-lyra.css';
// import '@/styles/style-maia.css';
// import '@/styles/style-mira.css';
// import '@/styles/style-nova.css';
// import '@/styles/style-rhea.css';
// import '@/styles/style-sera.css';
// import '@/styles/style-vega.css';

import { ReactNode } from 'react';
import type { Metadata } from 'next';

import { Provider } from '@/components/providers';

export const metadata: Metadata = {
	title: 'Leetcode company wise problems ui',
	// description: 'leetcode-company-wise-problems-ui',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
		>
			<body className="font-sans antialiased">
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
