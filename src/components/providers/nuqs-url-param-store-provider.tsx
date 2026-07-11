'use client';

import { ReactNode, Suspense } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export function NuqsURLParamStoreProvider({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<Suspense>
			<NuqsAdapter>{children}</NuqsAdapter>
		</Suspense>
	);
}
