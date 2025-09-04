import { Proof } from "../../interfaces/proof";
import { hash } from "../utils/hash";

export function verifyMerkleProof(root: string, leaf: string, merkleProof: Proof): boolean {
    const { proof, directions } = merkleProof
    
    let currentLeaf = leaf
    proof.forEach(function (sibling, i) {
        // if (1) hash(sibling, currentLeaf)
        // if (0) hash(currentLeaf, sibling)
        if (directions[i]) {
            currentLeaf = hash([sibling, currentLeaf])
        } else currentLeaf = hash([currentLeaf, sibling])
    })

    return currentLeaf == root
}