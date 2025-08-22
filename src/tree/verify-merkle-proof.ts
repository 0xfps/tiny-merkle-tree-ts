import { keccak256 } from "ethers";
import { Proof } from "../../interfaces/proof";
import sortAndConcatLeaves from "../utils/leaf-actions";

export function verifyMerkleProof(root: string, leaf: string, merkleProof: Proof): boolean {
    const { proof, directions } = merkleProof

    let currentHash = leaf
    proof.forEach(function (currentLeaf, i) {
        if (directions[i]) {
            currentHash = keccak256(sortAndConcatLeaves(currentLeaf, currentHash))
        } else currentHash = keccak256(sortAndConcatLeaves(currentHash, currentLeaf))
    })

    return currentHash == root
}