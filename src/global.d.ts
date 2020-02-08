type Option<A> = import('fp-ts/lib/Option').Option<A>;
type OptionTuple<A, B> = Option<[A, B]>;
type Either<E, A> = import('fp-ts/lib/Either').Either<E, A>;
type EitherOption<E, A> = Either<E, Option<A>>;
type These<E, A> = import('fp-ts/lib/These').These<E, A>;
type Task<A> = import('fp-ts/lib/Task').Task<A>;
type TaskEither<E, A> = import('fp-ts/lib/TaskEither').TaskEither<E, A>;
type TaskOption<A> = import('fp-ts-contrib/lib/TaskOption').TaskOption<A>;
type TaskEitherOption<E, A> = TaskEither<E, Option<A>>;
type IO<A> = import('fp-ts/lib/IO').IO<A>;
type NonEmptyArray<A> = import('fp-ts/lib/NonEmptyArray').NonEmptyArray<A>;

type Lazy<A> = import('fp-ts/lib/function').Lazy<A>;
type Predicate<A> = import('fp-ts/lib/function').Predicate<A>;
type Refinement<A, B> = import('fp-ts/lib/function').Refinement<A, B>;
type Endomorphism<A> = import('fp-ts/lib/function').Endomorphism<A>;

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends Array<infer U>
		? Array<DeepPartial<U>>
		: T[P] extends ReadonlyArray<infer U>
			? ReadonlyArray<DeepPartial<U>>
			: DeepPartial<T[P]>
};

type UnwrapOptions<T> = {
	[K in keyof T]: T[K] extends Option<infer U> ? U : T[K];
};

