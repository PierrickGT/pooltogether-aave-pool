import { Contract, utils } from 'ethers';
import { abis, addresses } from 'pooltogether-aave-pool-contracts';

import { DEFAULT_TOKEN_DECIMAL_PRECISION } from 'Constants';
import { nonConstantMethodCall } from 'helpers/Contract';
import { sendTransaction } from 'helpers/sendTransactionSlice';

export const unlockDai = async (account: string, chainId: number, library: any, dispatch: any) => {
    const daiTokenAddress = addresses[chainId as number].tokens.dai;
    const aavePoolAddress = addresses[chainId as number].contracts.aavePool;
    const daiTokenContract = new Contract(daiTokenAddress, abis.ERC20, library.getSigner(account));

    const params = [
        aavePoolAddress,
        utils.parseUnits('1000000000', DEFAULT_TOKEN_DECIMAL_PRECISION),
        {
            gasLimit: 300000,
        },
    ];

    dispatch(sendTransaction('approve', daiTokenContract, 'approve', params));
};

export const checkDaiAllowance = async (account: string, chainId: number, library: any) => {
    const daiTokenAddress = addresses[chainId].tokens.dai;
    const aavePoolAddress = addresses[chainId].contracts.aavePool;
    const daiTokenContract = new Contract(daiTokenAddress, abis.ERC20, library.getSigner(account));

    const daiAllowance = await nonConstantMethodCall(daiTokenContract, 'allowance', [
        account,
        aavePoolAddress,
    ]);

    return daiAllowance;
};

export const getUserDaiBalance = async (account: string, chainId: number, library: any) => {
    const daiTokenAddress = addresses[chainId as number].tokens.dai;
    const daiTokenContract = new Contract(daiTokenAddress, abis.ERC20, library.getSigner(account));

    const userBalance = await nonConstantMethodCall(daiTokenContract, 'balanceOf', [account]);

    return userBalance;
};
