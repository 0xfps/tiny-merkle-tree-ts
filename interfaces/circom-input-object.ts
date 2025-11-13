// All are in their bit form.
export interface CircomInputObject {
    root: bigint,
    withdrawalKeyNumPart1: bigint,
    withdrawalKeyNumPart2: bigint,
    secretKey: bigint,
    directions: number[],
    validBits: number[],
    proof: string[],
    nullifier: bigint,
    nullifierHash: bigint
}