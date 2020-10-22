import { BigNumber, utils } from 'ethers';

import { DEFAULT_TOKEN_DECIMAL_PRECISION } from 'Constants';

export const formatBigNumberToNumber = (bignumber: BigNumber) =>
    Number(utils.formatUnits(bignumber, DEFAULT_TOKEN_DECIMAL_PRECISION));
