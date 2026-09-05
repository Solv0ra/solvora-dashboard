import { ConnectButton } from "@/components/ConnectButton";
import { ModuleCard } from "@/components/ModuleCard";
import { getModules } from "@/lib/modules";

export default async function Home() {
  const modules = await getModules();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-edge/60 bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent font-bold text-white">
              S
            </span>
            <span className="text-lg font-semibold tracking-tight text-white">
              Solvora
            </span>
          </div>
          <ConnectButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        <section className="py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface px-3 py-1 text-xs text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Built on Stellar Soroban
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
              On-chain financial
              <br />
              intelligence for{" "}
              <span className="bg-gradient-to-r from-accent-soft to-mint bg-clip-text text-transparent">
                Soroban
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
              Register an on-chain entity — a treasury, a protocol, a multisig — and run
              financial tools against it. Balance sheets and cash flow from real ledger
              data, with every report anchored on-chain and verifiable by anyone.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#modules"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-soft"
              >
                Explore the modules
              </a>
              <a
                href="https://github.com/Solv0ra"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-edge bg-surface px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-accent/50 hover:text-white"
              >
                View source
              </a>
            </div>
          </div>
        </section>

        <section id="modules" className="pb-24">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">One platform, many tools</h2>
              <p className="mt-1 text-sm text-slate-400">
                Pick an entity, pick a tool. New modules ship wave by wave.
              </p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {modules.map((m) => (
              <ModuleCard key={m.id} module={m} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-edge/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs text-slate-500">
          <span>Solvora — financial intelligence on Stellar Soroban.</span>
          <a
            href="https://github.com/Solv0ra"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-300"
          >
            GitHub ↗
          </a>
        </div>
      </footer>
    </div>
  );
}