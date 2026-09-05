"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ConnectButton } from "@/components/ConnectButton";
import { useWallet } from "@/hooks/useWallet";

type ReportType = "balance_sheet" | "cash_flow";

const REPORT_TYPES: { id: ReportType; name: string; blurb: string; hint: string }[] = [
  {
    id: "balance_sheet",
    name: "Balance Sheet",
    blurb: "What the entity holds at a point in time.",
    hint: "Assets held by the entity at the snapshot ledger.",
  },
  {
    id: "cash_flow",
    name: "Cash Flow",
    blurb: "What moved in and out over a period.",
    hint: "Inflows and outflows across the selected range.",
  },
];

type EngineState = "checking" | "online" | "offline";

export default function ReportingPage() {
  const wallet = useWallet();
  const [engineState, setEngineState] = useState<EngineState>("checking");
  const [reportType, setReportType] = useState<ReportType>("balance_sheet");

  useEffect(() => {
    const engineUrl = process.env.NEXT_PUBLIC_ENGINE_URL;
    if (!engineUrl) {
      setEngineState("offline");
      return;
    }
    fetch(`${engineUrl}/health`)
      .then((res) => setEngineState(res.ok ? "online" : "offline"))
      .catch(() => setEngineState("offline"));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-edge/60 bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent font-bold text-white">
                S
              </span>
              <span className="text-lg font-semibold tracking-tight text-white">
                Solvora
              </span>
            </Link>
            <span className="hidden text-sm text-slate-500 sm:inline">/</span>
            <span className="hidden text-sm text-slate-300 sm:inline">
              Financial Reporting
            </span>
          </div>
          <ConnectButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
        <section className="py-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs text-mint">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            Live module
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Financial Reporting
          </h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            Generate standard financial reports from real Soroban ledger activity — then
            anchor them on-chain so anyone can verify them.
          </p>
        </section>

        <section className="mb-10 rounded-2xl border border-edge bg-surface p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Step 1 — Connect your wallet
          </h2>
          {wallet.connected && wallet.address ? (
            <div className="mt-3 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-mint" />
              <span className="font-mono text-sm text-slate-200">{wallet.address}</span>
            </div>
          ) : (
            <div className="mt-3">
              <p className="mb-4 text-sm text-slate-400">
                {wallet.available
                  ? "Connect Freighter to load the entities you own and to attest reports."
                  : "Install the Freighter wallet extension to use entity flows."}
              </p>
              <ConnectButton />
            </div>
          )}
        </section>

        <section className="mb-10 rounded-2xl border border-edge bg-surface p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Step 2 — Pick a report type
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {REPORT_TYPES.map((rt) => (
              <button
                key={rt.id}
                onClick={() => setReportType(rt.id)}
                className={`rounded-xl border p-5 text-left transition ${
                  reportType === rt.id
                    ? "border-accent bg-accent/10"
                    : "border-edge bg-ink/40 hover:border-accent/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{rt.name}</h3>
                  {reportType === rt.id && (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-white">
                      Selected
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-400">{rt.blurb}</p>
                <p className="mt-2 text-xs text-slate-500">{rt.hint}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-edge bg-surface p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Step 3 — Generate your report
          </h2>
          <div className="mt-4">
            <GeneratePanel reportType={reportType} engineState={engineState} />
          </div>
        </section>
      </main>

      <footer className="border-t border-edge/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs text-slate-500">
          <span>Solvora — Financial Reporting module.</span>
          <Link href="/" className="hover:text-slate-300">
            ← Back to modules
          </Link>
        </div>
      </footer>
    </div>
  );
}

function GeneratePanel({
  reportType,
  engineState,
}: {
  reportType: ReportType;
  engineState: EngineState;
}) {
  const [message, setMessage] = useState<string | null>(null);

  const engineUrl = process.env.NEXT_PUBLIC_ENGINE_URL;

  const generate = async () => {
    setMessage(null);
    if (engineState !== "online" || !engineUrl) {
      setMessage(
        "Reports are coming soon — this module is wired and ready, waiting for live on-chain data to flow in.",
      );
      return;
    }
    try {
      const res = await fetch(`${engineUrl}/entities`);
      const body = (await res.json()) as { data?: unknown[] };
      if (body.data && body.data.length > 0) {
        setMessage(
          `${body.data.length} entit${body.data.length === 1 ? "y" : "ies"} found. Reports will render here — entity selection and report tables ship in the next UI pass.`,
        );
      } else {
        setMessage(
          "No entities registered yet. Register a treasury entity from the entity picker to see its balance sheet and cash flow here.",
        );
      }
    } catch {
      setMessage("Could not reach the engine. Check the backend health endpoint.");
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-edge bg-ink/40 p-6 text-center">
      <p className="text-sm text-slate-300">
        Balance Sheet and Cash Flow reports will render here from real indexed on-chain
        data.
      </p>
      <button
        onClick={generate}
        className="mt-4 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-soft"
      >
        Generate {reportType === "balance_sheet" ? "Balance Sheet" : "Cash Flow"}
      </button>
      {message && (
        <p className="mt-4 text-sm leading-relaxed text-slate-400">{message}</p>
      )}
    </div>
  );
}