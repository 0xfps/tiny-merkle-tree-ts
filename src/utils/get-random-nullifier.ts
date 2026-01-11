import { strToHex } from "hexyjs"
import Randomstring from "randomstring"
import prand from "pure-rand"
import { hexify } from "./hexify"

const LOWER_LIMIT = 1
const UPPER_LIMIT = Number.MAX_SAFE_INTEGER

/**
 * Generates a random number used as the nullifier that goes between
 * 1 and the maximum safe integer in JS/TS, this makes sure that
 * the number generated is always within the PRIME limit and can be
 * used in Circom.
 * 
 * @returns number Nullifier.
 */
export function getRandomNullifier(): number {
    const randomString = Randomstring.generate({
        length: 8,
        charset: ["alphanumeric"]
    })

    const seed = Number(hexify(strToHex(randomString)))

    const rng = prand.xoroshiro128plus(seed)
    const nullifier = prand.unsafeUniformIntDistribution(LOWER_LIMIT, UPPER_LIMIT, rng)

    return nullifier
}