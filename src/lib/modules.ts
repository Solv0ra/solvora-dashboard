export type ModuleStatus = "live" | "coming_soon";

export interface ModuleInfo {
  id: string;
  name: string;
  status: ModuleStatus;
  description: string;
}

// Matches the engine's module registry (solvora-engine/src/api/moduleRegistry.ts).
// When NEXT_PUBLIC_ENGINE_URL is configured, the app fetches /modules and uses the
// backend as the single source of truth; otherwise it renders these defaults.
export const DEFAULT_MODULES: ModuleInfo[] = [
  {
    id: "reporting",
    name: "Financial Reporting",
    status: "live",
    description:
      "Turn raw Soroban ledger activity into real accounting reports — balance sheets and cash flow statements.",
  },
  {
    id: "risk-monitor",
    name: "Invariant / Risk Monitor",
    status: "coming_soon",
    description:
      "Watch registered protocols for invariant breaks, suspicious admin actions, and TTL / storage expiry risk.",
  },
  {
    id: "proof-of-reserve",
    name: "Proof of Reserve",
    status: "coming_soon",
    description:
      "A public attestation dashboard for BTC-backed and wrapped assets on Stellar.",
  },
];

export async function getModules(): Promise<ModuleInfo[]> {
  const engineUrl = process.env.NEXT_PUBLIC_ENGINE_URL;
  if (!engineUrl) return DEFAULT_MODULES;

  try {
    const res = await fetch(`${engineUrl}/modules`, { next: { revalidate: 60 } });
    if (!res.ok) return DEFAULT_MODULES;
    const body = (await res.json()) as { data?: ModuleInfo[] };
    return body.data && body.data.length > 0 ? body.data : DEFAULT_MODULES;
  } catch {
    return DEFAULT_MODULES;
  }
}