import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import unusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = [
	{
		ignores: [
			'coverage/**',
			'public/**',
			'dist/**',
			'node_modules/**',
			'*-lock.json',
			'*-lock.yaml',
			'*-workspace.yaml',
			//  Default ignores of eslint-config-next:
			'.next/**',
			'out/**',
			'build/**',
			'next-env.d.ts',
		],
		plugins: {
			'unused-imports': unusedImports,
		},
		rules: {
			'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
				},
			],
		},
	},
	eslintPluginPrettierRecommended,
	prettier, // should be last always
	...nextVitals,
	...nextTs,
];

export default eslintConfig;
