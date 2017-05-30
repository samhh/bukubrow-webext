const ensureValidURL = url => {
	const isAlreadyValidUrl = url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://'

	return isAlreadyValidUrl ? url : `http://${url}`
}

export default ensureValidURL
