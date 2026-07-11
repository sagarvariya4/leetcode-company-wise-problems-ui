import * as React from 'react';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';

function ButtonCopy({
	text,
	...props
}: React.ComponentProps<typeof Button> & {
	text: string;
}) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(text);
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	return (
		<Button
			size="icon"
			variant="ghost"
			{...props}
			onClick={(e) => {
				props.onClick?.(e);
				handleCopy();
			}}
		>
			{copied ? (
				<Check className="size-4 text-green-500" />
			) : (
				<Copy className="size-4" />
			)}
		</Button>
	);
}

export { ButtonCopy };
