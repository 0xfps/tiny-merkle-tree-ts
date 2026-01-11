# TinyMerkleTree

A **TypeScript implementation** of an incremental Merkle tree with **O(log N)** inserts and **O(depth)** storage. Inspired by Solidity on-chain designs, this library is perfect for off-chain computation, ZK-friendly trees, or light client state tracking.

It is highly compatible and a remake of the merkle tree at [Solidity Merkle Tree](https://github.com/0xfps/tiny-merkle-tree-solidity).

## Features

- Incremental, append-only Merkle tree.
- **O(log N)** insertion per leaf.
- Fixed depth, supports billions of leaves.
- Only stores the last unresolved hash per depth.
- Deterministic, Poseidon-style hash compatible.
- Fully typed for TypeScript projects.

## Installation

```bash
npm install @fifteenfigures/tiny-merkle-tree
# or
yarn add @fifteenfigures/tiny-merkle-tree
```

## Usage

```ts
import { TinyMerkleTree } from "@fifteenfigures/tiny-merkle-tree";

const leaves = ["0x...", "0x...", "0x...", "0x..."]
const tree = new TinyMerkleTree([leaves]);
const root = tree.root
```

## Concepts

### Tree Structure

```
Depth 3 (root)          H7
                       /  \
Depth 2             H5      H6
                    / \    / \
Depth 1           H1  H2  H3  H4
                  |   |   |   |
Depth 0 (leaves)  L0  L1  L2  L3
```

- Leaves at depth 0  
- Internal nodes store the last unresolved hash at each depth  
- Depth indices start at 0 → `DEPTH`  