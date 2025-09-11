import { calculateFee } from "./calculate-fee";
import { extractKeyMetadata } from "./extract-key-metadata";

export function getMaxWithdrawalOnKey(key: string): BigInt {
    const { amount } = extractKeyMetadata(key)
    return getMaxWithdrawalOnAmount(amount)
}

export function getMaxWithdrawalOnAmount(amount: BigInt): BigInt {
    const fee = calculateFee(amount)
    return BigInt(amount.toString()) - BigInt(fee.toString())
}