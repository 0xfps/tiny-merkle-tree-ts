import { KeyMetadata } from "../../interfaces/key-metadata";

/// 84 byte key, 168 characters.
/// 170 characters, including 0x, which is added in TS.
/// 0 - 65 : Key Hash, 32 bytes, including 0x.
/// 66 - 105 : Address, 20 bytes.
/// 106 - end : Amount, 32 bytes.

export function extractKeyMetadata(key: string): KeyMetadata {
    // Including 0x, bytes32 stretches to 66 characters.
    const keyHash = key.slice(0, 66)
    const asset = `0x${key.slice(66, 106)}`
    const amount = BigInt(`0x${key.slice(106)}`)

    return { keyHash, asset, amount }
}