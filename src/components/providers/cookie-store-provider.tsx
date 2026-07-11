'use client';

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from 'react';

type CookieContextValue = {
	cookies: Record<string, string>;
	set(key: string, value: string | null): void;
};

const CookieContext = createContext<CookieContextValue | null>(null);

function parseCookies(): Record<string, string> {
	if (typeof document === 'undefined') return {};

	const cookies: Record<string, string> = {};

	document.cookie.split('; ').forEach((cookie) => {
		if (!cookie) return;

		const [key, ...rest] = cookie.split('=');
		cookies[key] = decodeURIComponent(rest.join('='));
	});

	return cookies;
}

export function CookieStoreProvider({ children }: { children: ReactNode }) {
	const [cookies, setCookies] = useState<Record<string, string>>(() =>
		parseCookies(),
	);

	// const get = useCallback((key: string) => cookies[key] ?? null, [cookies]);

	const set = useCallback((key: string, value: string | null) => {
		if (value === null) {
			document.cookie = `${key}=; Path=/; Max-Age=0; SameSite=Lax`;

			setCookies((prev) => {
				const next = { ...prev };
				delete next[key];
				return next;
			});

			return;
		}

		document.cookie = `${key}=${encodeURIComponent(
			value,
		)}; Path=/; Max-Age=31536000; SameSite=Lax`;

		setCookies((prev) => ({
			...prev,
			[key]: value,
		}));
	}, []);

	const value = useMemo(
		() => ({
			cookies,
			set,
		}),
		[cookies, set],
	);

	return (
		<CookieContext.Provider value={value}>{children}</CookieContext.Provider>
	);
}

export function useCookieStore() {
	const ctx = useContext(CookieContext);

	if (!ctx) {
		throw new Error('useCookieStore must be used inside CookieStoreProvider');
	}

	return ctx;
}
