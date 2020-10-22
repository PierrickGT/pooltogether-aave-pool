import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { Provider as ReduxProvider } from 'react-redux';

import { POLLING_INTERVAL } from 'Constants';

import routing from './Routing';
import store from './store';

const getLibrary = (provider: any): any => {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = POLLING_INTERVAL;
    return library;
};

const Root = () => {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <ReduxProvider store={store}>{routing}</ReduxProvider>
        </Web3ReactProvider>
    );
};

export default Root;
