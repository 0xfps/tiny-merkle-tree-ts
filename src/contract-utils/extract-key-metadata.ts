import { KeyMetadata } from "../../interfaces/key-metadata";

/// 64 byte key, 128 characters.
/// 130 characters, including 0x, which is added in TS.
/// 0 - 65 : Key Hash, 32 bytes, including 0x.
/// 66 - end : Amount, 32 bytes.

export function extractKeyMetadata(key: string): KeyMetadata {
    // Including 0x, bytes32 stretches to 66 characters.
    const keyHash = key.slice(0, 66)
    const amount = BigInt(`0x${key.slice(66)}`)
    const amountU32 = `0x${key.slice(66)}`

    return { keyHash, amountU32, amount }
}