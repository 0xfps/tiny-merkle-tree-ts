import { FeeStructure } from "../../interfaces/fee"

// 0.7% on every deposit.
const FEE_BPS = 70n
const PERCENTAGE_BASE = 100n

// From the 0.7%;
// 65% goes to collector.
// 35% goes to the guardian fee collector.
const COLLECTOR_BPS = 65n

export function calculateFee(amount: bigint): bigint {
    const division = BigInt((amount * FEE_BPS).toString()) / PERCENTAGE_BASE
    const quotient = division.toString().split(".")[0]
    return BigInt(quotient)
}

export function splitFee(amount: bigint): FeeStructure {
    const fee = calculateFee(amount)
    const collectorFee = (fee * COLLECTOR_BPS) / PERCENTAGE_BASE
    const guardianFee = fee - collectorFee

    return { collectorFee, guardianFee }
}