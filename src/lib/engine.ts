export type ReportType = "balance_sheet" | "cash_flow";

export interface ReportRow {
  symbol: string;
  asset: string;
  amount: string;
  decimals: number;
  description?: string;
}

export interface ReportSection {
  title: string;
  note?: string;
  rows: ReportRow[];
}

export interface ReportPeriod {
  from: number;
  to: number;
  fromTimestamp: number;
  toTimestamp: number;
}

export interface Report {
  entityId: string;
  type: ReportType;
  generatedAt: number;
  blockNumber: number;
  blockTimestamp: number;
  period: ReportPeriod | null;
  sections: ReportSection[];
  canonicalHash: string;
}

export async function fetchReport(
  entityId: string,
  type: ReportType,
  opts?: { from?: number; to?: number; fromDate?: string; toDate?: string },
): Promise<Report> {
  const base = process.env.NEXT_PUBLIC_ENGINE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_ENGINE_URL is not set");

  const params = new URLSearchParams({ type });
  if (opts?.from != null) params.set("from", String(opts.from));
  if (opts?.to != null) params.set("to", String(opts.to));
  if (opts?.fromDate) params.set("fromDate", opts.fromDate);
  if (opts?.toDate) params.set("toDate", opts.toDate);

  const res = await fetch(`${base}/entities/${entityId}/reports?${params}`);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Engine returned ${res.status}`);
  }
  const body = (await res.json()) as { data: Report };
  return body.data;
}
