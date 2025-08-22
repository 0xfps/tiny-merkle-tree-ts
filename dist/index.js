"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  concatLeaves: () => concatLeaves,
  default: () => index_default,
  formatForCircom: () => formatForCircom,
  sortAndConcatLeaves: () => sortAndConcatLeaves,
  sortLeavesInAscOrder: () => sortLeavesInAscOrder
});
module.exports = __toCommonJS(index_exports);

// src/tree/build-tree.ts
var import_ethers = require("ethers");

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
      hashedPairs.push((0, import_ethers.keccak256)(concatLeaves2));
      tree.unshift(hashedPairs);
      break;
    }
    for (let i = 0; i < length - 1; i += 2) {
      concatLeaves2 = sortAndConcatLeaves(leaves[i], leaves[i + 1]);
      hashedPairs.push((0, import_ethers.keccak256)(concatLeaves2));
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
var import_ethers2 = require("ethers");
var import_strict = __toESM(require("assert/strict"));
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
    currentLeaf = (0, import_ethers2.keccak256)(sortAndConcatLeaves(currentLeaf, siblingLeaf));
  }
  import_strict.default.equal(proof.length, directions.length);
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
var import_ethers3 = require("ethers");
function verifyMerkleProof(root, leaf, merkleProof) {
  const { proof, directions } = merkleProof;
  let currentHash = leaf;
  proof.forEach(function(currentLeaf, i) {
    if (directions[i]) {
      currentHash = (0, import_ethers3.keccak256)(sortAndConcatLeaves(currentLeaf, currentHash));
    } else currentHash = (0, import_ethers3.keccak256)(sortAndConcatLeaves(currentHash, currentLeaf));
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
var import_ethers4 = require("ethers");
function formatForCircom(proof) {
  if (proof.proof.length > 32) throw new Error("Proof length exceeds 32!");
  const length = proof.directions.length;
  const lengthTo32 = 32 - length;
  const validBits = [];
  proof.directions.forEach(function(_) {
    validBits.push(1);
  });
  for (let i = 0; i < lengthTo32; i++) {
    proof.proof.push((0, import_ethers4.encodeBytes32String)(""));
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  concatLeaves,
  formatForCircom,
  sortAndConcatLeaves,
  sortLeavesInAscOrder
});
//# sourceMappingURL=index.js.map