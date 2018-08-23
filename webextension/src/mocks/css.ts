const cssMock: Record<string, string> = new Proxy({}, {
	get(_, prop) {
		return prop;
	},
});

export default cssMock;
