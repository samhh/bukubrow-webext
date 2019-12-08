export const runIO = <A>(x: IO<A>): A => x();

export const flip = <
	A extends Array<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
	B extends Array<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
	C,
>(f: (...a: A) => (...b: B) => C) => (...b: B) => (...a: A): C => f(...a)(...b);

