import { MerkleTreeInterface } from "../../interfaces/merkle-tree";
import { Proof } from "../../interfaces/proof";
import { buildTree } from "./build-tree";
import { generateProofForLeaf } from "./generate-proof";
import { verifyMerkleProof } from "./verify-merkle-proof";

export default class TinyMerkleTree implements MerkleTreeInterface {
    tree: string[][]
    root: string
    depth: number

    public constructor(leaves: string[]) {
        const { tree, root, depth } = buildTree(leaves)

        this.tree = tree
        this.root = root
        this.depth = depth
    }

    public generateMerkleProof(leaf: string): Proof {
        return generateProofForLeaf.call(this, leaf)
    }

    public verifyProof(leaf: string, proof: Proof): boolean {
        return verifyMerkleProof(this.root, leaf, proof)
    }

    public getLeavesAtDepth(depth: number): string[] {
        const len = this.tree.length
        if (!len || len <= depth) return []
        return this.tree[depth]
    }
}