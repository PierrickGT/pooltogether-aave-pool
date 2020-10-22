import { Contract } from 'ethers';

export const nonConstantMethodCall = async (
    contract: Contract,
    methodName: string,
    params: any[] = [],
) => await contract[methodName](...params);
