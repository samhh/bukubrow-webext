export enum SemanticVersioningComparison {
	Okay,
	BadVersions,
	TestOutdated,
	TestTooNew,
}

export const compareAgainstMinimum = ({ minimum, test }: { minimum: string; test: string }): SemanticVersioningComparison => {
	const minVer = minimum.split('.').map(str => Number(str));
	const testVer = test.split('.').map(str => Number(str));

	if (
		minVer.length !== 3 ||
		testVer.length !== 3 ||
		minVer.some(num => Number.isNaN(num)) ||
		testVer.some(num => Number.isNaN(num))
	) return SemanticVersioningComparison.BadVersions;

	const [minMajor, minMinor, minPatch] = minVer;
	const [testMajor, testMinor, testPatch] = testVer;

	// Ensure equal major version
	if (testMajor > minMajor) return SemanticVersioningComparison.TestTooNew;
	if (testMajor < minMajor) return SemanticVersioningComparison.TestOutdated;

	// Ensure equal or newer minor version
	if (testMinor < minMinor) return SemanticVersioningComparison.TestOutdated;

	// Ensure equal or newer patch version
	if (testPatch < minPatch) return SemanticVersioningComparison.TestOutdated;

	return SemanticVersioningComparison.Okay;
};
