'use client';

import * as React from 'react';

import { useThemePreset } from '@/hooks/cookies/use-theme-preset';

export function ThemePresetProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { presetConfig } = useThemePreset();

	// Synchronously update the body styles/classes based on the preset
	React.useLayoutEffect(() => {
		const body = document.body;

		// Option A: Using data attributes (e.g. data-theme="zinc")
		// This allows you to write CSS like [data-theme="zinc"] { ... }

		// 1. Core Visuals
		body.setAttribute('data-style', presetConfig.style);
		body.setAttribute('data-base-color', presetConfig.baseColor);
		body.setAttribute('data-theme', presetConfig.theme);

		// 2. Charts & Accents
		// Note: chartColor might be undefined in older presets, so we fall back to theme
		body.setAttribute(
			'data-chart-color',
			presetConfig.chartColor || presetConfig.theme,
		);

		// 3. Icons
		body.setAttribute('data-icon-library', presetConfig.iconLibrary);

		// 4. Typography
		body.setAttribute('data-font', presetConfig.font);
		body.setAttribute('data-font-heading', presetConfig.fontHeading);

		// 5. Borders & Shapes
		body.setAttribute('data-radius', presetConfig.radius);

		// 6. Navigation / Menus
		body.setAttribute('data-menu-accent', presetConfig.menuAccent);
		body.setAttribute('data-menu-color', presetConfig.menuColor);

		// Option B: Using class names (e.g. theme-zinc)
		// You'd need to clear old classes before adding new ones
		// const classNames = [`theme-${activePreset.theme}`, `style-${activePreset.style}`]
		// body.classList.add(...classNames)
	}, [presetConfig]);

	React.useLayoutEffect(() => {
		if (!presetConfig.menuColor) {
			return;
		}

		const isInvertedMenu =
			presetConfig.menuColor === 'inverted' ||
			presetConfig.menuColor === 'inverted-translucent';
		const isTranslucentMenu =
			presetConfig.menuColor === 'default-translucent' ||
			presetConfig.menuColor === 'inverted-translucent';
		let frameId = 0;

		const updateMenuElements = () => {
			const allElements = document.querySelectorAll<HTMLElement>(
				'.cn-menu-target, [data-menu-translucent]',
			);

			if (allElements.length === 0) {
				return;
			}

			// Disable transitions while toggling classes.
			allElements.forEach((element) => {
				element.style.transition = 'none';
			});

			allElements.forEach((element) => {
				if (element.classList.contains('cn-menu-target')) {
					if (isInvertedMenu) {
						element.classList.add('dark');
					} else {
						element.classList.remove('dark');
					}
				}

				// When translucent is enabled, move from data-attr to class so styles apply.
				// When disabled, move back to a data-attr so the element stays queryable
				// for future toggles without losing its identity as a menu element.
				if (isTranslucentMenu) {
					element.classList.add('cn-menu-translucent');
					element.removeAttribute('data-menu-translucent');
				} else if (element.classList.contains('cn-menu-translucent')) {
					element.classList.remove('cn-menu-translucent');
					element.setAttribute('data-menu-translucent', '');
				}
			});

			// Force a reflow, then re-enable transitions.
			void document.body.offsetHeight;
			allElements.forEach((element) => {
				element.style.transition = '';
			});
		};

		const scheduleMenuUpdate = () => {
			if (frameId) {
				return;
			}

			frameId = window.requestAnimationFrame(() => {
				frameId = 0;
				updateMenuElements();
			});
		};

		// Update existing menu elements.
		updateMenuElements();

		// Watch for new menu elements being added to the DOM.
		const observer = new MutationObserver(() => {
			scheduleMenuUpdate();
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		return () => {
			observer.disconnect();
			if (frameId) {
				window.cancelAnimationFrame(frameId);
			}
		};
	}, [presetConfig.menuColor]);

	return <>{children}</>;
}
