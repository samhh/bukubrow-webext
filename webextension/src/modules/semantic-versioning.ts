export const compareAgainstMinimum = (minimum: string, test: string): boolean => {
	const minVer = minimum.split('.').map(str => Number(str));
	const testVer = test.split('.').map(str => Number(str));

	if (
		minVer.length !== 3 ||
		testVer.length !== 3 ||
		minVer.some(num => Number.isNaN(num)) ||
		testVer.some(num => Number.isNaN(num))
	) return false;

	const [expMajor, expMinor, expPatch] = minVer;
	const [testMajor, testMinor, testPatch] = testVer;

	// Ensure equal major version
	if (testMajor !== expMajor) return false;

	// Ensure equal or newer minor version
	if (testMinor < expMinor) return false;

	// Ensure equal or newer patch version
	if (testPatch < expPatch) return false;

	return true;
};
