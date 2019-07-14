import { option } from 'fp-ts/lib/Option';
import { sequenceT } from 'fp-ts/lib/Apply';

export const optionTuple = sequenceT(option);

