import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function arbiscanExplorerLink(
  address: string,
  type: "address" | "tx" | "token" | "block" | "contract" = "address",
) {
  return `https://arbiscan.io/${type}/${address}`;
}

export function formatArweaveId(id: string) {
  return formatAddress(id);
}

export function arweaveExplorerLink(id: string) {
  return `https://viewblock.io/arweave/tx/${id}`;
}
