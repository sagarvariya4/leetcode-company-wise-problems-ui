import type { NextConfig } from 'next';

const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
	output: 'export',
	distDir: 'out',
	reactCompiler: true,

	basePath: isGithubPages ? '/leetcode-company-wise-problems-ui' : '',
	assetPrefix: isGithubPages ? '/leetcode-company-wise-problems-ui/' : '',

	images: {
		unoptimized: true,
	},

	trailingSlash: true,
};

export default nextConfig;
