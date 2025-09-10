import { calculateFee } from "./calculate-fee";
import { extractKeyMetadata } from "./extract-key-metadata";

export function getMaxWithdrawalOnKey(key: string): BigInt {
    const { amount } = extractKeyMetadata(key)
    const fee = calculateFee(amount)
    return BigInt(amount.toString()) - BigInt(fee.toString())
}