export const MAINNET_ID = 1;
export const ROPSTEN_ID = 3;
export const LOCAL_ID = 1337;


const addresses = {
  [ROPSTEN_ID]: {
      contracts: {
          aavePool: '0x210c91c68F31C22Aba8226Fd809615f6386604EF', // Replace by your pool address
      },
      tokens: {
          aDai: '0xcB1Fe6F440c49E9290c3eb7f158534c2dC374201',
          dai: '0xf80A32A835F79D7787E8a8ee5721D0fEaFd78108',
      },
  },
};

export default addresses;
