import { poseidon } from "poseidon-hash";

export function hash(leaves: string[]): string {
    return `0x${poseidon(leaves).toString(16)}`
}