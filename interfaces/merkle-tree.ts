import { Proof } from "./proof"

export interface MerkleTreeInterface {
    root: string
    tree: string[][]
    depth: number
    getLeavesAtDepth: (depth: number) => string[]
    generateMerkleProof: (leaf: string) => Proof
    verifyProof: (leaf: string, proof: Proof) => boolean
}