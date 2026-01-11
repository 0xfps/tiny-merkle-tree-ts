import { poseidon } from "poseidon-hash";
import { smolPadding } from "./smol-padding";
import { hexify } from "./hexify";

export function hash(leaves: string[]): string {
    return smolPadding(hexify(poseidon(leaves).toString(16)))
}

export function hashNums(nums: bigint[] | number[]): string {
    return smolPadding(hexify(poseidon(nums).toString(16)))
}