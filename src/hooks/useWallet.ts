"use client";

import { useEffect, useState } from "react";

export interface WalletState {
  address: string | null;
  connected: boolean;
  available: boolean;
}

// Adapter for @stellar/freighter-api v6 (all functions return { … , error? }).
export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    connected: false,
    available: false,
  });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { isConnected, getAddress } = await import("@stellar/freighter-api");
        const res = await isConnected();
        if (cancelled) return;
        if (res.error || !res.isConnected) {
          setState((s) => ({ ...s, available: true }));
          return;
        }
        const addr = await getAddress();
        if (cancelled) return;
        setState({
          available: true,
          connected: !addr.error && Boolean(addr.address),
          address: addr.error ? null : addr.address,
        });
      } catch {
        if (!cancelled) setState((s) => ({ ...s, available: false }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const connect = async () => {
    if (!state.available || pending) return;
    setPending(true);
    try {
      const { requestAccess, getAddress } = await import("@stellar/freighter-api");
      const access = await requestAccess();
      if (access.error || !access.address) {
        setState({ address: null, connected: false, available: true });
        return;
      }
      const addr = await getAddress();
      setState({
        address: addr.error ? null : addr.address,
        connected: !addr.error && Boolean(addr.address),
        available: true,
      });
    } catch {
      setState({ address: null, connected: false, available: true });
    } finally {
      setPending(false);
    }
  };

  const disconnect = () => {
    setState((s) => ({ ...s, address: null, connected: false }));
  };

  return { ...state, connect, disconnect, pending };
}