// Converts a given set of bits (0, 1) in an array to the 
// number equivalent.
// This follows the LSB ordering.
export function bitsToNum(bits: number[]): BigInt {
    let total = 0n;

    bits.forEach(function (bit: number, index: number) {
        total += BigInt(bit) * (2n ** BigInt(index)); 
    })

    return total
}