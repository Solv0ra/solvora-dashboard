"use client";

import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import {
  ENTITY_TYPES,
  fetchEntitiesByOwner,
  registerEntity,
  type EntityTypeName,
  type SolvoraEntity,
} from "@/lib/contracts";
import { SUPPORTED_CHAINS, chainName } from "@/lib/chains";

export function EntityManager() {
  const { address, connected } = useWallet();
  const [entities, setEntities] = useState<SolvoraEntity[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    if (!connected || !address) return;
    setError(null);
    try {
      setEntities(await fetchEntitiesByOwner(address));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [connected, address]);

  useEffect(() => {
    load();
  }, [load]);

  if (!connected || !address) return null;

  return (
    <section id="entities" className="pb-24">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Your entities</h2>
          <p className="mt-1 text-sm text-slate-400">
            Reporting entities you own. Pick one to run tools against it.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-medium text-accent-soft transition hover:bg-accent/20"
        >
          {showForm ? "Close" : "Register entity"}
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {showForm && <RegisterEntityForm onRegistered={load} />}

      {entities === null ? (
        <p className="text-sm text-slate-500">Loading your entities…</p>
      ) : entities.length === 0 ? (
        <p className="rounded-xl border border-dashed border-edge bg-surface/40 p-6 text-sm text-slate-400">
          No entities yet. Register a treasury to generate reports and attest them on-chain.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {entities.map((e) => (
            <EntityCard key={e.id.toString()} entity={e} />
          ))}
        </div>
      )}
    </section>
  );
}

function EntityCard({ entity }: { entity: SolvoraEntity }) {
  return (
    <div className="rounded-2xl border border-edge bg-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">{entity.label}</h3>
        <span className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-0.5 text-xs text-mint">
          {entity.entityType}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Entity #{entity.id.toString()} · {chainName(entity.chainId)}
      </p>
      <div className="mt-3 space-y-1">
        {entity.contractAddresses.length === 0 ? (
          <p className="text-xs text-slate-500">No addresses</p>
        ) : (
          entity.contractAddresses.map((a) => (
            <p key={a} className="truncate font-mono text-xs text-slate-400">
              {a}
            </p>
          ))
        )}
      </div>
    </div>
  );
}

function RegisterEntityForm({ onRegistered }: { onRegistered: () => void }) {
  const [label, setLabel] = useState("");
  const [entityType, setEntityType] = useState<EntityTypeName>("Treasury");
  const [chainId, setChainId] = useState<number>(1);
  const [addressesText, setAddressesText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    const addresses = addressesText
      .split(/[\s,]+/)
      .map((a) => a.trim())
      .filter(Boolean);

    if (!label.trim()) {
      setError("Label is required.");
      return;
    }

    setSubmitting(true);
    try {
      await registerEntity(label.trim(), entityType, chainId, addresses);
      setLabel("");
      setAddressesText("");
      onRegistered();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-edge bg-surface p-6">
      <h3 className="font-semibold text-white">Register a new entity</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-slate-500">Label</span>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Acme Treasury"
            className="mt-1 w-full rounded-lg border border-edge bg-ink/40 px-3 py-2 text-sm text-slate-200 outline-none focus:border-accent/60"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-slate-500">Type</span>
          <select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value as EntityTypeName)}
            className="mt-1 w-full rounded-lg border border-edge bg-ink/40 px-3 py-2 text-sm text-slate-200 outline-none focus:border-accent/60"
          >
            {ENTITY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-slate-500">Chain</span>
          <select
            value={chainId}
            onChange={(e) => setChainId(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-edge bg-ink/40 px-3 py-2 text-sm text-slate-200 outline-none focus:border-accent/60"
          >
            {SUPPORTED_CHAINS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="mt-4 block">
        <span className="text-xs uppercase tracking-wider text-slate-500">
          Contract addresses on {chainName(chainId)} (comma or newline separated)
        </span>
        <textarea
          value={addressesText}
          onChange={(e) => setAddressesText(e.target.value)}
          placeholder={"0x1234…\n0x5678…"}
          rows={3}
          className="mt-1 w-full rounded-lg border border-edge bg-ink/40 px-3 py-2 font-mono text-sm text-slate-200 outline-none focus:border-accent/60"
        />
      </label>
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      <button
        onClick={submit}
        disabled={submitting}
        className="mt-4 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Register entity"}
      </button>
    </div>
  );
}
