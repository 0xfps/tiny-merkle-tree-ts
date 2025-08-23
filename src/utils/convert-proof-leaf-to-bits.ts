import bytesToBits from "./bytes-to-bits"

export function convertProofToBits(proof: string): number[] {
    const hexProof = proof.slice(2, proof.length)
    const uint8Array = new Uint8Array(Buffer.from(hexProof, "hex"))
    return bytesToBits(uint8Array)
}