import { extractKeyMetadata } from "../src/contract-utils/extract-key-metadata";
import { generateKeys } from "../src/contract-utils/generate-keys";
import { getMaxWithdrawalOnKey } from "../src/contract-utils/max-withdrawal";

const key = generateKeys(BigInt(5e18), "mysecretkeythere")
console.log({ key })
console.log(extractKeyMetadata(key.depositKey))
console.log(getMaxWithdrawalOnKey(key.withdrawalKey))