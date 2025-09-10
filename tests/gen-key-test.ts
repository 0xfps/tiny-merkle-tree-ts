import { extractKeyMetadata } from "../src/contract-utils/extract-key-metadata";
import { generatekeys } from "../src/contract-utils/generate-keys";
import { getMaxWithdrawalOnKey } from "../src/contract-utils/max-withdrawal";

const key = generatekeys("0xb7ce8c93780B492a365d6B44b079b46816F09078", 5e18, "mysecretkeythere")
console.log({ key })
console.log(extractKeyMetadata(key.depositKey))
console.log(getMaxWithdrawalOnKey(key.withdrawalKey))