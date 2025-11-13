import { MerkleTreeInterface } from "../../interfaces/merkle-tree";
import { strToHex } from "hexyjs";
import { convertProofToBits } from "./convert-proof-leaf-to-bits";
import formatForCircom from "./format-for-circom";
import { hashNums } from "./hash";
import { CircomInputObject } from "../../interfaces/circom-input-object";
import { bitsToNum } from "./bits-to-num";
import { extractKeyMetadata } from "../contract-utils/extract-key-metadata";
import { generateRandomNumber } from "./generate-random-number";

export function getInputObjects(
    withdrawalKey: string,
    standardizedKey: string,
    secretKey: string,
    tree: MerkleTreeInterface
): CircomInputObject {
    const root = bitsToNum(convertProofToBits(tree.root))
    const merkleProof = tree.generateMerkleProof(standardizedKey)
    const { proof, directions, validBits } = formatForCircom(merkleProof)

    const { keyHash, amountU32 } = extractKeyMetadata(withdrawalKey)

    const wKeyBigInt = BigInt(keyHash)
    const amountBigInt = BigInt(amountU32)
    const secretKeyBigInt = BigInt(`0x${strToHex(secretKey)}`)
    
    const nullifier = generateRandomNumber()
    const nullHash = hashNums([nullifier])
    const nullifierHash = bitsToNum(convertProofToBits(nullHash))

    return {
        root,
        withdrawalKeyNumPart1: wKeyBigInt,
        withdrawalKeyNumPart2: amountBigInt,
        secretKey: secretKeyBigInt,
        directions,
        validBits,
        proof,
        nullifier,
        nullifierHash
    }
}