import { BigNumber, ethers } from 'ethers';

import { SECONDS_PER_BLOCK } from 'Constants';

// export function calculateCurrentPoolPrize(
//     poolBalance: BigNumber,
//     poolAccountedBalance: BigNumber,
// ) {
//     prizePeriodRemainingSeconds = prizePeriodRemainingSeconds.div(SECONDS_PER_BLOCK);

//     const additionalYield: BigNumber = poolTotalSupply
//         .mul(supplyRatePerBlock)
//         .mul(prizePeriodRemainingSeconds)
//         .div(ethers.constants.WeiPerEther);

//     return additionalYield.add(awardBalance);
// }

export function calculateEstimatedPoolPrize(
    awardBalance: BigNumber,
    poolTotalSupply: BigNumber,
    supplyRatePerBlock: BigNumber,
    prizePeriodRemainingSeconds: BigNumber,
) {
    prizePeriodRemainingSeconds = prizePeriodRemainingSeconds.div(SECONDS_PER_BLOCK);

    const additionalYield: BigNumber = poolTotalSupply
        .mul(supplyRatePerBlock)
        .mul(prizePeriodRemainingSeconds)
        .div(ethers.constants.WeiPerEther);

    return additionalYield.add(awardBalance);
}
