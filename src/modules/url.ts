import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as A from 'fp-ts/lib/Array';
import { Lens } from 'monocle-ts';
import { includes, join } from '~/modules/array';
import { split } from '~/modules/string';

export const fromString = (url: string): Either<DOMException, URL> => E.tryCatch(
	() => new URL(url),
	err => err instanceof DOMException ? err : new DOMException(),
);

export const href = Lens.fromProp<URL>()('href');
export const protocol = Lens.fromProp<URL>()('protocol');
export const host = Lens.fromProp<URL>()('host');
export const hostname = Lens.fromProp<URL>()('hostname');
export const pathname = Lens.fromProp<URL>()('pathname');

/**
 * Get the domain/host without the subdomain.
 */
export const domain = (x: URL): string => pipe(
	host.get(x),
	split('.'),
	A.takeRight(2),
	join('.'),
);

export const hrefSansProtocol = (x: URL): string => host.get(x) + pathname.get(x);

export const isHttpOrHttps: Predicate<URL> = flow(protocol.get, includes(['http:', 'https:']));

