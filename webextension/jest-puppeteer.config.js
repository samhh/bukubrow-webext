module.exports = {
	launch: {
		// Prevents annoying error on Linux
		args: ['--no-sandbox'],
		// Prevents tests failing for no apparent reason
		headless: false,
	},
};
