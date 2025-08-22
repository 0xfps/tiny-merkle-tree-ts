import { keccak256 } from "ethers";
import Tree from ".";
import { Proof } from "../../interfaces/proof";
import sortAndConcatLeaves, { getLeafDir } from "../utils/leaf-actions";
import assert from "node:assert/strict"

export function generateProofForLeaf(this: Tree, leaf: string): Proof {
    const { tree } = this
    let currentLeaf = leaf;
    let treeWithoutRoot = tree.slice(1, tree.length)
    let lenTreeWithNoRoot = treeWithoutRoot.length

    // If the leaf we're looking for is at any point not in
    if (treeWithoutRoot[lenTreeWithNoRoot - 1].indexOf(leaf) == -1) {
        throw new Error("Leaf not in tree!")
    }

    const proof: string[] = []
    const directions: number[] = []

    // Start from the last i.e. depth 0 leaves, iterate back.
    for (let i = lenTreeWithNoRoot - 1; i >= 0; i--) {
        const leavesAtDepth = treeWithoutRoot[i]
        let siblingLeaf: string

        // If the number of leaves at this depth is even, all can be paired
        // with one another.
        // Everyone has a pair, group normally.
        // This returns the leaf pair for the current leaf at this depth
        // and also returns the leaves that make up this pair.
        if (leavesAtDepth.length % 2 == 0) {
            siblingLeaf = getSiblingLeaf(leavesAtDepth, currentLeaf)
        } else {
            // Based on the algorithm of the three construction, lone leaves after
            // grouping an odd number of leaves, e.g. 7 => [2, 2, 2, 1] are taken
            // up until they can complete a depth, i.e. make it even. If the depth
            // is odd current leaf is the last leaf in the depth, do nothing.
            if (leavesAtDepth.indexOf(currentLeaf) == leavesAtDepth.length - 1)
                continue
            else {
                // If it's not the last, then, I can comfortably group.
                // I already know the depth has an odd number of leaves,
                // whatever is between index 0 and length - 2 can be grouped.
                siblingLeaf = getSiblingLeaf(leavesAtDepth, currentLeaf)
            }
        }

        // Here, I get the direction of the leaves, it doesn't matter the order.
        // 0 meaning that the current leaf will go in front, and 1 meaning that
        // it goes behind. It's for the currentLeaf with respect to siblingLeaf.
        directions.push(getLeafDir(siblingLeaf, currentLeaf))
        proof.push(siblingLeaf)

        // Get the next hash using the two leaves.
        currentLeaf = keccak256(sortAndConcatLeaves(currentLeaf, siblingLeaf));
    }

    // The number of leaves in the proof MUST be equal to the number of directions.
    assert.equal(proof.length, directions.length)
    return { proof, directions }
}

function getSiblingLeaf(leaves: string[], leaf: string) {
    const indexOfLeaf = leaves.indexOf(leaf)

    let leafSibling

    // Leaf grouping is done in such a way: [0, 1], [2, 3].
    // Even indexes have the next leaf as their sibling.
    // Odd indexes have the previous leaf as their sibling.
    if (indexOfLeaf % 2 == 0) leafSibling = leaves[indexOfLeaf + 1]
    else leafSibling = leaves[indexOfLeaf - 1]

    return leafSibling
}