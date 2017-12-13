import { APP_NAME } from '../../modules/config'

export const sendNativeMessage = request => new Promise(resolve =>
	chrome.runtime.sendNativeMessage(APP_NAME, request, resolve))

export const sendExtensionMessage = request => new Promise(resolve => {
	chrome.runtime.sendMessage(request)

	resolve()
})
