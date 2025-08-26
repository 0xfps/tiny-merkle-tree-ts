import { Proof } from "../../interfaces/proof";
import { sortLeavesInAscOrder } from "../utils/leaf-actions";
import { hash } from "../utils/hash";

export function verifyMerkleProof(root: string, leaf: string, merkleProof: Proof): boolean {
    const { proof, directions } = merkleProof

    let currentHash = leaf
    proof.forEach(function (currentLeaf, i) {
        if (directions[i]) {
            currentHash = hash(sortLeavesInAscOrder(currentLeaf, currentHash))
        } else currentHash = hash(sortLeavesInAscOrder(currentHash, currentLeaf))
    })

    return currentHash == root
}