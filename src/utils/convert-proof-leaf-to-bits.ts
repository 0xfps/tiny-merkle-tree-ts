import bytesToBits from "./bytes-to-bits"

export function convertProofToBits(proof: string): number[] {
    const hexProof = proof.slice(2, proof.length)
    // For stuff computed with Poseidon hash, when converting to bits, reverse
    // the buffer.
    const uint8Array = new Uint8Array(Buffer.from(hexProof, "hex").reverse())
    return bytesToBits(uint8Array)
}