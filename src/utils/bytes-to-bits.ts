export default function bytesToBits(b: Uint8Array<ArrayBuffer>) {
    const bits = [];
    for (let i = 0; i < b.length; i++) {
        for (let j = 0; j < 8; j++) {
            if ((Number(b[i]) & (1 << j)) > 0) {
                bits.push(1);
            } else {
                bits.push(0);
            }
        }
    }
    return bits
}