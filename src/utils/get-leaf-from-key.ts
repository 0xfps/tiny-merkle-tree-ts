import { poseidon } from "poseidon-hash";
import { extractKeyMetadata } from "../contract-utils/extract-key-metadata";
import { smolPadding } from "./smol-padding";

export function getLeafFromKey(depositKey: string): string {
    const { keyHash, amountU32 } = extractKeyMetadata(depositKey)

    const dKeyBigInt = BigInt(keyHash)
    const amountBigInt = BigInt(amountU32)

    const leafNum = poseidon([dKeyBigInt, amountBigInt])
    const leaf = smolPadding(`0x${leafNum.toString(16)}`)
    return leaf
}