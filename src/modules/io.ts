import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { join } from '~~/modules/array';
import { error } from '~~/modules/error';

const report = (es: t.Errors): Array<string> => PathReporter.report(E.left(es));

// For this reason: https://github.com/gcanti/fp-ts/issues/904
export const decode = <A, O>(x: t.Type<A, O>) => (y: unknown): Either<Error, A> => pipe(
	x.decode(y),
	E.mapLeft(flow(report, join(', '), error)),
);

