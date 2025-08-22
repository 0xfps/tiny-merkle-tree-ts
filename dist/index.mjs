// src/tree/build-tree.ts
import { keccak256 } from "ethers";

// src/utils/leaf-actions.ts
function sortLeavesInAscOrder(leaf1, leaf2) {
  return leaf1 < leaf2 ? [leaf1, leaf2] : [leaf2, leaf1];
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

// src/tree/build-tree.ts
function buildTree(leaves) {
  if (leaves.length < 2) throw new Error("Tree must be built with at least 2 leaves!");
  let tree = [leaves];
  let length = leaves.length;
  while (length >= 2) {
    let concatLeaves2;
    const hashedPairs = [];
    if (length == 2) {
      concatLeaves2 = sortAndConcatLeaves(leaves[0], leaves[1]);
      hashedPairs.push(keccak256(concatLeaves2));
      tree.unshift(hashedPairs);
      break;
    }
    for (let i = 0; i < length - 1; i += 2) {
      concatLeaves2 = sortAndConcatLeaves(leaves[i], leaves[i + 1]);
      hashedPairs.push(keccak256(concatLeaves2));
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
import { keccak256 as keccak2562 } from "ethers";
import assert from "assert/strict";
function generateProofForLeaf(leaf) {
  const { tree } = this;
  let currentLeaf = leaf;
  let treeWithoutRoot = tree.slice(1, tree.length);
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
    directions.push(getLeafDir(siblingLeaf, currentLeaf));
    proof.push(siblingLeaf);
    currentLeaf = keccak2562(sortAndConcatLeaves(currentLeaf, siblingLeaf));
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
import { keccak256 as keccak2563 } from "ethers";
function verifyMerkleProof(root, leaf, merkleProof) {
  const { proof, directions } = merkleProof;
  let currentHash = leaf;
  proof.forEach(function(currentLeaf, i) {
    if (directions[i]) {
      currentHash = keccak2563(sortAndConcatLeaves(currentLeaf, currentHash));
    } else currentHash = keccak2563(sortAndConcatLeaves(currentHash, currentLeaf));
  });
  return currentHash == root;
}

// src/tree/index.ts
var MiniMerkleTree = class {
  tree;
  root;
  depth;
  // Populate tree here.
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
function formatForCircom(proof) {
  if (proof.proof.length > 32) throw new Error("Proof length exceeds 32!");
  const length = proof.directions.length;
  const lengthTo32 = 32 - length;
  const validBits = [];
  proof.directions.forEach(function(_) {
    validBits.push(1);
  });
  for (let i = 0; i < lengthTo32; i++) {
    proof.proof.push(encodeBytes32String(""));
    proof.directions.push(0);
    validBits.push(0);
  }
  const circomProof = {
    proof: proof.proof,
    directions: proof.directions,
    validBits
  };
  return circomProof;
}

// src/index.ts
var index_default = MiniMerkleTree;
export {
  concatLeaves,
  index_default as default,
  formatForCircom,
  sortAndConcatLeaves,
  sortLeavesInAscOrder
};
//# sourceMappingURL=index.mjs.map