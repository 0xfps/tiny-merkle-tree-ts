import { encodeBytes32String } from "ethers";
import { CircomProof } from "../../interfaces/circom-proof";
import { Proof } from "../../interfaces/proof";

export default function formatForCircom(proof: Proof): CircomProof {
    if (proof.proof.length > 32) throw new Error("Proof length exceeds 32!")
    
    const length = proof.directions.length
    const lengthTo32 = 32 - length

    const validBits: number[] = []

    proof.directions.forEach(function (_) {
        validBits.push(1)
    })

    for (let i = 0; i < lengthTo32; i++) {
        proof.proof.push(encodeBytes32String(""))
        proof.directions.push(0)
        validBits.push(0)
    }

    const circomProof = {
        proof: proof.proof,
        directions: proof.directions,
        validBits
    }

    return circomProof
}