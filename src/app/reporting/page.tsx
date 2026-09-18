"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ConnectButton } from "@/components/ConnectButton";
import { useWallet, SEPOLIA_CHAIN_ID } from "@/hooks/useWallet";
import {
  fetchEntitiesByOwner,
  submitAttestation,
  type SolvoraEntity,
} from "@/lib/contracts";
import { fetchReport, type Report, type ReportType } from "@/lib/engine";
import { chainName } from "@/lib/chains";
import { formatAmount, formatDate } from "@/lib/format";

const REPORT_TYPES: { id: ReportType; name: string; blurb: string }[] = [
  {
    id: "balance_sheet",
    name: "Balance Sheet",
    blurb: "What the entity holds at a point in time.",
  },
  {
    id: "cash_flow",
    name: "Cash Flow",
    blurb: "What moved in and out over a period.",
  },
];

export default function ReportingPage() {
  const wallet = useWallet();
  const [entities, setEntities] = useState<SolvoraEntity[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reportType, setReportType] = useState<ReportType>("balance_sheet");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadEntities = useCallback(async () => {
    if (!wallet.connected || !wallet.address) return;
    try {
      const list = await fetchEntitiesByOwner(wallet.address);
      setEntities(list);
      setSelectedId((prev) => prev ?? (list[0] ? list[0].id.toString() : null));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [wallet.connected, wallet.address]);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  const generate = async () => {
    setError(null);
    setMessage(null);
    setReport(null);
    if (!selectedId) {
      setError("Select an entity first.");
      return;
    }
    setLoading(true);
    try {
      setReport(
        await fetchReport(selectedId, reportType, {
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const attest = async () => {
    if (!report || !selectedId) return;
    setError(null);
    setMessage(null);
    try {
      const txHash = await submitAttestation(
        BigInt(selectedId),
        report.canonicalHash,
        BigInt(report.blockNumber),
        report.type,
      );
      setMessage(`Report attested on-chain. Transaction: ${txHash}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const wrongNetwork =
    wallet.connected && wallet.chainId !== null && wallet.chainId !== SEPOLIA_CHAIN_ID;

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
            Generate standard financial reports from real on-chain activity — then anchor
            them on-chain so anyone can verify them.
          </p>
        </section>

        {wrongNetwork && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            You are on the wrong network. Switch your wallet to Sepolia.
          </div>
        )}

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
                  ? "Connect MetaMask to load the entities you own and to attest reports."
                  : "Install the MetaMask wallet extension to use entity flows."}
              </p>
              <ConnectButton />
            </div>
          )}
        </section>

        <section className="mb-10 rounded-2xl border border-edge bg-surface p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Step 2 — Pick an entity and report type
          </h2>

          <div className="mt-4">
            <span className="text-xs uppercase tracking-wider text-slate-500">Entity</span>
            <select
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(e.target.value || null)}
              className="mt-1 w-full rounded-lg border border-edge bg-ink/40 px-3 py-2 text-sm text-slate-200 outline-none focus:border-accent/60"
            >
              <option value="">Select an entity…</option>
              {entities.map((e) => (
                <option key={e.id.toString()} value={e.id.toString()}>
                  #{e.id.toString()} — {e.label} ({chainName(e.chainId)})
                </option>
              ))}
            </select>
            {wallet.connected && entities.length === 0 && (
              <p className="mt-2 text-xs text-slate-500">
                No entities yet — register one from the home page.
              </p>
            )}
          </div>

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
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-edge bg-surface p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Step 3 — Generate your report
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-slate-500">From date</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-edge bg-ink/40 px-3 py-2 text-sm text-slate-200 outline-none focus:border-accent/60"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-slate-500">To date</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-edge bg-ink/40 px-3 py-2 text-sm text-slate-200 outline-none focus:border-accent/60"
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {reportType === "balance_sheet"
              ? "A balance sheet is a snapshot at the start of the “To date” (defaults to now)."
              : "Cash flow covers “From date” through the end of “To date” (defaults to the last ~30 hours)."}
          </p>

          <div className="mt-4">
            <button
              onClick={generate}
              disabled={loading || !selectedId}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Generating…" : `Generate ${reportType === "balance_sheet" ? "Balance Sheet" : "Cash Flow"}`}
            </button>
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          {message && (
            <p className="mt-4 rounded-lg border border-mint/30 bg-mint/10 px-4 py-2 text-sm text-mint">
              {message}
            </p>
          )}

          {report && (
            <div className="mt-6">
              <ReportView report={report} />
              <button
                onClick={attest}
                className="mt-6 rounded-full border border-mint/50 bg-mint/10 px-5 py-2.5 text-sm font-medium text-mint transition hover:bg-mint/20"
              >
                Attest on-chain
              </button>
            </div>
          )}
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

function ReportView({ report }: { report: Report }) {
  const empty = report.sections.every((s) => s.rows.length === 0);

  return (
    <div className="rounded-xl border border-edge bg-ink/40 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-white">
          {report.type === "balance_sheet" ? "Balance Sheet" : "Cash Flow"}
        </h3>
        <div className="text-right text-xs text-slate-500">
          {report.type === "balance_sheet" ? (
            <div>As of {formatDate(report.blockTimestamp)}</div>
          ) : (
            report.period && (
              <div>
                {formatDate(report.period.fromTimestamp)} – {formatDate(report.period.toTimestamp)}
              </div>
            )
          )}
          <div>Block #{report.blockNumber.toLocaleString()}</div>
        </div>
      </div>

      {empty ? (
        <p className="mt-4 rounded-lg border border-edge bg-surface/40 px-4 py-6 text-center text-sm text-slate-400">
          No on-chain activity or holdings found for this entity.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {report.sections.map((section) => (
            <div
              key={section.title}
              className="rounded-lg border border-edge/60 bg-surface/40 p-4"
            >
              <h4 className="text-sm font-semibold text-slate-200">{section.title}</h4>
              {section.note && <p className="mt-1 text-xs text-slate-500">{section.note}</p>}
              {section.rows.length === 0 ? (
                <p className="mt-3 text-sm text-slate-600">—</p>
              ) : (
                <table className="mt-2 w-full text-sm">
                  <tbody>
                    {section.rows.map((row, i) => (
                      <tr key={`${row.asset}-${i}`} className="border-t border-edge/50">
                        <td className="py-2 text-slate-200">
                          {row.symbol}
                          {row.description && (
                            <div className="text-xs text-amber-400/80">{row.description}</div>
                          )}
                        </td>
                        <td className="py-2 text-right font-mono text-slate-300">
                          {formatAmount(row.amount, row.decimals)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 break-all font-mono text-xs text-slate-600">
        hash: {report.canonicalHash}
      </p>
    </div>
  );
}
