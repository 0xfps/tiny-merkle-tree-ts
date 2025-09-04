// Converts the bytes in a Uint8Array to the equivalent bits array.
export default function bytesToBits(bytes: Uint8Array<ArrayBuffer>): number[] {
    const bits: number[] = [];

    for (let i = 0; i < bytes.length; i++) {
        for (let j = 0; j < 8; j++) {
            if ((Number(bytes[i]) & (1 << j)) > 0) {
                bits.push(1);
            } else {
                bits.push(0);
            }
        }
    }
    
    return bits
}