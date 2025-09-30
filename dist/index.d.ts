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

declare class TinyMerkleTree implements MerkleTreeInterface {
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

declare function bytesToBits(bytes: Uint8Array<ArrayBuffer>): number[];

/**
 * Poseidon hash of some numbers, e.g 1 will yield a 31-byte string.
 * This function pads all leaves to 32 bytes before being used in the tree.
 * On the contract, it won't be an issue.
 * Pad up all leaves before calling new TinyMerkleTree and after every hash.
 * Leaves coming from the contract are already 32 byte padded.
 * If the leaf is already complete, nothing happens.
 */
declare function smolPadding(str: string): string;

declare function convertProofToBits(proof: string): number[];

declare const PRIME = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
/**
 * Converts the hash of a given string, usually hex to it's Poseidon field number
 * equivalent. Some hex strings are too large that their hashes cannot fit within
 * the valid field, and this causes bugs when computing merkle trees in Circom.
 *
 * Ideally, the use case of this function is not in the merkle tree, leaves coming
 * in are already standardized from the contract. However, when computing
 * the deposit key, this function will be used to properly calculate the Poseidon
 * equivalent of a given deposit key (str). The equivalent is used as the deposit
 * commitment on the smart contract.
 */
declare function standardizeHashToPoseidon(str: string, reverse?: boolean): string;
declare function standardizeToPoseidon(str: string): string;

declare function bitsToNum(bits: number[]): BigInt;

declare function generateRandomNumber(): bigint;

declare function getRandomNullifier(): number;

declare function hashNums(nums: bigint[] | number[]): string;

interface Keys {
    withdrawalKey: string;
    depositKey: string;
}

declare function generatekeys(asset: string, amount: BigInt, secretKey: string): Keys;
declare function generateDepositKey(withdrawalKey: string, secretKey: string): string;

declare function getMaxWithdrawalOnKey(key: string): BigInt;
declare function getMaxWithdrawalOnAmount(amount: BigInt): BigInt;

interface CircomInputObject {
    root: BigInt;
    withdrawalKeyNumPart1: BigInt;
    withdrawalKeyNumPart2: BigInt;
    withdrawalKeyNumPart3: BigInt;
    secretKey: BigInt;
    directions: number[];
    validBits: number[];
    proof: string[];
    nullifier: BigInt;
    nullifierHash: number[];
}

declare function getInputObjects(withdrawalKey: string, standardizedKey: string, secretKey: string, tree: MerkleTreeInterface): CircomInputObject;

declare function getLeafFromKey(depositKey: string): string;

interface KeyMetadata {
    keyHash: string;
    asset: string;
    amountU32: string;
    amount: BigInt;
}

interface TreeInterface {
    root: string;
    tree: string[][];
    depth: number;
}

export { type CircomInputObject, type CircomProof, type KeyMetadata, type Keys, type MerkleTreeInterface, PRIME, type Proof, type TreeInterface, bitsToNum, bytesToBits, concatLeaves, convertProofToBits, TinyMerkleTree as default, formatForCircom, generateDepositKey, generateRandomNumber, generatekeys, getInputObjects, getLeafFromKey, getMaxWithdrawalOnAmount, getMaxWithdrawalOnKey, getRandomNullifier, hashNums, smolPadding, sortAndConcatLeaves, sortLeavesInAscOrder, standardizeHashToPoseidon, standardizeToPoseidon };
