interface Window {
    ethereum: any;
    location: {
        origin: string;
    };
    DocumentTouch;
}
declare global {
    namespace NodeJS {
        interface Global {
            document: Document;
            window: Window;
            navigator: Navigator;
        }
    }
}

declare const DocumentTouch;

// TODO: need to find a better way to handle types
declare module 'pooltogether-aave-pool-contracts';
declare module '@walletconnect/web3-provider';
declare module 'pooltogetherjs';
declare module 'moment';
declare module 'moment-duration-format';
