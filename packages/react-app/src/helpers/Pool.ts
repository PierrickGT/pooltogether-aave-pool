import { abis, addresses } from '@pooltogether-aave-pool/contracts';
import { BigNumber, constants, Contract, Signer, utils } from 'ethers';
import moment from 'moment-timezone';
import { calculateEstimatedPoolPrize } from 'utils/PoolTogether';

import { AAVE_PRIZE_POOL_ADDRESS, DEFAULT_TOKEN_DECIMAL_PRECISION } from 'Constants';
import { getLendingPoolAddressesProviderAddress } from 'helpers/Aave';
import { nonConstantMethodCall } from 'helpers/Contract';
import { getProvider } from 'helpers/Network';
import { sendTransaction } from 'helpers/sendTransactionSlice';

export const getNextAwardDate = () => {
    const currentPSTDate = moment(new Date().getTime()).tz('America/Los_Angeles');
    const weeklyAwardPSTDate = moment()
        .tz('America/Los_Angeles')
        .day(5)
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0);

    if (currentPSTDate.isBefore(weeklyAwardPSTDate)) {
        return weeklyAwardPSTDate;
    } else {
        return weeklyAwardPSTDate.add(1, 'weeks');
    }
};

export const getAavePoolPrize = async (chainId: number) => {
    const provider = getProvider(chainId);

    const aavePoolContract = new Contract(
        addresses[chainId].contracts.aavePool,
        abis.AavePrizePool,
        provider,
    );

    const aavePoolAwardBalance: BigNumber = await nonConstantMethodCall(
        aavePoolContract,
        'awardBalance',
    );

    const aavePoolPrizeStrategyAddress: string = await nonConstantMethodCall(
        aavePoolContract,
        'prizeStrategy',
    );

    const aaveLendingPoolAddressesProviderContract = new Contract(
        getLendingPoolAddressesProviderAddress(chainId),
        abis.LendingPoolAddressesProviderInterface,
        provider,
    );

    const aaveLendingPoolAddress: string = await nonConstantMethodCall(
        aaveLendingPoolAddressesProviderContract,
        'getLendingPool',
    );

    const aTokenContract = new Contract(
        addresses[chainId].tokens.aDai,
        abis.ATokenInterface,
        provider,
    );

    const aaveLendingPoolContract = new Contract(
        aaveLendingPoolAddress,
        abis.LendingPoolInterface,
        provider,
    );

    const aavePoolPrizeStrategyContract = new Contract(
        aavePoolPrizeStrategyAddress,
        abis.SingleRandomWinner,
        provider,
    );

    const aavePoolSponsorshipAddress: string = await nonConstantMethodCall(
        aavePoolPrizeStrategyContract,
        'sponsorship',
    );

    const aavePoolTicketAddress: string = await nonConstantMethodCall(
        aavePoolPrizeStrategyContract,
        'ticket',
    );

    // const aavePoolTokenListenerAddress: string = await nonConstantMethodCall(
    //     aavePoolPrizeStrategyContract,
    //     'tokenListener',
    // );

    // const aavePoolRngAddress: string = await nonConstantMethodCall(
    //     aavePoolPrizeStrategyContract,
    //     'rng',
    // );

    const aavePoolPrizePeriodRemainingSeconds: BigNumber = await nonConstantMethodCall(
        aavePoolPrizeStrategyContract,
        'prizePeriodRemainingSeconds',
    );

    const aavePoolTicketContract = new Contract(aavePoolTicketAddress, abis.ERC20, provider);

    const aavePoolSponsorshipContract = new Contract(
        aavePoolSponsorshipAddress,
        abis.ERC20,
        provider,
    );

    const aavePoolTicketTotalSupply: BigNumber = await nonConstantMethodCall(
        aavePoolTicketContract,
        'totalSupply',
    );

    const aavePoolSponsorshipTotalSupply: BigNumber = await nonConstantMethodCall(
        aavePoolSponsorshipContract,
        'totalSupply',
    );

    // const aavePoolMaxExitFeeMantissa: BigNumber = await nonConstantMethodCall(
    //     aavePoolContract,
    //     'maxExitFeeMantissa',
    // );

    // const aavePoolCreditPlanOf: BigNumber[] = await nonConstantMethodCall(
    //     aavePoolContract,
    //     'creditPlanOf',
    //     [aavePoolTicketAddress],
    // );

    // const [creditRateMantissa, creditLimitMantissa] = aavePoolCreditPlanOf;

    const aavePoolAccountedBalance: BigNumber = await nonConstantMethodCall(
        aavePoolContract,
        'accountedBalance',
    );

    const aTokenUnderlyingAssetAddress: string = await nonConstantMethodCall(
        aTokenContract,
        'underlyingAssetAddress',
    );

    const {
        liquidityRate: aaveLendingPoolLiquidityRate,
    } = await nonConstantMethodCall(aaveLendingPoolContract, 'getUserReserveData', [
        aTokenUnderlyingAssetAddress,
        AAVE_PRIZE_POOL_ADDRESS,
    ]);

    // aaveLendingPoolLiquidityRate is in Ray units (27 decimals) so we need to convert it in Wad units (18 decimals)
    const aTokenSupplyRatePerBlock: BigNumber = aaveLendingPoolLiquidityRate.div(
        BigNumber.from(Math.pow(10, 9)),
    );

    const aavePoolTotalSupply: BigNumber = aavePoolTicketTotalSupply.add(
        aavePoolSponsorshipTotalSupply,
    );

    const estimatedPoolPrize: BigNumber = calculateEstimatedPoolPrize(
        aavePoolAwardBalance,
        aavePoolTotalSupply,
        aTokenSupplyRatePerBlock,
        aavePoolPrizePeriodRemainingSeconds,
    );

    // const prize = pt.utils.calculatePrize(
    //     aavePoolBalance,
    //     aavePoolAccountedBalance,
    //     currentDraw.feeFraction,
    // );

    const prizeInDai = utils.formatUnits(aavePoolAwardBalance);

    const prizeEstimateInDai = utils.formatUnits(
        estimatedPoolPrize,
        DEFAULT_TOKEN_DECIMAL_PRECISION,
    );

    return {
        prizeInDai,
        prizeEstimateInDai,
    };
};

export const getAavePoolTicketsTotalSupply = async (chainId: number) => {
    const provider = getProvider(chainId);

    const aavePoolContract = new Contract(
        addresses[chainId].contracts.aavePool,
        abis.AavePrizePool,
        provider,
    );

    const aavePoolPrizeStrategyAddress: string = await nonConstantMethodCall(
        aavePoolContract,
        'prizeStrategy',
    );

    const aavePoolPrizeStrategyContract = new Contract(
        aavePoolPrizeStrategyAddress,
        abis.SingleRandomWinner,
        provider,
    );

    const aavePoolTicketAddress: string = await nonConstantMethodCall(
        aavePoolPrizeStrategyContract,
        'ticket',
    );

    const aavePoolTicketContract = new Contract(aavePoolTicketAddress, abis.ERC20, provider);

    const aavePoolTicketsTotalSupply: BigNumber = await nonConstantMethodCall(
        aavePoolTicketContract,
        'totalSupply',
    );

    return aavePoolTicketsTotalSupply;
};

export const depositDaiToAavePool = async (
    daiValue: string,
    account: string,
    chainId: number,
    library: any,
    dispatch: any,
) => {
    const provider = getProvider(chainId);
    const signer = library.getSigner(account);

    const aavePoolContract = new Contract(
        addresses[chainId].contracts.aavePool,
        abis.AavePrizePool,
        signer,
    );

    const aavePoolPrizeStrategyAddress: string = await nonConstantMethodCall(
        aavePoolContract,
        'prizeStrategy',
    );

    const aavePoolPrizeStrategyContract = new Contract(
        aavePoolPrizeStrategyAddress,
        abis.SingleRandomWinner,
        provider,
    );

    const aavePoolTicketAddress: string = await nonConstantMethodCall(
        aavePoolPrizeStrategyContract,
        'ticket',
    );

    const params = [
        signer._address,
        utils.parseEther(daiValue.toString()),
        aavePoolTicketAddress,
        constants.AddressZero, // TODO: replace by referal address
        {
            gasLimit: 1500000,
        },
    ];

    dispatch(sendTransaction('deposit', aavePoolContract, 'depositTo', params));
};

export const getUserTicketsBalance = async (account: string, chainId: number, library: any) => {
    const provider = getProvider(chainId);

    const aavePoolContract = new Contract(
        addresses[chainId].contracts.aavePool,
        abis.AavePrizePool,
        library.getSigner(account),
    );

    const aavePoolPrizeStrategyAddress: string = await nonConstantMethodCall(
        aavePoolContract,
        'prizeStrategy',
    );

    const aavePoolPrizeStrategyContract = new Contract(
        aavePoolPrizeStrategyAddress,
        abis.SingleRandomWinner,
        provider,
    );

    const aavePoolTicketAddress: string = await nonConstantMethodCall(
        aavePoolPrizeStrategyContract,
        'ticket',
    );

    const aavePoolTicketContract = new Contract(aavePoolTicketAddress, abis.ERC20, provider);

    const userBalance = await nonConstantMethodCall(aavePoolTicketContract, 'balanceOf', [account]);

    return userBalance;
};

export const getUserTimelockDuration = async (
    daiValue: number,
    account: string,
    chainId: number,
    library: any,
) => {
    const signer = library.getSigner(account);

    const aavePoolContract = new Contract(
        addresses[chainId].contracts.aavePool,
        abis.AavePrizePool,
        signer,
    );

    const controlledTokens: string[] = await nonConstantMethodCall(aavePoolContract, 'tokens');

    const userTimelockDuration = await aavePoolContract.callStatic.calculateTimelockDuration(
        signer._address,
        controlledTokens[1],
        utils.parseUnits(daiValue.toString(), DEFAULT_TOKEN_DECIMAL_PRECISION),
    );

    return userTimelockDuration;
};

export const withdrawWithTimelock = async (
    daiValue: number,
    account: string,
    chainId: number,
    library: any,
    dispatch: any,
) => {
    const signer = library.getSigner(account);

    const aavePoolContract = new Contract(
        addresses[chainId].contracts.aavePool,
        abis.AavePrizePool,
        signer,
    );

    const controlledTokens: string[] = await nonConstantMethodCall(aavePoolContract, 'tokens');

    const params = [
        signer._address,
        utils.parseEther(daiValue.toString()),
        controlledTokens[1],
        { gasLimit: 800000 },
    ];

    dispatch(
        sendTransaction(
            'withdrawWithTimelock',
            aavePoolContract,
            'withdrawWithTimelockFrom',
            params,
        ),
    );
};

export const getUserExitFees = async (
    daiValue: number,
    account: string,
    chainId: number,
    library: any,
) => {
    const signer = library.getSigner(account);

    const aavePoolContract = new Contract(
        addresses[chainId].contracts.aavePool,
        abis.AavePrizePool,
        signer,
    );

    const controlledTokens: string[] = await nonConstantMethodCall(aavePoolContract, 'tokens');

    const userExitFee = await aavePoolContract.callStatic.calculateEarlyExitFee(
        signer._address,
        controlledTokens[1],
        utils.parseUnits(daiValue.toString(), DEFAULT_TOKEN_DECIMAL_PRECISION),
    );

    return userExitFee;
};

// export const fetchExitFee = async (
//   networkName,
//   usersAddress,
//   prizePoolAddress,
//   ticketAddress,
//   amount,
// ) => {
//   const provider = await readProvider(networkName)
//   const exitFees = {
//     credit       : ethers.utils.bigNumberify(0),
//     earlyExitFee : ethers.utils.bigNumberify(0),
//   }

//   try {
//     const etherplexPrizePoolContract = contract(
//       'prizePool',
//       PrizePoolAbi,
//       prizePoolAddress
//     )

//     const values = await batch(
//       provider,
//       etherplexPrizePoolContract
//         .balanceOfCredit(usersAddress, ticketAddress)
//         .calculateTimelockDuration(usersAddress, ticketAddress, amount)
//         .calculateEarlyExitFee(usersAddress, ticketAddress, amount)
//     )

//     // Instant Withdrawal Credit/Fee
//     exitFees.credit = values.prizePool.balanceOfCredit[0]

//     exitFees.timelockDurationSeconds = values.prizePool.calculateTimelockDuration.durationSeconds
//     exitFees.burnedCredit = values.prizePool.calculateEarlyExitFee.burnedCredit
//     exitFees.exitFee = values.prizePool.calculateEarlyExitFee.exitFee
//   }
//   catch (e) {
//     console.warn(e.message)
//   }
//   finally {
//     return exitFees
//   }
// }

export const calculateInstantWithdrawAmount = (withdrawAmount: number = 0, exitFee: BigNumber) => {
    let instantWithdrawAmount;

    if (exitFee && exitFee.gt(0)) {
        instantWithdrawAmount = utils
            .parseUnits(withdrawAmount.toString(), DEFAULT_TOKEN_DECIMAL_PRECISION)
            .sub(exitFee);
    } else {
        instantWithdrawAmount = utils.parseUnits(
            withdrawAmount.toString(),
            DEFAULT_TOKEN_DECIMAL_PRECISION,
        );
    }

    return instantWithdrawAmount;
};

export const withdrawInstantly = async (
    daiValue: number,
    account: string,
    chainId: number,
    library: any,
    dispatch: any,
) => {
    const signer = library.getSigner(account);

    const aavePoolContract = new Contract(
        addresses[chainId].contracts.aavePool,
        abis.AavePrizePool,
        signer,
    );

    const controlledTokens: string[] = await nonConstantMethodCall(aavePoolContract, 'tokens');
    const exitFees = await getUserExitFees(daiValue, account, chainId, library);

    const params = [
        signer._address,
        utils.parseUnits(daiValue.toString(), DEFAULT_TOKEN_DECIMAL_PRECISION),
        controlledTokens[1],
        exitFees.exitFee,
    ];

    dispatch(
        sendTransaction('withdrawInstantly', aavePoolContract, 'withdrawInstantlyFrom', params),
    );
};
