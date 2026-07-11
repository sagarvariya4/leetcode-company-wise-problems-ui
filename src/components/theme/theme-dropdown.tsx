import { createElement, useState } from 'react';
import { PaletteIcon, SunMoonIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { ThemeModes } from '@/lib/theme/modes';
import { cn } from '@/lib/utils';
import { useDialogName } from '@/hooks/url-params/use-dialog-name';
import { buttonVariants } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeDropdown() {
	const { theme, setTheme } = useTheme();
	const { setDialogName } = useDialogName();

	const [open, setOpen] = useState(false);

	return (
		<DropdownMenu
			open={open}
			onOpenChange={setOpen}
		>
			<DropdownMenuTrigger
				className={cn(
					buttonVariants({
						variant: 'ghost',
						size: 'icon',
					}),
				)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="size-4.5"
				>
					<path
						stroke="none"
						d="M0 0h24v24H0z"
						fill="none"
					/>
					<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
					<path d="M12 3l0 18" />
					<path d="M12 9l4.65 -4.65" />
					<path d="M12 14.3l7.37 -7.37" />
					<path d="M12 19.6l8.85 -8.85" />
				</svg>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-full"
				align="end"
			>
				<DropdownMenuGroup>
					<DropdownMenuLabel>Appearance</DropdownMenuLabel>
					{/* THEME MODES */}
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<SunMoonIcon />
							Theme
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuGroup>
									<DropdownMenuLabel>Modes</DropdownMenuLabel>
									<DropdownMenuRadioGroup
										value={theme}
										onValueChange={setTheme}
									>
										{ThemeModes.filter(({ hidden }) => !hidden).map(
											({ icon, label, value, disabled }, index) => {
												return (
													<DropdownMenuRadioItem
														key={`theme-mode-${index}`}
														value={value}
														disabled={disabled}
													>
														{createElement(icon)}
														{label}
													</DropdownMenuRadioItem>
												);
											},
										)}
									</DropdownMenuRadioGroup>
								</DropdownMenuGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					{/* THEME PRESET */}
					<DropdownMenuItem onClick={() => setDialogName('preset')}>
						<PaletteIcon />
						Open Preset
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
