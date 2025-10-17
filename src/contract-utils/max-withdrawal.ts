import { calculateFee } from "./calculate-fee";
import { extractKeyMetadata } from "./extract-key-metadata";

export function getMaxWithdrawalOnKey(key: string): bigint {
    const { amount } = extractKeyMetadata(key)
    return getMaxWithdrawalOnAmount(amount)
}

export function getMaxWithdrawalOnAmount(amount: bigint): bigint {
    const fee = calculateFee(amount)
    return BigInt(amount.toString()) - BigInt(fee.toString())
}