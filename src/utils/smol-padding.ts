/**
 * Poseidon hash of some numbers, e.g 1 will yield a 31-byte string.
 * This function pads all leaves to 32 bytes before being used in the tree.
 * On the contract, it won't be an issue.
 * Pad up all leaves before calling new TinyMerkleTree and after every hash.
 * Leaves coming from the contract are already 32 byte padded.
 * If the leaf is already complete, nothing happens.
 */
export function smolPadding(str: string): string {
    if (str.length > 66) throw new Error("Expected a bytes32 string.")
    const lenRem = 64 - (str.length - 2);
    const pad0 = "0".repeat(lenRem)
    return `0x${pad0}${str.slice(2)}`
}