import { useEffect, useState } from 'react';

type EventsRecord = Record<string, KeyboardEvent>;

const useListenToKeydown = () => {
	const [evts, setEvts] = useState<EventsRecord>({});
	const [uniqueId, setUniqueId] = useState(Symbol());

	const setEvtsAndId = (newEvts: EventsRecord) => {
		setEvts(newEvts);
		setUniqueId(Symbol());
	};

	const handleKeydown = (evt: KeyboardEvent) => {
		setEvtsAndId({
			...evts,
			[evt.key]: evt,
		});
	};

	const handleKeyup = (evt: KeyboardEvent) => {
		const { [evt.key]: evtToDiscard, ...evtsToKeep } = evts;

		setEvtsAndId(evtsToKeep);
	};

	useEffect(() => {
		document.addEventListener('keydown', handleKeydown);
		document.addEventListener('keyup', handleKeyup);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
			document.removeEventListener('keyup', handleKeyup);
		};
	}, []);

	// export as tuple
	return [evts, uniqueId] as [EventsRecord, symbol];
};

export default useListenToKeydown;
