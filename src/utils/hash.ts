import { poseidon } from "poseidon-hash";
import { smolPadding } from "./smol-padding";

export function hash(leaves: string[]): string {
    return smolPadding(`0x${poseidon(leaves).toString(16)}`)
}