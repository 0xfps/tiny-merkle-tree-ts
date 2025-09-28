import { Keys } from "../../interfaces/keys";
import { generateRandomNumber } from "../utils/generate-random-number";
import { smolPadding } from "../utils/smol-padding";
import { hexify } from "../utils/hexify";
import { strToHex } from "hexyjs";
import { makeEven } from "../utils/make-even";
import { extractKeyMetadata } from "./extract-key-metadata";
import { poseidon } from "poseidon-hash";

export function generatekeys(asset: string, amount: BigInt, secretKey: string): Keys {
    const withdrawalKey = generateWithdrawalKey(asset, amount, secretKey)
    const depositKey = generateDepositKey(withdrawalKey, secretKey)

    return { withdrawalKey, depositKey }
}

function generateWithdrawalKey(asset: string, amount: BigInt, secretKey: string): string {
    const entropy = makeEven(generateRandomNumber().toString(16))
    const hexSecretKey = strToHex(secretKey)

    const entropyBigInt = BigInt(hexify(entropy))
    const secretKeyBigInt = BigInt(hexify(hexSecretKey))
    const withdrawalKeyPoseidonFieldEquiv = poseidon([entropyBigInt, secretKeyBigInt])
    const withdrawalKeyPoseidonFieldEquivHexString = `0x${withdrawalKeyPoseidonFieldEquiv.toString(16)}`
    const withdrawalKeyHash = smolPadding(withdrawalKeyPoseidonFieldEquivHexString)

    const withdrawalKey = `${withdrawalKeyHash}${_encodePackAsset(asset)}${_encodePackAmount(amount)}`
    return withdrawalKey
}

export function generateDepositKey(withdrawalKey: string, secretKey: string): string {
    const { keyHash, asset, amount, amountU32 } = extractKeyMetadata(withdrawalKey)
    const hexSecretKey = strToHex(secretKey)
    const hexSecretKeyNum = BigInt(hexify(hexSecretKey))

    const depositKeyPosHash = poseidon([BigInt(keyHash), BigInt(asset), BigInt(amountU32), hexSecretKeyNum])
    const depositKeyHash = smolPadding(`0x${depositKeyPosHash.toString(16)}`)

    const depositKey = `${depositKeyHash}${_encodePackAsset(asset)}${_encodePackAmount(amount)}`
    return depositKey
}

function _encodePackAsset(asset: string): string {
    return asset.slice(2)
}

function _encodePackAmount(amount: BigInt): string {
    const hexAmount = hexify(amount.toString(16))
    const encodePackAmount = smolPadding(hexAmount).slice(2)
    return encodePackAmount
}