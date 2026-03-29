"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type MobileBottomBarContextValue = {
    override: ReactNode | null;
    setOverride: (node: ReactNode) => void;
    clearOverride: () => void;
};

const MobileBottomBarCtx = createContext<MobileBottomBarContextValue>({
    override: null,
    setOverride: () => { },
    clearOverride: () => { },
});

export function MobileBottomBarProvider({ children }: { children: ReactNode }) {
    const [override, setOverrideState] = useState<ReactNode | null>(null);

    const setOverride = useCallback((node: ReactNode) => {
        setOverrideState(node);
    }, []);

    const clearOverride = useCallback(() => {
        setOverrideState(null);
    }, []);

    return (
        <MobileBottomBarCtx.Provider value={{ override, setOverride, clearOverride }}>
            {children}
        </MobileBottomBarCtx.Provider>
    );
}

export function useMobileBottomBar() {
    return useContext(MobileBottomBarCtx);
}
