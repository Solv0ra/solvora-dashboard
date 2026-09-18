"use client";

import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";

export const SEPOLIA_CHAIN_ID = 11155111;

export interface WalletState {
  address: string | null;
  connected: boolean;
  available: boolean;
  chainId: number | null;
}

function getProvider(): BrowserProvider | null {
  if (typeof window === "undefined" || !window.ethereum) return null;
  return new BrowserProvider(window.ethereum);
}

async function readChainId(provider: BrowserProvider): Promise<number | null> {
  try {
    const network = await provider.getNetwork();
    return Number(network.chainId);
  } catch {
    return null;
  }
}

// Wallet adapter for injected EVM wallets (MetaMask, Rabby, etc.) via EIP-1193.
export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    connected: false,
    available: false,
    chainId: null,
  });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const provider = getProvider();
      if (!provider) {
        if (!cancelled)
          setState({ address: null, connected: false, available: false, chainId: null });
        return;
      }
      try {
        const [accounts, chainId] = await Promise.all([
          provider.send("eth_accounts", []) as Promise<string[]>,
          readChainId(provider),
        ]);
        if (cancelled) return;
        if (accounts.length > 0) {
          setState({ available: true, connected: true, address: accounts[0], chainId });
        } else {
          setState({ available: true, connected: false, address: null, chainId });
        }
      } catch {
        if (!cancelled)
          setState({ address: null, connected: false, available: true, chainId: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const connect = async () => {
    if (pending) return;
    setPending(true);
    try {
      const provider = getProvider();
      if (!provider) {
        setState({ address: null, connected: false, available: false, chainId: null });
        return;
      }
      const [accounts, chainId] = await Promise.all([
        provider.send("eth_requestAccounts", []) as Promise<string[]>,
        readChainId(provider),
      ]);
      setState({
        available: true,
        connected: accounts.length > 0,
        address: accounts[0] ?? null,
        chainId,
      });
    } catch {
      setState({ address: null, connected: false, available: true, chainId: null });
    } finally {
      setPending(false);
    }
  };

  const disconnect = () => {
    setState((s) => ({ ...s, address: null, connected: false }));
  };

  return { ...state, connect, disconnect, pending };
}
