import { BigNumber, constants, Contract, utils } from 'ethers';
import moment from 'moment-timezone';
import { abis, addresses } from 'pooltogether-aave-pool-contracts';

import { DEFAULT_TOKEN_DECIMAL_PRECISION } from 'Constants';
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

export const getPrizePeriodRemainingSeconds = async (chainId: number) => {
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

    const prizePeriodRemainingSeconds: string = await nonConstantMethodCall(
        aavePoolPrizeStrategyContract,
        'prizePeriodRemainingSeconds',
    );

    return prizePeriodRemainingSeconds;
};

export const getAavePoolPrize = async (account: string, chainId: number, library: any) => {
    const signer = library.getSigner(account);

    const aavePoolContract = new Contract(
        addresses[chainId].contracts.aavePool,
        abis.AavePrizePool,
        signer,
    );

    const aavePoolAwardBalance: BigNumber = await aavePoolContract.callStatic.captureAwardBalance();

    const prizeInDai = utils.formatUnits(aavePoolAwardBalance);

    return {
        prizeInDai,
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
        { gasLimit: 800000 },
    ];

    dispatch(
        sendTransaction('withdrawInstantly', aavePoolContract, 'withdrawInstantlyFrom', params),
    );
};
