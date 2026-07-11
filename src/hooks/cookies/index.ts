'use client';

import { useMemo } from 'react';
import { z } from 'zod';

import { useCookieStore } from '@/components/providers/cookie-store-provider';

export const COOKIE_KEYS = {
	THEME: {
		PRESET: 'preset',
	},
};

type Updater<T> = T | null | ((prev: T) => T | null);

export function useBooleanCookieState(key: string, initial: boolean) {
	const store = useCookieStore();

	const getCurrentValue = () => {
		const cookie = store.cookies[key];
		return cookie === null ? initial : cookie === 'true';
	};

	const value = useMemo(
		() => getCurrentValue(),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[store, key, initial],
	);

	const setValue = (value: boolean | ((prev: boolean) => boolean)) => {
		const current = getCurrentValue();

		const next = typeof value === 'function' ? value(current) : value;

		store.set(key, String(next));
	};

	return {
		value,
		setValue,
		reset: () => store.set(key, String(initial)),
		toggle: () => setValue((prev) => !prev),
	};
}

export function useStringCookieState<T extends string>(
	key: string,
	initial: T,
) {
	const store = useCookieStore();

	const getCurrentValue = () => (store.cookies[key] ?? initial) as T;

	const value = useMemo(
		() => getCurrentValue(),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[store, key, initial],
	);

	const setValue = (value: Updater<T>) => {
		const current = getCurrentValue();

		const next = typeof value === 'function' ? value(current) : value;

		if (next === null) {
			store.set(key, null);
			return;
		}

		store.set(key, next);
	};

	return {
		value,
		setValue,
		reset: () => store.set(key, initial),
		clear: () => store.set(key, null),
	};
}

export function useObjectCookieState<TSchema extends z.ZodTypeAny>(
	key: string,
	schema: TSchema,
	initial: z.output<TSchema>,
) {
	const store = useCookieStore();

	const getCurrentValue = (): z.output<TSchema> => {
		const cookie = store.cookies[key];

		if (!cookie) return initial;

		try {
			const parsed = JSON.parse(cookie);
			const result = schema.safeParse(parsed);

			return result.success ? result.data : initial;
		} catch {
			return initial;
		}
	};

	const value = useMemo(
		() => getCurrentValue(),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[store, key, schema, initial],
	);

	const setValue = (value: Updater<z.output<TSchema>>) => {
		const current = getCurrentValue();

		const next =
			typeof value === 'function'
				? (value as (prev: z.output<TSchema>) => z.output<TSchema> | null)(
						current,
					)
				: value;

		if (next === null) {
			store.set(key, null);
			return;
		}

		store.set(key, JSON.stringify(next));
	};

	return {
		value,
		setValue,
		reset: () => store.set(key, JSON.stringify(initial)),
		clear: () => store.set(key, null),
	};
}
