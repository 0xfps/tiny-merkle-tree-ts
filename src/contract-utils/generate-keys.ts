import { keccak256 } from "ethers";
import { Keys } from "../../interfaces/keys";
import { generateRandomNumber } from "../utils/generate-random-number";
import { smolPadding } from "../utils/smol-padding";
import { hexify } from "../utils/hexify";
import { strToHex } from "hexyjs";
import { makeEven } from "../utils/make-even";
import { extractKeyMetadata } from "./extract-key-metadata";

export function generatekeys(asset: string, amount: BigInt, secretKey: string): Keys {
    const withdrawalKey = generateWithdrawalKey(asset, amount, secretKey)
    const depositKey = generateDepositKey(withdrawalKey, secretKey)

    return { withdrawalKey, depositKey }
}

function generateWithdrawalKey(asset: string, amount: BigInt, secretKey: string): string {
    const entropy = makeEven(generateRandomNumber().toString(16))
    const hexSecretKey = strToHex(secretKey)

    const withdrawalKeyHash = keccak256(`${hexify(entropy)}${hexSecretKey}`)

    const withdrawalKey = `${withdrawalKeyHash}${_encodePackAsset(asset)}${_encodePackAmount(amount)}`
    return withdrawalKey
}

export function generateDepositKey(withdrawalKey: string, secretKey: string): string {
    const { asset, amount } = extractKeyMetadata(withdrawalKey)
    const hexSecretKey = strToHex(secretKey)
    const withdrawalKeyConcat = `${withdrawalKey}${hexSecretKey}`
    const depositKeyHash = keccak256(withdrawalKeyConcat)

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