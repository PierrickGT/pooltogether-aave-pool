import { abis, addresses } from '@pooltogether-aave-pool/contracts';
import { Contract, utils } from 'ethers';

import { DEFAULT_TOKEN_DECIMAL_PRECISION } from 'Constants';
import { nonConstantMethodCall } from 'helpers/Contract';
import { sendTransaction } from 'helpers/sendTransactionSlice';

export const withdrawPendingDeposit = async (
    daiValue: string,
    account: string,
    chainId: number,
    library: any,
    dispatch: any,
) => {
    // @ts-ignore
    const donutPodAddress = addresses[chainId as number].contracts.donutPod;

    const donutPodContract = new Contract(
        donutPodAddress,
        abis.Pod.abi,
        library.getSigner(account),
    );

    const params = [
        utils.parseUnits(daiValue.toString(), DEFAULT_TOKEN_DECIMAL_PRECISION),
        utils.hashMessage(''),
        {
            gasLimit: 700000,
        },
    ];

    dispatch(
        sendTransaction(
            'withdrawPendingDeposit',
            donutPodContract,
            'withdrawPendingDeposit',
            params,
        ),
    );
};

export const redeemToAccount = async (
    daiValue: string,
    account: string,
    chainId: number,
    library: any,
    dispatch: any,
) => {
    // @ts-ignore
    const donutPodAddress = addresses[chainId as number].contracts.donutPod;

    const donutPodContract = new Contract(
        donutPodAddress,
        abis.Pod.abi,
        library.getSigner(account),
    );

    const params = [
        utils.parseUnits(daiValue.toString(), DEFAULT_TOKEN_DECIMAL_PRECISION),
        utils.hashMessage(''),
        {
            gasLimit: 700000,
        },
    ];

    dispatch(sendTransaction('redeem', donutPodContract, 'redeem', params));
};

export const redeemToDaiPool = async (
    daiValue: string,
    account: string,
    chainId: number,
    library: any,
    dispatch: any,
) => {
    // @ts-ignore
    const donutPodAddress = addresses[chainId as number].contracts.donutPod;

    const donutPodContract = new Contract(
        donutPodAddress,
        abis.Pod.abi,
        library.getSigner(account),
    );

    const params = [
        utils.parseUnits(daiValue.toString(), DEFAULT_TOKEN_DECIMAL_PRECISION),
        utils.hashMessage(''),
        {
            gasLimit: 700000,
        },
    ];

    dispatch(sendTransaction('redeemToPool', donutPodContract, 'redeemToPool', params));
};
