import { AbstractConnector } from '@web3-react/abstract-connector';

import { metamask } from 'components/Modal/RenderWallet/connectors';

export const getWalletName = (provider?: AbstractConnector) => {
    switch (provider) {
        case metamask:
            return 'Metamask';
        default:
            return '';
    }
};
