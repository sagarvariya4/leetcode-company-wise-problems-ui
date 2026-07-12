'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import database from '@/db/database.json';
import { Database, getTitle, Problem } from '@/scripts/helper';
import { ExternalLinkIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { ThemeDropdown } from '@/components/theme/theme-dropdown';

export default function Page() {
	const db = database as unknown as Database;

	const companies = Object.keys(db.companies);
	const [company, setCompany] = useState(companies[0]);

	const days = Object.keys(db.companies[company]);
	const [day, setDay] = useState(days[0] ?? '');

	const rows = useMemo(() => {
		const ids = db.companies[company][day] ?? [];

		return ids?.map((id) => {
			const p = database.problems[id] as Problem;

			return {
				slug: p[0],
				title: getTitle(db, p[0]),
				difficulty: database.metadata.difficulties[p[1]],
				acceptance: p[2],
				tags: p[3]?.map((t) => database.metadata.tags[t]),
			};
		});
	}, [company, day, db]);

	return (
		<div className="space-y-6">
			{/* Sticky Toolbar */}
			<div className="sticky top-0 z-30 border-b backdrop-blur-xl">
				<div className="flex items-center justify-between gap-2 p-3">
					<div className="flex flex-wrap gap-3">
						<div className="min-w-48 flex-1">
							<Select
								value={company}
								onValueChange={(value) => value && setCompany(value)}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Company" />
								</SelectTrigger>

								<SelectContent>
									{companies?.map((c) => (
										<SelectItem
											key={c}
											value={c}
										>
											{c}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="min-w-36 flex-1 sm:w-40 sm:flex-none">
							<Select
								value={day}
								onValueChange={(value) => value && setDay(value)}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Day" />
								</SelectTrigger>

								<SelectContent>
									{days.map((d) => (
										<SelectItem
											key={d}
											value={d}
										>
											{d}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<ThemeDropdown />
				</div>
			</div>

			{/* Table */}
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Difficulty</TableHead>
						<TableHead>Acceptance</TableHead>
						<TableHead>Tags</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{rows?.map((problem) => (
						<TableRow
							key={problem.slug}
							className="h-14"
						>
							<TableCell>
								<div className="flex items-center justify-between gap-4">
									<span className="font-medium">{problem.title}</span>

									<Link
										target="_blank"
										href={`https://leetcode.com/problems/${problem.slug}`}
										className={cn(
											buttonVariants({
												size: 'icon-sm',
												variant: 'ghost',
											}),
										)}
									>
										<ExternalLinkIcon />
									</Link>
								</div>
							</TableCell>

							<TableCell>
								<Badge
									variant={
										problem.difficulty.toLowerCase() as
											'easy' | 'medium' | 'hard'
									}
								>
									{problem.difficulty}
								</Badge>
							</TableCell>

							<TableCell>{problem.acceptance}%</TableCell>

							<TableCell>
								<div className="flex flex-wrap gap-1">
									{problem.tags.map((t) => (
										<Badge
											key={t}
											variant="secondary"
										>
											{t}
										</Badge>
									))}
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
