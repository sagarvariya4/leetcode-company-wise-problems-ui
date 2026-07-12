'use client';

import { useEffect, useMemo } from 'react';
import {
	decodePreset,
	DEFAULT_PRESET_CONFIG,
	encodePreset,
	isValidPreset,
	type PresetConfig,
} from 'shadcn/preset';

import { COOKIE_KEYS, useStringCookieState } from '.';

const DEFAULT_VAL = 'b7PaZO816h';

export function useThemePreset() {
	const { value, setValue, reset } = useStringCookieState<string>(
		COOKIE_KEYS.THEME.PRESET,
		DEFAULT_VAL,
	);

	const config: PresetConfig = value
		? decodePreset(value) || DEFAULT_PRESET_CONFIG
		: DEFAULT_PRESET_CONFIG;

	const setPresetConfig = (updates: Partial<PresetConfig>) => {
		const newConfig = { ...config, ...updates };
		const newCode = encodePreset(newConfig);

		setValue(newCode);
	};

	const isValid = useMemo(() => isValidPreset(value), [value]);

	useEffect(() => {
		if (value && !isValid) {
			reset();
		}
	}, [value, isValid, reset]);

	return {
		presetConfig: config,
		setPresetConfig,
		presetCode: isValid ? value : DEFAULT_VAL,
		setPresetCode: setValue,
	};
}
