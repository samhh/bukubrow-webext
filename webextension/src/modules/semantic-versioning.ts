export const compareAgainstMinimum = (minimum: string, test: string): boolean => {
	if (minimum.split('.').length !== 3 || test.split('.').length !== 3) return false;

	const [expMajor, expMinor, expPatch] = minimum.split('.');
	const [testMajor, testMinor, testPatch] = test.split('.');

	// Ensure equal major version
	if (testMajor !== expMajor) return false;

	// Ensure equal or newer minor version
	if (testMinor < expMinor) return false;

	// Ensure equal or newer patch version
	if (testPatch < expPatch) return false;

	return true;
};
