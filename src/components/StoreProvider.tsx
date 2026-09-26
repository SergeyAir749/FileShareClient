'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { store, AppStore } from '@/store/store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore | null>(null);

    // eslint-disable-next-line react-hooks/refs
    if (!storeRef.current) {
        storeRef.current = store();
    }

    // //console.log(storeRef.current);
    // //console.log(store);

    // eslint-disable-next-line react-hooks/refs
    return <Provider store={storeRef.current}>{children}</Provider>;
}
