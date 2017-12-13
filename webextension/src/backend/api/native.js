import { sendNativeMessage } from './protocol'
import { compareAgainstMinimum } from '../../modules/semantic-versioning'
import { MINIMUM_BINARY_VERSION } from '../../modules/config'

// Check for runtime errors
export const checkRuntimeErrors = () => new Promise(resolve => {
	resolve((chrome.runtime.lastError && chrome.runtime.lastError.message) || false)
})

// Ensure binary version is equal to or newer than what we're expecting, but on
// the same major version (semantic versioning)
export const checkBinaryVersion = () =>
	sendNativeMessage({ method: 'OPTIONS' })
		.then(res => (
			res.success &&
			res.binaryVersion &&
			compareAgainstMinimum(MINIMUM_BINARY_VERSION, res.binaryVersion)
		))

export const getBookmarks = () => sendNativeMessage({ method: 'GET' })
