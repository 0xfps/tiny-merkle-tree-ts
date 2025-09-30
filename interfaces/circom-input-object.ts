// All are in their bit form.
export interface CircomInputObject {
    root: BigInt,
    withdrawalKeyNumPart1: BigInt,
    withdrawalKeyNumPart2: BigInt,
    withdrawalKeyNumPart3: BigInt,
    secretKey: BigInt,
    directions: number[],
    validBits: number[],
    proof: string[],
    nullifier: BigInt,
    nullifierHash: BigInt
}