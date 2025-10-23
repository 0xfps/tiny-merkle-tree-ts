import { extractKeyMetadata } from "../contract-utils/extract-key-metadata";

export const NOTE = BigInt(100e6)

export function getMaxSlots(withdrawalKey: string): number {
    const { amountU32 } = extractKeyMetadata(withdrawalKey)
    const amountBigInt = BigInt(amountU32)
    const quotient = amountBigInt / NOTE
    return Number(quotient + 1n)
}