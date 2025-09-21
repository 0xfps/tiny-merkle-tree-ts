// Converts the bytes in a Uint8Array to the equivalent bits array.
export default function bytesToBits(bytes: Uint8Array<ArrayBuffer>): number[] {
    const bits: number[] = [];

    bytes.forEach(function (byte: number) {
        for (let i = 0; i < 8; i++) {
            if ((Number(byte) & (1 << i)) > 0) {
                bits.push(1);
            } else {
                bits.push(0);
            }
        }
    })
    
    return bits
}