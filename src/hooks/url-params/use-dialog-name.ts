'use client';

import { useEffect, useMemo } from 'react';

import { DIALOG_NAMES, DialogName } from '@/lib/dialog/types';

import { URL_PARAM_KEYS, useStringQueryState } from '.';

const DEFAULT_VAL: DialogName = '';

export function useDialogName() {
	const { value, setValue, clear, reset } = useStringQueryState<DialogName>(
		URL_PARAM_KEYS.DIALOG.NAME,
		DEFAULT_VAL,
	);

	const isValid = useMemo(() => DIALOG_NAMES.includes(value), [value]);

	useEffect(() => {
		if (value && !isValid) {
			reset();
		}
	}, [value, reset, isValid]);

	return {
		dialogName: isValid ? value : DEFAULT_VAL,
		setDialogName: setValue,
		clearDialogName: clear,
	};
}
