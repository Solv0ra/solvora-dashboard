import type { ModuleInfo } from "@/lib/modules";

const STATUS_STYLES: Record<ModuleInfo["status"], string> = {
  live: "bg-mint/10 text-mint border-mint/30",
  coming_soon: "bg-accent/10 text-accent-soft border-accent/30",
};

const STATUS_LABEL: Record<ModuleInfo["status"], string> = {
  live: "Live",
  coming_soon: "Coming soon",
};

export function ModuleCard({ module }: { module: ModuleInfo }) {
  const live = module.status === "live";
  return (
    <article
      className={`group relative flex flex-col gap-4 rounded-2xl border p-6 transition
        ${
          live
            ? "border-edge bg-surface hover:border-accent/50 hover:shadow-[0_0_40px_-12px_rgba(99,102,241,0.35)]"
            : "border-edge bg-surface/60 opacity-80"
        }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[module.status]}`}
        >
          {STATUS_LABEL[module.status]}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-white">{module.name}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{module.description}</p>
      {live ? (
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-accent-soft">
          Open module
          <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      ) : (
        <span className="mt-auto inline-flex items-center gap-2 text-sm text-slate-500">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Included in a later wave
        </span>
      )}
    </article>
  );
}