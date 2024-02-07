"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Text, Button as MantineButton, Title, Space } from "@mantine/core";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import "@solana/wallet-adapter-react-ui/styles.css"; // only needs to be imported once


export default function App() {
  // You can also provide a custom RPC endpoint
  // const endpoint = useMemo(() => "https://api.devnet.solana.com", []);
  // const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);
  const { select, wallets, publicKey, disconnect } = useWallet();

  const wallet = useWallet();
  //   const SOLANA_HOST = clusterApiUrl("mainnet-beta");
  const SOLANA_HOST = clusterApiUrl("devnet");
  const connection = new Connection(SOLANA_HOST);

  let lamportBalance;

  // State to indicate whether we are on the client side
  const [isClient, setIsClient] = useState(false);
  // States to store balances
  const [solBalance, setSolBalance] = useState(-1);
  const [printBalance, setPrintBalance] = useState(-1);

  useEffect(() => {
    // Set the flag to true after the component mounts
    setIsClient(true);
  }, []);

  useEffect(() => {
    const getRes = async () => {
      if (wallet?.publicKey) {
        try {
          const balance = await connection.getBalance(wallet?.publicKey);

          lamportBalance = balance / LAMPORTS_PER_SOL;
          console.log("Sol Balance:", lamportBalance);

          // Set Sol balance based on the response
          setSolBalance(lamportBalance);

          // Create a PublicKey object for the wallet address
          let walletPublicKey = new PublicKey(wallet?.publicKey);

          // Create a PublicKey object for the SPL Token's mint address
          let mintPublicKey = new PublicKey(
            // "7FctSfSZ9GonfMrybp45hzoQyU71CEjjZFxxoSzqKWT"
            "kiutgyJRgFk6y8ayNd9PpnYpsU1mPGPhxKGMSFNo4Jy"
          );

          // Find the associated token address using the wallet and mint addresses
          let associatedTokenAddress = await getAssociatedTokenAddress(
            mintPublicKey,
            walletPublicKey,
            false,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          );

          // Fetch account info
          let accountInfo = await connection.getParsedAccountInfo(
            associatedTokenAddress
          );

          console.log("accountInfo:", accountInfo, associatedTokenAddress);
          // Check if the account has been initialized
          if (accountInfo.value) {
            if (accountInfo.value && "parsed" in accountInfo.value.data) {
              let balance =
                accountInfo?.value?.data?.parsed?.info?.tokenAmount?.uiAmount;
              console.log("$PRINT Token Balance:", balance);

              // Set Print balance based on the response
              setPrintBalance(balance);
            } else {
              console.error("Account data is not in the expected format.");
              console.log("$PRINT Token Balance:", 0);

              // Set Print balance based on the response
              setPrintBalance(0);
            }
          } else {
            console.log("The token account does not exist.");

            console.log("$PRINT Token Balance:", 0);
            // Set Print balance based on the response
            setPrintBalance(0);
          }
        } catch (error) {
          console.error("Error while fething balances");
        }
      } else {
        // Once wallet is disconnected, reset all balances
        setSolBalance(-1);
        setPrintBalance(-1);
      }
    };

    getRes();
  }, [wallets, publicKey]);

  const handleBackHome = () => {
    // Run the function
  };

  return (
    <main className="min-h-screen bg-black">
      {/* Nav bar */}
      <div className="flex justify-between items-center w-full p-4">
        <div>
          <button
            onClick={handleBackHome}
            className="home-button text-[#40c057] border-[#40c057] border-2 rounded-xl text-xs p-1 font-base md:text-xl md:p-2 md:rounded-2xl"
          >
            &lt; Back to Home
          </button>
        </div>
        <div>
          <Image
            src="/image/Logo.png"
            alt="Logo"
            className="dark:invert w-[30px] h-[30px] md:h-[45px] md:w-[45px]"
            width={50}
            height={24}
            priority
          />
        </div>
        <div>
          {!isClient ? (
            <></>
          ) : !publicKey ? (
            // <div className="flex items-center justify-center gap-4">
            //     {wallets.filter((wallet) => wallet.readyState === "Installed").length >
            //     0 ? (
            //     wallets
            //         .filter((wallet) => wallet.readyState === "Installed")
            //         .map((wallet) => (
            //         <WalletMultiButton
            //             key={wallet.adapter.name}
            //             onClick={() => select(wallet.adapter.name)}
            //             // w="64"
            //             // size="lg"
            //             // fontSize="md"
            //             // leftIcon={
            //             //   <Image
            //             //     src={wallet.adapter.icon}
            //             //     alt={wallet.adapter.name}
            //             //     h={6}
            //             //     w={6}
            //             //   />
            //             // }
            //         >
            //             {wallet.adapter.name}
            //         </WalletMultiButton>
            //         ))
            //     ) : (
            <WalletMultiButton className="text-sm md:text-lg">
              Select Wallet
            </WalletMultiButton>
          ) : (
            // )}
            // </div>
            <div className="flex items-center justify-center gap-4">
              {/* <Text></Text> */}
              <WalletMultiButton onClick={disconnect}>
                {publicKey.toBase58().substring(0, 4)}...
                {publicKey
                  .toBase58()
                  .substring(publicKey.toBase58().length - 4)}
              </WalletMultiButton>
            </div>
          )}
        </div>
      </div>
      {/* Main Part */}
      <div className="w-full flex items-center justify-center px-10 py-10 min-h-[70vh] md:px-10 lg:px-80 lg:py-40">
        <div className="flex items-center justify-between flex-col-reverse md:flex-row w-full gap-10 md:gap-5">
          {/* Left Part */}
          <div className="md:w-[50%] w-[100%]">
            <h1 className="text-[#40c057] text-4xl md:text-5xl lg:text-7xl font-bold">
              Buy $PRINT
            </h1>
            <Space h="sm" />
            <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-bold">
              Earn $SOL
            </h1>
            <Space h="xl" />
            <Text size="md" c="white" className="w-full md:w-[90%] lg:w-[70%]">
              Featuring Print Protocol's custom Hold 2 Earn (H2E) rewards
              mechanism. Holding $PRINT grants you CONTINUAL $SOL returns.
            </Text>
            <Space h="lg" />
            <div className="flex items-center justity-center gap-5">
              <MantineButton
                variant="filled"
                color="green"
                radius="md"
                size="md"
              >
                BACK HOME
              </MantineButton>
              <MantineButton
                variant="outline"
                color="green"
                radius="md"
                size="md"
              >
                READ WHITEPAPER
              </MantineButton>
            </div>
          </div>

          {/* Right Part */}
          <div className="md:w-[50%] w-[100%]">
            <input
              type="text"
              placeholder="Search wallet address"
              className="text-center p-3 w-full rounded-[20px] border-green-400 bg-green-400 bg-opacity-33"
            />
            <Space h="sm" />
            <div
              className="flex justify-between items-center rounded-[20px] cursor-pointer bg-green-400 bg-opacity-33 py-4 px-6"
              onClick={() =>
                window.open(
                  "https://explorer.solana.com/address/7FctSfSZ9GonfMrybp45hzoQyU71CEjjZFxxoSzqKWT/metadata?cluster=devnet",
                  "_blank"
                )
              }
            >
              <div className="flex justify-center items-center">
                <Image
                  src="/image/Logo.png"
                  alt="Logo"
                  className="dark:invert"
                  width={20}
                  height={14}
                  priority
                />
                <p className="font-bold text-xl">$PRINT</p>
              </div>

              <p className="text-lg font-bold">
                Solscan
                <span className="text-lg font-light">↗</span>
              </p>
            </div>
            <Space h="sm" />
            <div className="rounded-[20px] bg-green-400 bg-opacity-33 p-6">
              <p className="font-extrabold">$SOL EARNED</p>
              <Space h="sm" />
              <Title order={1}>
                {solBalance >= 0 ? solBalance : "Connect Wallet"}
              </Title>
            </div>
            <Space h="sm" />
            <div className="rounded-[20px] bg-green-400 bg-opacity-33 p-6">
              <p className="font-extrabold">$PRINT HELD</p>
              <Space h="sm" />
              <Title order={1}>
                {printBalance >= 0 ? printBalance : "Connect Wallet"}
              </Title>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
