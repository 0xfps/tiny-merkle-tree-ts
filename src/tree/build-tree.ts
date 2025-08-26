import { sha256 } from "ethers";
import { TreeInterface } from "../../interfaces/tree";
import sortAndConcatLeaves from "../utils/leaf-actions";

export function buildTree(leaves: string[]): TreeInterface {
    if (leaves.length < 2) throw new Error("Tree must be built with at least 2 leaves!")

    // Start tree with all the leaves.
    let tree = [leaves];
    let length = leaves.length;

    // All depths are stored in separate arrays.
    // [[depth(n+1) or root], [depth(n)], ..., [depth0]].
    // New leaves for new depths are recomputed based off of the
    // previous ones.
    while (length >= 2) {
        let concatLeaves: string;
        const hashedPairs: string[] = []

        // When length == 2, which will eventually be so given
        // the division applied at the end, it is the last two
        // leaves to yield the root.
        if (length == 2) {
            concatLeaves = sortAndConcatLeaves(leaves[0], leaves[1]);
            hashedPairs.push(sha256(concatLeaves));
            tree.unshift(hashedPairs);
            break;
        }

        // Iterate over the leaves in the array.
        // length will always match leaves [ at depth].length;
        // This loop runs in a way that if there's an extra leaf after
        // grouping, it's not touched here.
        for (let i = 0; i < length - 1; i += 2) {
            concatLeaves = sortAndConcatLeaves(leaves[i], leaves[i + 1])
            hashedPairs.push(sha256(concatLeaves));
        }

        // The leaf not touched in the loop as a result of the depth leaves being
        // odd is simply moved to the next one.
        if (length % 2 == 1) hashedPairs.push(leaves[length - 1])

        // New leaf depths are stored in front.
        tree.unshift(hashedPairs)
        leaves = hashedPairs

        length = Math.floor((length + 1) / 2)
    }

    const treeStructure: TreeInterface = {
        tree,
        root: tree[0][0],
        depth: tree.length,
    }

    return treeStructure
}