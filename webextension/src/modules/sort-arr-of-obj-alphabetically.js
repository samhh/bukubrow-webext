const sortArrOfObjAlphabetically = (bookmarks, sortKey) =>
	[...bookmarks].sort((a, b) => a[sortKey].localeCompare(b[sortKey]))

export default sortArrOfObjAlphabetically
