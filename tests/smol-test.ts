import { AbiCoder, keccak256 } from "ethers";
import Tree from "../src";

// This is not an official test.
const coder = AbiCoder.defaultAbiCoder()
let leafs: number[] = [];
for (let i = 0; i < 10000; i++) {
    leafs.push(i)
}

let leaves = leafs.map(function (leaf) {
    const encode = coder.encode(["string"], [leaf.toString()])
    return keccak256(encode)
})

const tree = new Tree(leaves)

let smolLeaf = keccak256(coder.encode(["string"], ["5"]));
const smallProof = tree.generateMerkleProof(smolLeaf)
console.log(smallProof)

console.log(tree.verifyProof(smolLeaf, smallProof))