import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import {
    InjectedConnector,
    InjectedConnector as MetamaskConnector,
} from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';

import { SUPPORTED_CHAIN_IDS } from 'Constants';
import { Web3ReactContextInterface } from 'types/web3-react';

const RPC_URLS: { [chainId: number]: string } = {
    1: process.env.REACT_APP_INFURA_MAINNET_PROVIDER as string,
    42: process.env.REACT_APP_INFURA_KOVAN_PROVIDER as string,
    1337: process.env.REACT_APP_LOCAL_PROVIDER as string,
};

const network = new NetworkConnector({
    urls: {
        1: RPC_URLS[1],
        42: RPC_URLS[42],
        1337: RPC_URLS[1337],
    },
    defaultChainId: 42,
});

const metamask: InjectedConnector = new MetamaskConnector({
    supportedChainIds: SUPPORTED_CHAIN_IDS,
});

const useMetamaskEagerConnect = () => {
    const { activate: connectTo, active: isMetamaskConnected } = useWeb3React<
        Web3ReactContextInterface
    >();

    const [attempted, setAttempted] = useState(false);

    useEffect(() => {
        const attempConnection = async () => {
            const isAuthorized: boolean = await metamask.isAuthorized();

            if (isAuthorized) {
                connectTo(metamask, undefined, true).catch(() => setAttempted(true));
            } else {
                setAttempted(true);
            }
        };

        attempConnection();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!attempted && isMetamaskConnected) {
            setAttempted(true);
        }
    }, [attempted, isMetamaskConnected]);

    return attempted;
};

const useMetamaskListener = (suppress: boolean = false) => {
    const { activate: connectTo, active, error } = useWeb3React();

    useEffect(() => {
        const { ethereum } = window;

        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const connectToMetamask = () => connectTo(metamask);

            const handleAccountsChanged = (accounts: string[]) => {
                if (accounts.length > 0) {
                    connectToMetamask();
                }
            };

            ethereum.on('connect', connectToMetamask);
            ethereum.on('chainChanged', connectToMetamask);
            ethereum.on('accountsChanged', handleAccountsChanged);
            ethereum.on('networkChanged', connectToMetamask);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('connect', connectToMetamask);
                    ethereum.removeListener('chainChanged', connectToMetamask);
                    ethereum.removeListener('accountsChanged', handleAccountsChanged);
                    ethereum.removeListener('networkChanged', connectToMetamask);
                }
            };
        }
    }, [active, connectTo, error, suppress]);
};

export { metamask, network, useMetamaskEagerConnect, useMetamaskListener };
