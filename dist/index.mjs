// src/utils/smol-padding.ts
function smolPadding(str) {
  if (str.length > 66) throw new Error("Expected a bytes32 string.");
  const lenRem = 64 - (str.length - 2);
  const pad0 = "0".repeat(lenRem);
  return `0x${pad0}${str.slice(2)}`;
}

// src/utils/leaf-actions.ts
function sortLeavesInAscOrder(leaf1, leaf2) {
  return leaf1 < leaf2 ? [smolPadding(leaf1), smolPadding(leaf2)] : [smolPadding(leaf2), smolPadding(leaf1)];
}
function concatLeaves(leaf1, leaf2) {
  return Buffer.concat([
    Buffer.from(leaf1),
    Buffer.from(leaf2.slice(2))
  ]).toString();
}
function getLeafDir(leaf1, leaf2) {
  return leaf1 < leaf2 ? 0 : 1;
}
function sortAndConcatLeaves(leaf1, leaf2) {
  const [firstLeaf, secondLeaf] = sortLeavesInAscOrder(leaf1, leaf2);
  return concatLeaves(firstLeaf, secondLeaf);
}

// src/utils/hash.ts
import { poseidon } from "poseidon-hash";
function hash(leaves) {
  return smolPadding(`0x${poseidon(leaves).toString(16)}`);
}
function hashNums(nums) {
  return smolPadding(`0x${poseidon(nums).toString(16)}`);
}

// src/tree/build-tree.ts
function buildTree(leaves) {
  if (leaves.length < 2) throw new Error("Tree must be built with at least 2 leaves!");
  let tree = [leaves];
  let length = leaves.length;
  while (length >= 2) {
    let sortedLeaves;
    const hashedPairs = [];
    if (length == 2) {
      sortedLeaves = sortLeavesInAscOrder(leaves[0], leaves[1]);
      hashedPairs.push(hash(sortedLeaves));
      tree.unshift(hashedPairs);
      break;
    }
    for (let i = 0; i < length - 1; i += 2) {
      sortedLeaves = sortLeavesInAscOrder(leaves[i], leaves[i + 1]);
      hashedPairs.push(hash(sortedLeaves));
    }
    if (length % 2 == 1) hashedPairs.push(leaves[length - 1]);
    tree.unshift(hashedPairs);
    leaves = hashedPairs;
    length = Math.floor((length + 1) / 2);
  }
  const treeStructure = {
    tree,
    root: tree[0][0],
    depth: tree.length
  };
  return treeStructure;
}

// src/tree/generate-proof.ts
import assert from "assert/strict";
function generateProofForLeaf(leaf) {
  const { tree } = this;
  let currentLeaf = leaf;
  let treeWithoutRoot = tree.slice(1);
  let lenTreeWithNoRoot = treeWithoutRoot.length;
  if (treeWithoutRoot[lenTreeWithNoRoot - 1].indexOf(leaf) == -1) {
    throw new Error("Leaf not in tree!");
  }
  const proof = [];
  const directions = [];
  for (let i = lenTreeWithNoRoot - 1; i >= 0; i--) {
    const leavesAtDepth = treeWithoutRoot[i];
    let siblingLeaf;
    if (leavesAtDepth.length % 2 == 0) {
      siblingLeaf = getSiblingLeaf(leavesAtDepth, currentLeaf);
    } else {
      if (leavesAtDepth.indexOf(currentLeaf) == leavesAtDepth.length - 1)
        continue;
      else {
        siblingLeaf = getSiblingLeaf(leavesAtDepth, currentLeaf);
      }
    }
    directions.push(getLeafDir(currentLeaf, siblingLeaf));
    proof.push(siblingLeaf);
    currentLeaf = hash(sortLeavesInAscOrder(currentLeaf, siblingLeaf));
  }
  assert.equal(proof.length, directions.length);
  return { proof, directions };
}
function getSiblingLeaf(leaves, leaf) {
  const indexOfLeaf = leaves.indexOf(leaf);
  let leafSibling;
  if (indexOfLeaf % 2 == 0) leafSibling = leaves[indexOfLeaf + 1];
  else leafSibling = leaves[indexOfLeaf - 1];
  return leafSibling;
}

// src/tree/verify-merkle-proof.ts
function verifyMerkleProof(root, leaf, merkleProof) {
  const { proof, directions } = merkleProof;
  let currentLeaf = leaf;
  proof.forEach(function(sibling, i) {
    if (directions[i]) {
      currentLeaf = hash([sibling, currentLeaf]);
    } else currentLeaf = hash([currentLeaf, sibling]);
  });
  return currentLeaf == root;
}

// src/tree/index.ts
var TinyMerkleTree = class {
  tree;
  root;
  depth;
  constructor(leaves) {
    const { tree, root, depth } = buildTree(leaves);
    this.tree = tree;
    this.root = root;
    this.depth = depth;
  }
  generateMerkleProof(leaf) {
    return generateProofForLeaf.call(this, leaf);
  }
  verifyProof(leaf, proof) {
    return verifyMerkleProof(this.root, leaf, proof);
  }
  getLeavesAtDepth(depth) {
    const len = this.tree.length;
    if (!len || len <= depth) return [];
    return this.tree[depth];
  }
};

// src/utils/format-for-circom.ts
import { encodeBytes32String } from "ethers";

// src/utils/bytes-to-bits.ts
function bytesToBits(bytes) {
  const bits = [];
  for (let i = 0; i < bytes.length; i++) {
    for (let j = 0; j < 8; j++) {
      if ((Number(bytes[i]) & 1 << j) > 0) {
        bits.push(1);
      } else {
        bits.push(0);
      }
    }
  }
  return bits;
}

// src/utils/convert-proof-leaf-to-bits.ts
function convertProofToBits(proof) {
  const hexProof = proof.slice(2);
  const uint8Array = new Uint8Array(Buffer.from(hexProof, "hex").reverse());
  return bytesToBits(uint8Array);
}

// src/utils/bits-to-num.ts
function bitsToNum(bits) {
  let total = 0n;
  for (let i = 0; i < bits.length; i++) {
    total += BigInt(bits[i]) * 2n ** BigInt(i);
  }
  return total;
}

// src/utils/format-for-circom.ts
function formatForCircom(proof) {
  if (proof.proof.length > 32) throw new Error("Proof length exceeds 32!");
  const length = proof.directions.length;
  const lengthTo32 = 32 - length;
  const validBits = [];
  const proofs = [];
  proof.directions.forEach(function(_, index) {
    proofs.push(bitsToNum(convertProofToBits(proof.proof[index])).toString());
    validBits.push(1);
  });
  for (let i = 0; i < lengthTo32; i++) {
    proofs.push(bitsToNum(convertProofToBits(encodeBytes32String(""))).toString());
    proof.directions.push(0);
    validBits.push(0);
  }
  const circomProof = {
    proof: proofs,
    directions: proof.directions,
    validBits
  };
  return circomProof;
}

// src/utils/standardize.ts
import { F1Field } from "@zk2/ffjavascript";
import { keccak256 } from "ethers";
var PRIME = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
function standardizeHashToPoseidon(str, reverse = false) {
  const hash2 = keccak256(str);
  const hashBits = reverse ? bytesToBits(new Uint8Array(Buffer.from(hash2.slice(2), "hex").reverse())) : bytesToBits(new Uint8Array(Buffer.from(hash2.slice(2), "hex")));
  const reduced = new F1Field(PRIME).e(bitsToNum(hashBits));
  return smolPadding(`0x${reduced.toString(16)}`);
}
function standardizeToPoseidon(str) {
  const uint8Array = new Uint8Array(Buffer.from(str.slice(2), "hex"));
  const bigNumber = bitsToNum(bytesToBits(uint8Array));
  const reduced = new F1Field(PRIME).e(bigNumber);
  return smolPadding(`0x${reduced.toString(16)}`);
}

// src/utils/generate-random-number.ts
import { strToHex } from "hexyjs";
import Randomstring from "randomstring";
import prand from "pure-rand";
var LOWER_LIMIT = 1000000000000000n;
var UPPER_LIMIT = PRIME - BigInt(1e9);
function generateRandomNumber() {
  const randomString = Randomstring.generate({
    length: 8,
    charset: ["alphanumeric"]
  });
  const seed = Number(`0x${strToHex(randomString)}`);
  const rng = prand.xoroshiro128plus(seed);
  const randomNumber = prand.unsafeUniformBigIntDistribution(LOWER_LIMIT, UPPER_LIMIT, rng);
  return randomNumber;
}

// src/utils/get-random-nullifier.ts
import { strToHex as strToHex2 } from "hexyjs";
import Randomstring2 from "randomstring";
import prand2 from "pure-rand";
var LOWER_LIMIT2 = 1;
var UPPER_LIMIT2 = Number.MAX_SAFE_INTEGER;
function getRandomNullifier() {
  const randomString = Randomstring2.generate({
    length: 8,
    charset: ["alphanumeric"]
  });
  const seed = Number(`0x${strToHex2(randomString)}`);
  const rng = prand2.xoroshiro128plus(seed);
  const nullifier = prand2.unsafeUniformIntDistribution(LOWER_LIMIT2, UPPER_LIMIT2, rng);
  return nullifier;
}

// src/utils/hexify.ts
function hexify(str) {
  return `0x${str}`;
}

// src/contract-utils/generate-keys.ts
import { strToHex as strToHex3 } from "hexyjs";

// src/utils/make-even.ts
function makeEven(str) {
  return str.length % 2 == 1 ? `0${str}` : str;
}

// src/contract-utils/extract-key-metadata.ts
function extractKeyMetadata(key) {
  const keyHash = key.slice(0, 66);
  const amount = BigInt(`0x${key.slice(66)}`);
  const amountU32 = `0x${key.slice(66)}`;
  return { keyHash, amountU32, amount };
}

// src/contract-utils/generate-keys.ts
import { poseidon as poseidon2 } from "poseidon-hash";
function generatekeys(amount, secretKey) {
  const withdrawalKey = generateWithdrawalKey(amount, secretKey);
  const depositKey = generateDepositKey(withdrawalKey, secretKey);
  return { withdrawalKey, depositKey };
}
function generateWithdrawalKey(amount, secretKey) {
  const entropy = makeEven(generateRandomNumber().toString(16));
  const hexSecretKey = strToHex3(secretKey);
  const entropyBigInt = BigInt(hexify(entropy));
  const secretKeyBigInt = BigInt(hexify(hexSecretKey));
  const withdrawalKeyPoseidonFieldEquiv = poseidon2([entropyBigInt, secretKeyBigInt]);
  const withdrawalKeyPoseidonFieldEquivHexString = `0x${withdrawalKeyPoseidonFieldEquiv.toString(16)}`;
  const withdrawalKeyHash = smolPadding(withdrawalKeyPoseidonFieldEquivHexString);
  const withdrawalKey = `${withdrawalKeyHash}${_encodePackAmount(amount)}`;
  return withdrawalKey;
}
function generateDepositKey(withdrawalKey, secretKey) {
  const { keyHash, amount, amountU32 } = extractKeyMetadata(withdrawalKey);
  const hexSecretKey = strToHex3(secretKey);
  const hexSecretKeyNum = BigInt(hexify(hexSecretKey));
  const depositKeyPosHash = poseidon2([BigInt(keyHash), BigInt(amountU32), hexSecretKeyNum]);
  const depositKeyHash = smolPadding(`0x${depositKeyPosHash.toString(16)}`);
  const depositKey = `${depositKeyHash}${_encodePackAmount(amount)}`;
  return depositKey;
}
function _encodePackAmount(amount) {
  const hexAmount = hexify(amount.toString(16));
  const encodePackAmount = smolPadding(hexAmount).slice(2);
  return encodePackAmount;
}

// src/contract-utils/calculate-fee.ts
function calculateFee(amount) {
  const division = BigInt(amount.toString()) / 100n;
  const quotient = division.toString().split(".")[0];
  return BigInt(quotient);
}

// src/contract-utils/max-withdrawal.ts
function getMaxWithdrawalOnKey(key) {
  const { amount } = extractKeyMetadata(key);
  return getMaxWithdrawalOnAmount(amount);
}
function getMaxWithdrawalOnAmount(amount) {
  const fee = calculateFee(amount);
  return BigInt(amount.toString()) - BigInt(fee.toString());
}

// src/utils/get-input-object.ts
import { strToHex as strToHex4 } from "hexyjs";
function getInputObjects(withdrawalKey, standardizedKey, secretKey, tree) {
  const root = bitsToNum(convertProofToBits(tree.root));
  const merkleProof = tree.generateMerkleProof(standardizedKey);
  const { proof, directions, validBits } = formatForCircom(merkleProof);
  const { keyHash, amountU32 } = extractKeyMetadata(withdrawalKey);
  const wKeyBigInt = BigInt(keyHash);
  const amountBigInt = BigInt(amountU32);
  const secretKeyBigInt = BigInt(`0x${strToHex4(secretKey)}`);
  const nullifier = generateRandomNumber();
  const nullHash = hashNums([nullifier]);
  const nullifierHash = bitsToNum(convertProofToBits(nullHash));
  return {
    root,
    withdrawalKeyNumPart1: wKeyBigInt,
    withdrawalKeyNumPart2: amountBigInt,
    secretKey: secretKeyBigInt,
    directions,
    validBits,
    proof,
    nullifier,
    nullifierHash
  };
}

// src/utils/get-leaf-from-key.ts
import { poseidon as poseidon3 } from "poseidon-hash";
function getLeafFromKey(depositKey) {
  const { keyHash, amountU32 } = extractKeyMetadata(depositKey);
  const dKeyBigInt = BigInt(keyHash);
  const amountBigInt = BigInt(amountU32);
  const leafNum = poseidon3([dKeyBigInt, amountBigInt]);
  const leaf = smolPadding(`0x${leafNum.toString(16)}`);
  return leaf;
}

// src/index.ts
var index_default = TinyMerkleTree;
export {
  PRIME,
  bitsToNum,
  bytesToBits,
  concatLeaves,
  convertProofToBits,
  index_default as default,
  extractKeyMetadata,
  formatForCircom,
  generateDepositKey,
  generateRandomNumber,
  generatekeys,
  getInputObjects,
  getLeafFromKey,
  getMaxWithdrawalOnAmount,
  getMaxWithdrawalOnKey,
  getRandomNullifier,
  hashNums,
  hexify,
  smolPadding,
  sortAndConcatLeaves,
  sortLeavesInAscOrder,
  standardizeHashToPoseidon,
  standardizeToPoseidon
};
//# sourceMappingURL=index.mjs.map