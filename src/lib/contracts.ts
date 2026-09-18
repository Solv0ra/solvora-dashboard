import {
  BrowserProvider,
  Contract,
  type ContractTransactionResponse,
  type InterfaceAbi,
} from "ethers";
import EntityRegistryAbi from "./abis/EntityRegistry.json";
import AttestationAbi from "./abis/Attestation.json";

export type EntityTypeName = "Treasury" | "Amm" | "LendingMarket" | "Generic";
export const ENTITY_TYPES: EntityTypeName[] = ["Treasury", "Amm", "LendingMarket", "Generic"];

export interface SolvoraEntity {
  id: bigint;
  owner: string;
  label: string;
  entityType: EntityTypeName;
  chainId: number;
  contractAddresses: string[];
  createdAt: number;
}

interface EntityRecord {
  id: bigint;
  owner: string;
  label: string;
  entityType: bigint;
  chainId: bigint;
  contractAddresses: string[];
  createdAt: bigint;
}

interface RegistryContract {
  listEntitiesByOwner(owner: string): Promise<EntityRecord[]>;
  registerEntity(
    label: string,
    entityType: number,
    chainId: number,
    contractAddresses: string[],
  ): Promise<ContractTransactionResponse>;
}

interface AttestationContract {
  submitAttestation(
    entityId: bigint,
    reportHash: string,
    blockNumber: bigint,
    reportType: string,
  ): Promise<ContractTransactionResponse>;
}

function browserProvider(): BrowserProvider {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No wallet detected. Install MetaMask.");
  }
  return new BrowserProvider(window.ethereum);
}

function registryAddress(): string {
  const addr = process.env.NEXT_PUBLIC_ENTITY_REGISTRY_ADDRESS;
  if (!addr) throw new Error("NEXT_PUBLIC_ENTITY_REGISTRY_ADDRESS is not set");
  return addr;
}

function attestationAddress(): string {
  const addr = process.env.NEXT_PUBLIC_ATTESTATION_ADDRESS;
  if (!addr) throw new Error("NEXT_PUBLIC_ATTESTATION_ADDRESS is not set");
  return addr;
}

export async function fetchEntitiesByOwner(owner: string): Promise<SolvoraEntity[]> {
  const registry = new Contract(
    registryAddress(),
    EntityRegistryAbi as unknown as InterfaceAbi,
    browserProvider(),
  ) as unknown as RegistryContract;

  const records = await registry.listEntitiesByOwner(owner);
  return records.map(mapEntity);
}

export async function registerEntity(
  label: string,
  entityType: EntityTypeName,
  chainId: number,
  contractAddresses: string[],
): Promise<string> {
  const signer = await browserProvider().getSigner();
  const registry = new Contract(
    registryAddress(),
    EntityRegistryAbi as unknown as InterfaceAbi,
    signer,
  ) as unknown as RegistryContract;

  const tx = await registry.registerEntity(
    label,
    ENTITY_TYPES.indexOf(entityType),
    chainId,
    contractAddresses,
  );
  await tx.wait();
  return tx.hash;
}

export async function submitAttestation(
  entityId: bigint,
  reportHash: string,
  blockNumber: bigint,
  reportType: string,
): Promise<string> {
  const signer = await browserProvider().getSigner();
  const attestation = new Contract(
    attestationAddress(),
    AttestationAbi as unknown as InterfaceAbi,
    signer,
  ) as unknown as AttestationContract;

  const tx = await attestation.submitAttestation(entityId, reportHash, blockNumber, reportType);
  await tx.wait();
  return tx.hash;
}

function mapEntity(record: EntityRecord): SolvoraEntity {
  return {
    id: record.id,
    owner: record.owner,
    label: record.label,
    entityType: ENTITY_TYPES[Number(record.entityType)] ?? "Generic",
    chainId: Number(record.chainId),
    contractAddresses: [...record.contractAddresses],
    createdAt: Number(record.createdAt),
  };
}
