import { WagmiProvider, createConfig } from "wagmi";
import { arbitrum } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [arbitrum],

    // Required API Keys
    walletConnectProjectId: "",

    // Required App Info
    appName: "AVS Demo",

    // Optional App Info
    appDescription:
      "AVS Demo is a test Web3 application that implements an Autonomous Verification System (AVS) for validating and recording data on the blockchain.",
    appUrl: "https://avs-demo.vercel.app", // your app's url
    appIcon: "https://avs-demo.vercel.app/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
