import { compareAgainstMinimum, SemanticVersioningComparison } from 'Modules/semantic-versioning';

describe('compare against minimum semantic version', () => {
	test('correct format', () => {
		expect(compareAgainstMinimum({ minimum: '1.0.0', test: '1.0' })).toBe(SemanticVersioningComparison.BadVersions);
		expect(compareAgainstMinimum({ minimum: '1.0', test: '1.0.0' })).toBe(SemanticVersioningComparison.BadVersions);
		expect(compareAgainstMinimum({ minimum: '1.0.0', test: 'x.0.0' })).toBe(SemanticVersioningComparison.BadVersions);
		expect(compareAgainstMinimum({ minimum: '42.51.60', test: '42.51.60' })).toBe(SemanticVersioningComparison.Okay);
	});

	test('equal major version', () => {
		expect(compareAgainstMinimum({ minimum: '1.0.0', test: '2.0.0' })).toBe(SemanticVersioningComparison.TestTooNew);
		expect(compareAgainstMinimum({ minimum: '2.0.0', test: '1.0.0' })).toBe(SemanticVersioningComparison.TestOutdated);
		expect(compareAgainstMinimum({ minimum: '1.0.0', test: '1.0.0' })).toBe(SemanticVersioningComparison.Okay);
	});

	test('equal or newer minor version', () => {
		expect(compareAgainstMinimum({ minimum: '1.1.0', test: '1.0.0' })).toBe(SemanticVersioningComparison.TestOutdated);
		expect(compareAgainstMinimum({ minimum: '1.0.0', test: '1.1.0' })).toBe(SemanticVersioningComparison.Okay);
	});

	test('equal or newer patch version', () => {
		expect(compareAgainstMinimum({ minimum: '1.0.1', test: '1.0.0' })).toBe(SemanticVersioningComparison.TestOutdated);
		expect(compareAgainstMinimum({ minimum: '1.0.0', test: '1.0.1' })).toBe(SemanticVersioningComparison.Okay);
	});
});
