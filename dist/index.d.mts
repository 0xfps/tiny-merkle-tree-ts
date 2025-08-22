interface Proof {
    proof: string[];
    directions: number[];
}

interface MerkleTreeInterface {
    root: string;
    tree: string[][];
    depth: number;
    getLeavesAtDepth: (depth: number) => string[];
    generateMerkleProof: (leaf: string) => Proof;
    verifyProof: (leaf: string, proof: Proof) => boolean;
}

declare class Tree implements MerkleTreeInterface {
    tree: string[][];
    root: string;
    depth: number;
    constructor(leaves: string[]);
    generateMerkleProof(leaf: string): Proof;
    verifyProof(leaf: string, proof: Proof): boolean;
    getLeavesAtDepth(depth: number): string[];
}

declare function sortLeavesInAscOrder(leaf1: string, leaf2: string): [string, string];
declare function concatLeaves(leaf1: string, leaf2: string): string;
declare function sortAndConcatLeaves(leaf1: string, leaf2: string): string;

interface CircomProof {
    proof: string[];
    directions: number[];
    validBits: number[];
}

declare function formatForCircom(proof: Proof): CircomProof;

export { concatLeaves, Tree as default, formatForCircom, sortAndConcatLeaves, sortLeavesInAscOrder };
