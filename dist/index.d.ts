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

declare class MiniMerkleTree implements MerkleTreeInterface {
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
    proof: number[][];
    directions: number[];
    validBits: number[];
}

declare function formatForCircom(proof: Proof): CircomProof;

declare function bytesToBits(b: Uint8Array<ArrayBuffer>): number[];

declare function smolPadding(str: string): string;

declare function convertProofToBits(proof: string): number[];

declare const PRIME = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
declare function convertToValidPoseidon(str: string, reverse?: boolean): string;
declare function toNum(s: number[]): BigInt;

export { PRIME, bytesToBits, concatLeaves, convertProofToBits, convertToValidPoseidon, MiniMerkleTree as default, formatForCircom, smolPadding, sortAndConcatLeaves, sortLeavesInAscOrder, toNum };
