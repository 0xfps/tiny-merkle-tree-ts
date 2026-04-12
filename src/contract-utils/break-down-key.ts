import { KeyBatch } from "../../interfaces/key-batch"
import { NoteCount } from "../../interfaces/note-count"
import { extractKeyMetadata } from "./extract-key-metadata"
import { generateKeys } from "./generate-keys"

export const DECIMALS = 6
export const ONE_NOTE = power(1)
export const TEN_NOTE = power(10)
export const HUNDRED_NOTE = power(100)
export const THOUSAND_NOTE = power(1000)
export const CAP = 100_000
export const HARD_CAP = power(CAP)

export function breakDownKey(
    masterWithdrawalKey: string,
    secretKey: string
): KeyBatch {
    const { amount } = extractKeyMetadata(masterWithdrawalKey)

    // @info Removed hard cap. Allow as much as possible, but flag onchain gas costs.
    // if (amount > HARD_CAP) throw new Error("$100,000 hard limit!")

    const notes = generateNoteCount(amount) 

    return generateDepositKeysFromWithdrawalKeyNotes(notes, secretKey)
}

function power(num: number): bigint {
    return BigInt(num * (10 ** DECIMALS))
}

export function generateNoteCount(amount: bigint): NoteCount {
    let thousandNotes: bigint = 0n
    let hundredNotes: bigint = 0n
    let tenNotes: bigint = 0n
    let oneNotes: bigint = 0n
    let decimalNote: bigint = 0n

    let startingAmount = amount

    decimalNote = startingAmount % power(1)
    startingAmount = startingAmount - decimalNote

    thousandNotes = startingAmount / THOUSAND_NOTE
    startingAmount = startingAmount - (THOUSAND_NOTE * thousandNotes)

    hundredNotes = startingAmount / HUNDRED_NOTE
    startingAmount = startingAmount - (HUNDRED_NOTE * hundredNotes)

    tenNotes = startingAmount / TEN_NOTE
    startingAmount = startingAmount - (TEN_NOTE * tenNotes)

    oneNotes = startingAmount / ONE_NOTE
    startingAmount = startingAmount - (ONE_NOTE * oneNotes)

    return { thousandNotes, hundredNotes, tenNotes, oneNotes, decimalNote }
}

function generateDepositKeysFromWithdrawalKeyNotes(
    noteCount: NoteCount,
    secretKey: string
): KeyBatch {
    const { thousandNotes, hundredNotes, tenNotes, oneNotes, decimalNote } = noteCount
    const keys: KeyBatch= {
        depositKeys: [],
        withdrawalKeys: []
    }

    for (let i = 0; i < thousandNotes; i++) {
        const { depositKey, withdrawalKey } = generateKeys(power(1000), secretKey)
        keys.depositKeys.push(depositKey)
        keys.withdrawalKeys.push(withdrawalKey)
    }

    for (let i = 0; i < hundredNotes; i++) {
        const { depositKey, withdrawalKey } = generateKeys(power(100), secretKey)
        keys.depositKeys.push(depositKey)
        keys.withdrawalKeys.push(withdrawalKey)
    }

    for (let i = 0; i < tenNotes; i++) {
        const { depositKey, withdrawalKey } = generateKeys(power(10), secretKey)
        keys.depositKeys.push(depositKey)
        keys.withdrawalKeys.push(withdrawalKey)
    }

    for (let i = 0; i < oneNotes; i++) {
        const { depositKey, withdrawalKey } = generateKeys(power(1), secretKey)
        keys.depositKeys.push(depositKey)
        keys.withdrawalKeys.push(withdrawalKey)
    }

    if (decimalNote) {
        const { depositKey, withdrawalKey } = generateKeys(decimalNote, secretKey)
        keys.depositKeys.push(depositKey)
        keys.withdrawalKeys.push(withdrawalKey)
    }

    return keys
}