const sleep = (ms: number): Task<void> => (): Promise<void> => new Promise((resolve) => {
	setTimeout(resolve, ms);
});

export default sleep;

