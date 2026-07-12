import fs from 'node:fs/promises';
import path from 'node:path';
import { normalizeTitle, Problem, slugToTitle } from '@/scripts/helper';
import Papa from 'papaparse';

const ROOT = process.cwd();

const INPUT_DIR = path.join(ROOT, 'vendor', 'leetcode-company-wise-problems');

const OUTPUT_DIR = path.join(ROOT, 'src', 'db');

type CSVRow = Record<string, string>;

const difficulties = ['EASY', 'MEDIUM', 'HARD'];

const tags = new Map<string, number>();

const problems: Problem[] = [];
const problemMap = new Map<string, number>();

const companies: Record<string, Record<string, number[]>> = {};

function slugFromUrl(url: string) {
	const match = url.match(/problems\/([^/]+)/);

	if (!match) {
		throw new Error(`Invalid LeetCode url: ${url}`);
	}

	return match[1];
}

function getTagIds(value?: string) {
	if (!value) return [];

	return value
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean)
		.map((tag) => {
			if (!tags.has(tag)) {
				tags.set(tag, tags.size);
			}

			return tags.get(tag)!;
		});
}

async function main() {
	await fs.mkdir(OUTPUT_DIR, {
		recursive: true,
	});

	const companiesDirs = await fs.readdir(INPUT_DIR, {
		withFileTypes: true,
	});

	for (const companyDir of companiesDirs) {
		if (!companyDir.isDirectory()) continue;

		const company = companyDir.name;

		companies[company] = {};

		const folder = path.join(INPUT_DIR, company);

		const files = await fs.readdir(folder);

		for (const file of files) {
			if (!file.endsWith('.csv')) continue;

			const timeframe = file.replace('.csv', '');

			const csv = await fs.readFile(path.join(folder, file), 'utf8');

			const parsed = Papa.parse<CSVRow>(csv, {
				header: true,
				skipEmptyLines: true,
			});

			const ids: number[] = [];

			for (const row of parsed.data) {
				const url = row['Link'] || row['URL'] || row['Url'];

				if (!url) continue;

				const slug = slugFromUrl(url);

				let id = problemMap.get(slug);

				if (id === undefined) {
					id = problems.length;

					problemMap.set(slug, id);

					const title = normalizeTitle(row['Title'] ?? '');
					const generatedTitle = normalizeTitle(slugToTitle(slug));

					const acceptanceRate = Number(row['Acceptance Rate'] || 0) * 10000;

					const problem: Problem = [
						slug,
						difficulties.indexOf(row['Difficulty']),
						Number(acceptanceRate.toFixed(2)),
						getTagIds(row['Topics']),
					];

					// Store the title only if it can't be reconstructed from the slug.
					if (title !== generatedTitle) {
						problem.push(title);
					}

					problems.push(problem);
				}

				ids.push(id);
			}

			companies[company][timeframe.replace(/^\d+\.\s*/, '')] = ids;
		}
	}

	const database = {
		schema: ['slug', 'difficulty', 'acceptance', 'tags', 'customTitle?'],

		metadata: {
			difficulties,

			tags: [...tags.keys()],
		},

		problems,

		companies,
	};

	await fs.writeFile(
		path.join(OUTPUT_DIR, 'database.json'),
		JSON.stringify(database),
	);

	console.log(`✅ Generated ${problems.length} unique problems`);

	console.log(`🏢 Companies: ${Object.keys(companies).length}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
