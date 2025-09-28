import { poseidon } from "poseidon-hash";
import { extractKeyMetadata } from "../contract-utils/extract-key-metadata";
import { smolPadding } from "./smol-padding";

export function getLeafFromKey(depositKey: string): string {
    const { keyHash, asset, amountU32 } = extractKeyMetadata(depositKey)

    const dKeyBigInt = BigInt(keyHash)
    const assetBigInt = BigInt(asset)
    const amountBigInt = BigInt(amountU32)

    const leafNum = poseidon([dKeyBigInt, assetBigInt, amountBigInt])
    const leaf = smolPadding(`0x${leafNum.toString(16)}`)
    return leaf
}