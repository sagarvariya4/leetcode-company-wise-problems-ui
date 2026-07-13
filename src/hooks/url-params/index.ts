import {
	Options,
	parseAsBoolean,
	parseAsJson,
	parseAsString,
	useQueryState,
} from 'nuqs';
import { z } from 'zod';

export const URL_PARAM_KEYS = {
	DIALOG: {
		NAME: 'dpn',
	},
	FILTER: {
		TABLE: 'ftbl',
	},
};

export function useBooleanQueryState(
	key: string,
	val: boolean,
	options: Options = {},
) {
	const [value, setValue] = useQueryState(
		key,
		parseAsBoolean.withDefault(val).withOptions(options),
	);

	const reset = () => setValue(val);
	const toggle = () => setValue((v) => !v);

	return {
		value,
		setValue,
		reset,
		toggle,
	};
}

export function useStringQueryState<T extends string>(
	key: string,
	val: T,
	options: Options = {},
) {
	const [value, setValue] = useQueryState(
		key,
		parseAsString.withDefault(val).withOptions(options),
	);

	const reset = () => setValue(val);
	const clear = () => setValue(null);

	return {
		value: value as T,
		setValue: setValue as (
			value: T | ((old: T) => T | null) | null,
			options?: Options | undefined,
		) => Promise<URLSearchParams>,
		reset,
		clear,
	};
}

export function useObjectQueryState<
	TSchema extends z.ZodTypeAny,
	TValue extends NonNullable<z.output<TSchema>>,
>(key: string, schema: TSchema, val: TValue, options: Options = {}) {
	const [value, setValue] = useQueryState(
		key,

		parseAsJson((value) => {
			const { success, data } = schema.safeParse(value);
			return success ? data : null;
		})
			.withDefault(val)
			.withOptions(options),
	);

	const reset = () => setValue(val);
	const clear = () => setValue(null);

	return {
		value,
		setValue,
		reset,
		clear,
	};
}
