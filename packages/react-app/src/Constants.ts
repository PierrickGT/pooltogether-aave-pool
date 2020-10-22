export const POLLING_INTERVAL = 12000;

// Networks
export const MAINNET_NETWORK_ID = 1;
export const ROPSTEN_NETWORK_ID = 3;
export const RINKEBY_NETWORK_ID = 4;
export const GÖERLI_NETWORK_ID = 5;
export const KOVAN_NETWORK_ID = 42;
export const LOCAL_NETWORK_ID = 1337;

export enum NETWORK_CHAIN_ID {
    'Mainnet' = MAINNET_NETWORK_ID,
    'Ropsten' = ROPSTEN_NETWORK_ID,
    'Rinkeby' = RINKEBY_NETWORK_ID,
    'Göerli' = GÖERLI_NETWORK_ID,
    'Kovan' = KOVAN_NETWORK_ID,
    'Local' = LOCAL_NETWORK_ID,
}

// For UI purposes, all networks are "supported", but an error message
// is displayed when the user is not connected to the "allowed" network
export const SUPPORTED_CHAIN_IDS = [
    MAINNET_NETWORK_ID,
    ROPSTEN_NETWORK_ID,
    RINKEBY_NETWORK_ID,
    GÖERLI_NETWORK_ID,
    KOVAN_NETWORK_ID,
    LOCAL_NETWORK_ID,
];
export const SUPPORTED_NETWORKS = ['Ropsten', 'Local'];

// Replace by your pool address
export const AAVE_PRIZE_POOL_ADDRESS = '0xBCCAd3c8BC0E081318F444C15C0263B212b8C7a3';

// Prize Pool
export const DEFAULT_TOKEN_DECIMAL_PRECISION = 18;
export const SECONDS_PER_BLOCK = 14;

export const TYPE_DEBOUNCE_TIMEOUT = 300;
