export function sortLeavesInAscOrder(leaf1: string, leaf2: string): [string, string] {
    return (leaf1 < leaf2) ? [leaf1, leaf2] : [leaf2, leaf1]
}

export function concatLeaves(leaf1: string, leaf2: string): string {
    return Buffer.concat([
        Buffer.from(leaf1),
        Buffer.from(leaf2.slice(2))
    ]).toString();
}

// If leaf1 is less than leaf2, the dir should be 0, meaning it comes first.
// Else, dir is 1, meaning it comes after. This will be needed for Circom.
export function getLeafDir(leaf1: string, leaf2: string) {
    return leaf1 < leaf2 ? 0 : 1;
}

export default function sortAndConcatLeaves(leaf1: string, leaf2: string): string {
    const [firstLeaf, secondLeaf] = sortLeavesInAscOrder(leaf1, leaf2)
    return concatLeaves(firstLeaf, secondLeaf)
}