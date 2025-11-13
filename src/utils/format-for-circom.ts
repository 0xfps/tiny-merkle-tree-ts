import { encodeBytes32String } from "ethers";
import { CircomProof } from "../../interfaces/circom-proof";
import { Proof } from "../../interfaces/proof";
import { convertProofToBits } from "./convert-proof-leaf-to-bits";
import { bitsToNum } from "./bits-to-num";

// Formats a given proof data into valid Circom input format, i.e., bits.
export default function formatForCircom(proof: Proof): CircomProof {
    if (proof.proof.length > 32) throw new Error("Proof length exceeds 32!")
    
    const length = proof.directions.length
    const lengthTo32 = 32 - length

    const validBits: number[] = []
    const proofs: string[] = []

    proof.directions.forEach(function (_, index: number) {
        proofs.push(bitsToNum(convertProofToBits(proof.proof[index])).toString())
        validBits.push(1)
    })

    for (let i = 0; i < lengthTo32; i++) {
        proofs.push(bitsToNum(convertProofToBits(encodeBytes32String(""))).toString())
        proof.directions.push(0)
        validBits.push(0)
    }

    const circomProof = {
        proof: proofs,
        directions: proof.directions,
        validBits
    }

    return circomProof
}