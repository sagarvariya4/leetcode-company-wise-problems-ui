export type Problem = [
	slug: string,
	difficulty: number,
	acceptance: number,
	tags: number[],
	customTitle?: string,
];

export type Database = {
	schema: string[];
	metadata: {
		difficulties: string[];
		tags: string[];
		titleExceptions?: Record<string, string>;
	};
	problems: Problem[];
	companies: Record<string, Record<string, number[]>>;
};

export function slugToTitle(slug: string) {
	return slug
		.split('-')
		.map((part) => {
			// Numbers
			if (/^\d+$/.test(part)) return part;

			// Preserve acronyms
			const acronyms = new Set([
				'api',
				'sql',
				'json',
				'xml',
				'utf',
				'tcp',
				'udp',
			]);

			if (acronyms.has(part)) {
				return part.toUpperCase();
			}

			return part[0].toUpperCase() + part.slice(1);
		})
		.join(' ');
}

export function getProblemTitle(problem: Problem) {
	return problem[4] ?? slugToTitle(problem[0]);
}

export function normalizeTitle(title: string) {
	return title.trim().replace(/\s+/g, ' ');
}

export function getTitle(db: Database, slug: string) {
	return db.metadata.titleExceptions?.[slug] ?? slugToTitle(slug);
}
