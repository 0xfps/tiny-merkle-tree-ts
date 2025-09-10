import { keccak256 } from "ethers";
import { Keys } from "../../interfaces/keys";
import { generateRandomNumber } from "../utils/generate-random-number";
import { smolPadding } from "../utils/smol-padding";
import { hexify } from "../utils/hexify";
import { strToHex } from "hexyjs";
import { makeEven } from "../utils/make-even";

export function generatekeys(asset: string, amount: number, secretKey: string): Keys {
    const entropy = makeEven(generateRandomNumber().toString(16))

    const hexAmount = hexify(amount.toString(16))
    const hexSecretKey = strToHex(secretKey)

    const withdrawalKeyHash = keccak256(`${hexify(entropy)}${hexSecretKey}`)
    const encodePackAsset = asset.slice(2)
    const encodePackAmount = smolPadding(hexAmount).slice(2)

    const withdrawalKey = `${withdrawalKeyHash}${encodePackAsset}${encodePackAmount}`

    const withdrawalKeyConcat = `${withdrawalKey}${hexSecretKey}`
    const depositKeyHash = keccak256(withdrawalKeyConcat)
    
    const depositKey = `${depositKeyHash}${encodePackAsset}${encodePackAmount}`

    return { withdrawalKey, depositKey }
}