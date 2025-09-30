import { poseidon } from "poseidon-hash";
import { smolPadding } from "./smol-padding";

export function hash(leaves: string[]): string {
    return smolPadding(`0x${poseidon(leaves).toString(16)}`)
}

export function hashNums(nums: bigint[] | number[]): string {
    return smolPadding(`0x${poseidon(nums).toString(16)}`)
}