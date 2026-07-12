import { execSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const PREFIX = 'vendor/leetcode-company-wise-problems';
const REPO = 'https://github.com/liquidslr/leetcode-company-wise-problems.git';
const BRANCH = 'main';

function ensureCleanWorkingTree() {
	try {
		execSync('git diff-index --quiet HEAD --');
	} catch (error) {
		console.error(error);
		console.error(
			'❌ Working tree is not clean. Please commit or stash your changes before updating the subtree.',
		);
		process.exit(1);
	}
}

function syncSubtree() {
	const exists = existsSync(PREFIX);

	console.log('📚 LeetCode Company Problems');
	console.log(`📂 Prefix : ${PREFIX}`);
	console.log(`🌿 Branch : ${BRANCH}`);

	if (exists) {
		console.log('🔄 Updating existing subtree...');
	} else {
		console.log('➕ Adding subtree for the first time...');
	}

	const args = exists
		? ['subtree', 'pull', `--prefix=${PREFIX}`, REPO, BRANCH, '--squash']
		: ['subtree', 'add', `--prefix=${PREFIX}`, REPO, BRANCH, '--squash'];

	const result = spawnSync('git', args, {
		stdio: 'inherit',
	});

	if (result.error) {
		throw result.error;
	}

	if (result.status !== 0) {
		throw new Error(
			`Git subtree command failed with exit code ${result.status}.`,
		);
	}

	console.log('✅ LeetCode repository synchronized successfully.');
}

try {
	ensureCleanWorkingTree();
	syncSubtree();
} catch (error) {
	console.error(error);
	console.error('❌ Unexpected error while synchronizing the subtree.');
	process.exit(1);
}
