import { AbiCoder, keccak256 } from "ethers";
import Tree, { formatForCircom } from "../src";
import { poseidon } from "poseidon-hash";
import { smolPadding } from "../src/utils/smol-padding";

// This is not an official test.
const coder = AbiCoder.defaultAbiCoder()
let leafs: number[] = [];
for (let i = 0; i < 2; i++) {
    leafs.push(i)
}

let leaves = leafs.map(function (leaf) {
    const encode = coder.encode(["string"], [leaf.toString()])
    return smolPadding(`0x${poseidon([keccak256(encode)]).toString(16)}`)
})

const tree = new Tree(leaves)

// try {
//     let smolLeaf = smolPadding(`0x${poseidon([keccak256(coder.encode(["string"], ["50"]))]).toString(16)}`)
//     tree.generateMerkleProof(smolLeaf)
// } catch {
//     console.log('Leaf 50 not in tree!')
// }

console.log({ tree })

let smolLeaf = smolPadding(`0x${poseidon([keccak256(coder.encode(["string"], ["1"]))]).toString(16)}`)
const smallProof = tree.generateMerkleProof(smolLeaf)

console.log(smallProof)

console.log(tree.verifyProof(smolLeaf, smallProof))
// console.log(formatForCircom(smallProof))

console.log(BigInt(smallProof.proof[0]))

const bitProof = formatForCircom(smallProof).proof[0]
console.log({ bitProof })

let num = 0n
for (let i = 0; i < 256; i++) {
    num += BigInt(bitProof[i]) * (2n ** BigInt(i));
}

console.log(num)