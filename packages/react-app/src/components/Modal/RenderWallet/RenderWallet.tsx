import React, { useEffect, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { useWeb3React } from '@web3-react/core';

import WalletButton from 'components/Button/Wallet';
import { ModalProps } from 'components/Modal';
import {
    metamask,
    useMetamaskEagerConnect,
    useMetamaskListener,
} from 'components/Modal/RenderWallet/connectors';
import { ModalContent, ModalHeader, ModalTitle } from 'components/Modal/style';
import { NETWORK_CHAIN_ID } from 'Constants';
import { isLocalNetwork, isMainNetwork, isRopstenNetwork } from 'helpers/Network';
import MetamaskLogo from 'images/Metamask';

const WalletModal: React.FC<ModalProps> = ({ title, toggleModal }) => {
    const {
        account,
        active: walletConnected,
        chainId,
        connector: walletProvider,
        error,
        library,
    } = useWeb3React<Web3Provider>();

    // Initialize state
    const [balance, setBalance] = useState<number | null>(null);
    const [selectedWallet, setSelectedWallet] = useState<AbstractConnector | null | undefined>(
        null,
    );
    const [network, setNetwork] = useState('');
    const [networkAllowed, setNetworkAllowed] = useState(false);
    const [status, setStatus] = useState('');

    // Setup RPC event listener
    const attemptedMMConnection = useMetamaskEagerConnect();
    useMetamaskListener(!attemptedMMConnection || !!selectedWallet);

    // Sets the balance to the current wallet on provider or network change
    useEffect(() => {
        if (!!account && !!library) {
            library
                .getBalance(account)
                .then((amount) => {
                    const formattedBalance = Number(parseFloat(formatEther(amount)).toPrecision(5));
                    setBalance(formattedBalance);
                })
                .catch(() => setBalance(null));
        }
    }, [account, library]);

    // Sets the status copy on provider or network change
    useEffect(() => {
        if (chainId) {
            setNetwork(NETWORK_CHAIN_ID[chainId]);
            setNetworkAllowed(isRopstenNetwork(chainId) || isLocalNetwork(chainId));

            if (!isRopstenNetwork(chainId) || !isLocalNetwork(chainId)) {
                setStatus('Please connect to Ropsten testnet');
            }
        }

        if (walletConnected && networkAllowed && !error && balance) {
            setStatus(`${balance} ${!isMainNetwork(chainId as number) && network} ETH available`);
        } else if (walletConnected && error) {
            setStatus('Error');
        }
    }, [balance, chainId, error, network, networkAllowed, walletConnected]);

    const RenderModalContent: React.FC = (): any => {
        if (networkAllowed || !walletConnected) {
            return (
                <WalletButton
                    error={walletProvider === metamask ? error : undefined}
                    logo={<MetamaskLogo />}
                    selectedWallet={selectedWallet as AbstractConnector}
                    setSelectedWallet={setSelectedWallet}
                    title="Metamask"
                    walletProvider={metamask}
                />
            );
        }

        return (
            <React.Fragment>
                <p>{`There are no contracts deployed to this network ${network}`}</p>
                <p>{status}</p>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <ModalHeader>
                <ModalTitle>{title}</ModalTitle>
            </ModalHeader>
            <ModalContent>
                <RenderModalContent />
            </ModalContent>
        </React.Fragment>
    );
};

export default WalletModal;
