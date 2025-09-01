import { F1Field } from "@zk2/ffjavascript";
import { keccak256 } from "ethers";
import bytesToBits from "./bytes-to-bits";
import { smolPadding } from "./smol-padding";

export const PRIME = 21888242871839275222246405745257275088548364400416034343698204186575808495617n

export function convertToValidPoseidon(str: string, reverse: boolean = false) {
    const hash = keccak256(str)
    const hashBits = reverse ? bytesToBits(new Uint8Array(Buffer.from(hash.slice(2, hash.length), "hex").reverse()))
        : bytesToBits(new Uint8Array(Buffer.from(hash.slice(2, hash.length), "hex")))
    const reduced = new F1Field(PRIME).e(toNum(hashBits))
    return smolPadding(`0x${reduced.toString(16)}`)
}

export function toNum(s: number[]): BigInt {
    let total = 0n;

    for (let i = 0; i < s.length; i++) {
        total += BigInt(s[i]) * (2n ** BigInt(i));
    }

    return total
}