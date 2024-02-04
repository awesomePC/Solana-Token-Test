import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useMemo } from "react";
import {
  ConnectionProvider,
  Wallet,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  PhantomWalletAdapter,
  // SolflareWalletAdapter,
  // MathWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { useWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from "@solana/web3.js";
import {
  WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

export default function App({ Component, pageProps }: AppProps) {
  const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);

   const allWallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // new SolflareWalletAdapter(),
      // new MathWalletAdapter(),
    ],
    []
  );

  return (
    <MantineProvider
      theme={
        {
          // Your Mantine theme settings here
          // other theme properties
        }
      }
    >
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={allWallets} autoConnect>
          <WalletModalProvider>
            <Component {...pageProps} />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </MantineProvider>
  );
}
