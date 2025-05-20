import '@rainbow-me/rainbowkit/styles.css';
import {
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    sepolia
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { ReactNode } from 'react';
const config = getDefaultConfig({
    appName: 'DCEX',
    projectId: '9f028ef985d9cf1bacdfea0f961c9a85',
    chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();
const Config = ({ children }:
    { children: ReactNode }
) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default Config;