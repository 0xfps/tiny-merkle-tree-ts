import { Proof } from "../../interfaces/proof";
import { sortLeavesInAscOrder } from "../utils/leaf-actions";
import { hash } from "../utils/hash";

export function verifyMerkleProof(root: string, leaf: string, merkleProof: Proof): boolean {
    const { proof, directions } = merkleProof

    let currentHash = leaf
    proof.forEach(function (currentLeaf) {
        currentHash = hash(sortLeavesInAscOrder(currentLeaf, currentHash))
    })

    return currentHash == root
}