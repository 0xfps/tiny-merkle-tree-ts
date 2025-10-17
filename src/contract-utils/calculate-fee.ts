export function calculateFee(amount: bigint): bigint {
    const division = BigInt(amount.toString()) / 100n
    const quotient = division.toString().split(".")[0]
    return BigInt(quotient)
}