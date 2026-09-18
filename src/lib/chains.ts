export interface ChainInfo {
  id: number;
  name: string;
}

export const SUPPORTED_CHAINS: ChainInfo[] = [
  { id: 1, name: "Ethereum Mainnet" },
  { id: 11155111, name: "Sepolia" },
  { id: 42161, name: "Arbitrum One" },
  { id: 10, name: "Optimism" },
  { id: 8453, name: "Base" },
  { id: 137, name: "Polygon" },
];

export function chainName(id: number): string {
  return SUPPORTED_CHAINS.find((c) => c.id === id)?.name ?? `Chain ${id}`;
}
