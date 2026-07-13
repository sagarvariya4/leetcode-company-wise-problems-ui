'use client';

import { FormEvent, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { DrawerRootChangeEventDetails } from '@base-ui/react/drawer';

import { DialogName } from '@/lib/dialog/types';
import { parsePresetInput } from '@/lib/theme/parse-preset-input';
import { cn } from '@/lib/utils';
import { useThemePreset } from '@/hooks/cookies/use-theme-preset';
import { useDialogName } from '@/hooks/url-params/use-dialog-name';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button, buttonVariants } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group';
import { ButtonCopy } from '@/components/custom/button-copy';

const TITLE = 'Preset';
const DESCRIPTION = 'Paste a preset code to load a saved configuration.';
const PRESET_EXAMPLE = 'b2D0wqNxT';
const PRESET_FORMAT = `${PRESET_EXAMPLE} or --preset ${PRESET_EXAMPLE}`;
const DIALOG_NAME: DialogName = 'preset';

export function PresetDialog({
	className,
	TriggerButton,
}: {
	className?: string;
	TriggerButton?: typeof Button;
}) {
	const isMobile = useIsMobile();
	const { dialogName, setDialogName, clearDialogName } = useDialogName();
	const { presetCode, setPresetCode } = useThemePreset();
	const [input, setInput] = useState(presetCode);

	const nextPreset = useMemo(() => parsePresetInput(input), [input]);
	const isInvalid = input.trim().length > 0 && nextPreset === null;

	const open = useMemo(() => dialogName === DIALOG_NAME, [dialogName]);

	const onOpenChange = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
		(open: boolean, eventDetails?: DrawerRootChangeEventDetails) => {
			if (open) {
				setDialogName(DIALOG_NAME);
			} else {
				clearDialogName();
			}
		},
		[clearDialogName, setDialogName],
	);

	const handleSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			if (!nextPreset) {
				return;
			}

			setPresetCode(nextPreset);
			setInput(nextPreset);
			onOpenChange(false);
		},
		[nextPreset, setPresetCode, onOpenChange],
	);

	const fields = (
		<Field data-invalid={isInvalid || undefined}>
			<FieldLabel
				htmlFor="preset-code"
				className="sr-only"
			>
				Preset code
			</FieldLabel>
			<InputGroup className="h-auto">
				<InputGroupInput
					id="preset-code"
					value={input}
					onChange={(event) => setInput(event.target.value)}
					placeholder={PRESET_FORMAT}
					autoCapitalize="none"
					autoCorrect="off"
					spellCheck={false}
					aria-invalid={isInvalid}
					className="h-10 md:h-8"
				/>
				<InputGroupAddon align="inline-end">
					<ButtonCopy
						text={presetCode}
						onClick={(e) => e.preventDefault()}
					/>
				</InputGroupAddon>
			</InputGroup>
			<FieldDescription>
				Need a preset code? Generate and customize one on{}
				<Link
					target="_blank"
					href={`https://ui.shadcn.com/create?preset=${presetCode}`}
					className="pl-2 font-medium"
				>
					Shadcn/ui Create
				</Link>
			</FieldDescription>
		</Field>
	);

	if (isMobile) {
		return (
			<Drawer
				open={open}
				onOpenChange={onOpenChange}
			>
				{TriggerButton && (
					<DrawerTrigger>
						<TriggerButton />
					</DrawerTrigger>
				)}
				<DrawerContent className={cn(className)}>
					<DrawerHeader>
						<DrawerTitle className="text-xl">{TITLE}</DrawerTitle>
						<DrawerDescription>{DESCRIPTION}</DrawerDescription>
					</DrawerHeader>
					<form onSubmit={handleSubmit}>
						<div className="px-4 py-2">{fields}</div>
						<DrawerFooter>
							<Button
								type="submit"
								disabled={!nextPreset}
							>
								Save
							</Button>
							<DrawerClose
								type="button"
								className={cn('', buttonVariants({ variant: 'outline' }))}
							>
								Cancel
							</DrawerClose>
						</DrawerFooter>
					</form>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			{TriggerButton && (
				<DialogTrigger>
					<TriggerButton />
				</DialogTrigger>
			)}
			<DialogContent className={cn(className)}>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{TITLE}</DialogTitle>
						<DialogDescription>{DESCRIPTION}</DialogDescription>
					</DialogHeader>
					<div className="py-4">{fields}</div>
					<DialogFooter>
						<DialogClose
							type="button"
							className={cn('', buttonVariants({ variant: 'outline' }))}
						>
							Cancel
						</DialogClose>
						<Button
							type="submit"
							disabled={!nextPreset}
						>
							Save
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
