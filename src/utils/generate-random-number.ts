import { strToHex } from "hexyjs"
import Randomstring from "randomstring"
import prand from "pure-rand"
import { PRIME } from "./standardize"

const LOWER_LIMIT = 1_000_000_000_000_000n
const UPPER_LIMIT = PRIME - BigInt(1e9)

export function generateRandomNumber(): BigInt {
    const randomString = Randomstring.generate({
        length: 8,
        charset: ["alphanumeric"]
    })

    const seed = Number(`0x${strToHex(randomString)}`)

    const rng = prand.xoroshiro128plus(seed)
    const randomNumber = prand.unsafeUniformBigIntDistribution(LOWER_LIMIT, UPPER_LIMIT, rng)

    return randomNumber
}