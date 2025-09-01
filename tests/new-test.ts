import { poseidon } from "poseidon-hash"
import MiniMerkleTree from "../src/index"

const leaves = [
    '0x10917db11f557031bd807ceea970cf98992f6edc1385dea96407160d98bca333',
    '0x29c82bfe15fc54e39403b0c4550689f3ffb48d657ec8e4dc71edb9e14c12c916',
    '0x10a902f44b73f71fea999d910058b71804786789cc1317a2b5a088a1dfdc86c3',
    '0x081f79c16531c80521c73f3e1968f52eeddab920606f92ad947fc9ba492ce423',
    '0x11e552d65379d197ad7770b7c78ab63941a3591e2ca1ffdf6754da1359881641',
    '0x0eb9638b5baffae054644c2e7ee264d1702768c8ade2fb5123e418f001c13bd3',
    '0x100b858a8791591e34c0394dfbb0e63b088b63099e69f4d2e4cdb4577acccf8e',
    '0x04ce7b2e4f171c394466f48e0736ef25a9eb458b1f379c76bbda1e9ae10c66ef',
    '0x27dbb9c31d2c521fee79daf986df3b1571d08c855b23249e64c309f7d67bf56a',
    '0x0c5f561957cd2f97466d697ac5d4d35ec276a448d6ea09664ace1c3ffc3078c7',
    '0x238a6ebde4b285b41e5f005246b7148f642316a875feb65f49b3d5aec25d553a',
    '0x278335aca76a6e081f152d920c86c033bbe345aaa793895cad4305d0f3fc5fd6',
    '0x2006c6a79104d2343845966852c28749dca88c00c5b6ee695fbf39e7d64c0cfa',
    '0x280f7327832a80b588e2b3bfe125217839fdc4bb224913991904e26a21fe39b0',
    '0x19dca85a35e68248c957931fce2ab85c5e97e156c5aa38137db461c4d33dec98',
    '0x1def06e980e5e2fff51e7f430964dd0eab2d065a3fc8360bc8cde6121ead8cb6'
]

const tree = new MiniMerkleTree(leaves)
// console.log(tree)
console.log(tree.root)
// console.log(tree.generateMerkleProof(leaves[0]))
const proof = tree.generateMerkleProof(leaves[0])
console.log(proof)
console.log(leaves[0] > leaves[1])
console.log(tree.verifyProof(leaves[0], proof))
// console.log(poseidon([leaves[1], leaves[0]]).toString(16))