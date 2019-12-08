export const runIO = <A>(x: IO<A>): A => x();

export const flip = <
	A extends Array<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
	B extends Array<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
	C,
>(f: (...a: A) => (...b: B) => C) => (...b: B) => (...a: A): C => f(...a)(...b);

/*
 * Drop the return value of the provided function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const _ = <A extends Array<any>>(f: (...args: A) => any) => (...args: A): void => void f(...args);

