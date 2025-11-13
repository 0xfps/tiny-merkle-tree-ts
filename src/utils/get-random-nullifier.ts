import { strToHex } from "hexyjs"
import Randomstring from "randomstring"
import prand from "pure-rand"

const LOWER_LIMIT = 1
const UPPER_LIMIT = Number.MAX_SAFE_INTEGER

export function getRandomNullifier(): number {
    const randomString = Randomstring.generate({
        length: 8,
        charset: ["alphanumeric"]
    })

    const seed = Number(`0x${strToHex(randomString)}`)

    const rng = prand.xoroshiro128plus(seed)
    const nullifier = prand.unsafeUniformIntDistribution(LOWER_LIMIT, UPPER_LIMIT, rng)

    return nullifier
}