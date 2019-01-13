import { useEffect, useState } from 'react';

const useListenToKeydown = () => {
	const [evt, setEvt] = useState<Nullable<KeyboardEvent>>(null);

	// TODO can replace with setEvt in handlers directly? try it
	const handleEvent = (evt: KeyboardEvent) => {
		setEvt(evt);
	};

	useEffect(() => {
		document.addEventListener('keydown', handleEvent);

		return () => {
			document.removeEventListener('keydown', handleEvent);
		};
	});

	return evt;
};

export default useListenToKeydown;
