import { poseidon } from "poseidon-hash";
import { extractKeyMetadata } from "../contract-utils/extract-key-metadata";
import { smolPadding } from "./smol-padding";

export function getLeafFromKey(withdrawalKey: string): string {
    const { keyHash, amountU32 } = extractKeyMetadata(withdrawalKey)

    const wKeyBigInt = BigInt(keyHash)
    const amountBigInt = BigInt(amountU32)

    const leafNum = poseidon([wKeyBigInt, amountBigInt])
    const leaf = smolPadding(`0x${leafNum.toString(16)}`)
    return leaf
}