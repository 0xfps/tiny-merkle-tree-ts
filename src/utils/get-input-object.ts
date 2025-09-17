import { MerkleTreeInterface } from "../../interfaces/merkle-tree";
import { strToHex } from "hexyjs";
import { convertProofToBits } from "./convert-proof-leaf-to-bits";
import formatForCircom from "./format-for-circom";
import bytesToBits from "./bytes-to-bits";
import { getRandomNullifier } from "./get-random-nullifier";
import { hashNums } from "./hash";
import { CircomInputObject } from "../../interfaces/circom-input-object";

export function getInputObjects(
    withdrawalKey: string,
    standardizedKey: string,
    secretKey: string,
    tree: MerkleTreeInterface
): CircomInputObject {
    const root = convertProofToBits(tree.root)
    const merkleProof = tree.generateMerkleProof(standardizedKey)
    const { proof, directions, validBits } = formatForCircom(merkleProof)

    const withdrawalKeyBits = bytesToBits(new Uint8Array(Buffer.from(withdrawalKey.slice(2), "hex")))
    const secretKeyBits = bytesToBits(new Uint8Array(Buffer.from(strToHex(secretKey), "hex")))
    
    const nullifier = getRandomNullifier()
    const nullHash = hashNums([nullifier])
    const nullifierHash = convertProofToBits(nullHash)

    return {
        root,
        withdrawalKey: withdrawalKeyBits,
        secretKey: secretKeyBits,
        directions,
        validBits,
        proof,
        nullifier,
        nullifierHash
    }
}