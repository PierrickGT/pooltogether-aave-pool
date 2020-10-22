import { AbstractConnector } from '@web3-react/abstract-connector';
import { ethers, providers } from 'ethers';

import { metamask } from 'components/Modal/RenderWallet/connectors';
import {
    KOVAN_NETWORK_ID,
    LOCAL_NETWORK_ID,
    MAINNET_NETWORK_ID,
    ROPSTEN_NETWORK_ID,
} from 'Constants';

export const isMainNetwork = (networkId: number) => networkId === MAINNET_NETWORK_ID;
export const isRopstenNetwork = (networkId: number) => networkId === ROPSTEN_NETWORK_ID;
export const isKovanNetwork = (networkId: number) => networkId === KOVAN_NETWORK_ID;
export const isLocalNetwork = (networkId: number) => networkId === LOCAL_NETWORK_ID;

export const getEtherscanUrl = (networkId: number, type: string, hash: string) => {
    if (isRopstenNetwork(networkId)) {
        return `https://ropsten.etherscan.io/${type}/${hash}`;
    }

    return `https://etherscan.io/${type}/${hash}`;
};

export const getProvider = (networkId: number) => {
    if (isMainNetwork(networkId)) {
        return new ethers.providers.JsonRpcProvider(
            process.env.REACT_APP_ALCHEMY_MAINNET_PROVIDER,
        ) as providers.Provider;
    }

    if (isLocalNetwork(networkId)) {
        return new ethers.providers.JsonRpcProvider(
            process.env.REACT_APP_LOCAL_PROVIDER,
        ) as providers.Provider;
    }

    // We return Ropsten provider by default
    return new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_ALCHEMY_ROPSTEN_PROVIDER,
    ) as providers.Provider;
};

export const getWalletName = (walletProvider: AbstractConnector) => {
    if (walletProvider === metamask) {
        return 'Metamask';
    }
};
