export const MAINNET_ID = 1;
export const ROPSTEN_ID = 3;
export const LOCAL_ID = 1337;


const addresses = {
    [ROPSTEN_ID]: {
        contracts: {
            aavePool: '0xBCCAd3c8BC0E081318F444C15C0263B212b8C7a3', // Replace by your pool address
        },
        tokens: {
            aDai: '0xcB1Fe6F440c49E9290c3eb7f158534c2dC374201',
            dai: '0xf80A32A835F79D7787E8a8ee5721D0fEaFd78108',
        },
    },
};

export default addresses;
