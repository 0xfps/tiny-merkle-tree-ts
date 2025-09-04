import { F1Field } from "@zk2/ffjavascript";
import { keccak256 } from "ethers";
import bytesToBits from "./bytes-to-bits";
import { smolPadding } from "./smol-padding";
import { toNum } from "./bits-to-num";

// Circom standard prime, used for Poseidon hash and Finite Field calculations.
// Reference: https://docs.circom.io/circom-language/basic-operators/
export const PRIME = 21888242871839275222246405745257275088548364400416034343698204186575808495617n

/**
 * Converts the hash of a given string, usually hex to it's Poseidon field number
 * equivalent. Some hex strings are too large that their hashes cannot fit within
 * the valid field, and this causes bugs when computing merkle trees in Circom.
 * 
 * Ideally, the use case of this function is not in the merkle tree, leaves coming
 * in are already standardized from the contract. However, when computing
 * the deposit key, this function will be used to properly calculate the Poseidon
 * equivalent of a given deposit key (str). The equivalent is used as the deposit
 * commitment on the smart contract.
 */
export function standardizeToPoseidon(str: string, reverse: boolean = false): string {
    const hash = keccak256(str)
    const hashBits = reverse ? bytesToBits(new Uint8Array(Buffer.from(hash.slice(2, hash.length), "hex").reverse()))
        : bytesToBits(new Uint8Array(Buffer.from(hash.slice(2, hash.length), "hex")))
    const reduced = new F1Field(PRIME).e(toNum(hashBits))
    return smolPadding(`0x${reduced.toString(16)}`)
}