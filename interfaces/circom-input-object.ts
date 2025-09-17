// All are in their bit form.
export interface CircomInputObject {
    root: number[],
    withdrawalKey: number[],
    secretKey: number[],
    directions: number[],
    validBits: number[],
    proof: number[][],
    nullifier: number,
    nullifierHash: number[]
}