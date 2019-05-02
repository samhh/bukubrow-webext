import { useEffect } from 'react';

const useListenToKeydown = (cb: (evt: KeyboardEvent) => void) => {
	useEffect(() => {
		document.addEventListener('keydown', cb);

		return () => {
			document.removeEventListener('keydown', cb);
		};
	}, []);
};

export default useListenToKeydown;
