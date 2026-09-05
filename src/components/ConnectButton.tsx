"use client";

import { useWallet } from "@/hooks/useWallet";

export function ConnectButton() {
  const { address, connected, available, connect, disconnect, pending } = useWallet();

  if (connected && address) {
    const short = `${address.slice(0, 6)}…${address.slice(-4)}`;
    return (
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface px-3 py-1.5 text-xs text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" />
          {short}
        </span>
        <button
          onClick={disconnect}
          className="text-xs text-slate-500 hover:text-slate-300"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={pending || !available}
      className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
    >
      {!available ? "Install Freighter" : pending ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}