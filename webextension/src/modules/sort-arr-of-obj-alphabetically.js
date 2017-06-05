const sortArrOfObjAlphabetically = (bookmarks, sortKey) => {
	return bookmarks.sort((a, b) => {
		return a[sortKey].localeCompare(b[sortKey])
	})
}

export default sortArrOfObjAlphabetically
