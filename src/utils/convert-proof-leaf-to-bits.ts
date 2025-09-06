import bytesToBits from "./bytes-to-bits"

// Converts a given 32-byte hex string to bits.
export function convertProofToBits(proof: string): number[] {
    const hexProof = proof.slice(2)
    // For stuff computed with Poseidon hash (basically, everything here), 
    // when converting to bits, reverse the buffer.
    const uint8Array = new Uint8Array(Buffer.from(hexProof, "hex").reverse())
    return bytesToBits(uint8Array)
}