import { BigNumber, utils } from 'ethers';

import { DEFAULT_TOKEN_DECIMAL_PRECISION } from 'Constants';

export const formatBigNumberToNumber = (
    bignumber: BigNumber,
    decimals: number = DEFAULT_TOKEN_DECIMAL_PRECISION,
) => Number(utils.formatUnits(bignumber, decimals));
