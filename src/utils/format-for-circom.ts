import { encodeBytes32String } from "ethers";
import { CircomProof } from "../../interfaces/circom-proof";
import { Proof } from "../../interfaces/proof";
import { convertProofToBits } from "./convert-proof-leaf-to-bits";

export default function formatForCircom(proof: Proof): CircomProof {
    if (proof.proof.length > 32) throw new Error("Proof length exceeds 32!")
    
    const length = proof.directions.length
    const lengthTo32 = 32 - length

    const validBits: number[] = []
    const proofBits: number[][] = []

    proof.directions.forEach(function (_, index: number) {
        proofBits.push(convertProofToBits(proof.proof[index]))
        validBits.push(1)
    })

    for (let i = 0; i < lengthTo32; i++) {
        proofBits.push(convertProofToBits(encodeBytes32String("")))
        proof.directions.push(0)
        validBits.push(0)
    }

    const circomProof = {
        proof: proofBits,
        directions: proof.directions,
        validBits
    }

    return circomProof
}