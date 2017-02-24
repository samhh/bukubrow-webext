console.log('Frontend loaded.')

const timerEl = document.querySelector('.js-timer')

chrome.runtime.onMessage.addListener(req => {
	if (req.bookmarks) {
		req.bookmarks.forEach(bookmark => console.log(bookmark))
	}
	else if (req.timer) {
		console.log('Frontend received timer: ' + req.timer)

		timerEl.textContent = String(req.timer)
	}
	else console.log('Unknown frontend message received: ' + req)
})
