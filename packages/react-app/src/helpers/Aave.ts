export const getLendingPoolAddressesProviderAddress = (chainId: number): string => {
    switch (chainId) {
        case 1:
            return '0x24a42fD28C976A61Df5D00D0599C34c4f90748c8';
        case 3:
            return '0x1c8756FD2B28e9426CDBDcC7E3c4d64fa9A54728';
        case 42:
            return '0x506B0B2CF20FAA8f38a4E2B524EE43e1f4458Cc5';
        case 1337:
            return '0x24a42fD28C976A61Df5D00D0599C34c4f90748c8';
        default:
            return '0x24a42fD28C976A61Df5D00D0599C34c4f90748c8';
    }
};
