// Converts a given set of bits (0, 1) in an array to the 
// number equivalent.
// This follows the LSB ordering.
export function bitsToNum(bits: number[]): bigint {
    let total = 0n;

    for (let i = 0; i < bits.length; i++) {
        total += BigInt(bits[i]) * (2n ** BigInt(i));
    }

    return total
}