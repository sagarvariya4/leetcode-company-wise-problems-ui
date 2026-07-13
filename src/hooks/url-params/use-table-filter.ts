'use client';

import { useCallback } from 'react';
import { z } from 'zod';

import { URL_PARAM_KEYS, useObjectQueryState } from '.';

const tableFilterSchema = z.object({
	company: z.string().default('Amazon'),
	day: z.string().default('All'),

	// days: z.array(z.string()).default([]),
	// role: z.array(z.string()).default([]),
	// sort: z
	// 	.object({
	// 		id: z.string(),
	// 		desc: z.boolean(),
	// 	})
	// 	.nullable()
	// 	.default(null),
	// page: z.number().min(1).default(1),
	// pageSize: z.number().min(1).default(20),
});

export type TableFilter = z.output<typeof tableFilterSchema>;

const DEFAULT_FILTER = tableFilterSchema.parse({});

export function useTableFilter() {
	const { value, setValue, clear, reset } = useObjectQueryState(
		URL_PARAM_KEYS.FILTER.TABLE,
		tableFilterSchema,
		DEFAULT_FILTER,
	);

	const setFilter = useCallback(
		<K extends keyof TableFilter>(key: K, val: TableFilter[K]) => {
			setValue({
				...value,
				[key]: val,
			});
		},
		[value, setValue],
	);

	const removeFilter = useCallback(
		<K extends keyof TableFilter>(key: K) => {
			setValue({
				...value,
				[key]: DEFAULT_FILTER[key],
			});
		},
		[value, setValue],
	);

	return {
		filter: value,
		DEFAULT_FILTER,

		setFilter,
		removeFilter,

		resetFilters: reset,
		clearFilters: clear,
	};
}
