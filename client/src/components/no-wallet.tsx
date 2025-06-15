import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";

export function NoWallet({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();

  if (isConnected) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-bold">No Wallet Connected</h1>
        <p className="text-sm text-muted-foreground">
          Please connect your wallet to continue
        </p>
        <ConnectKitButton.Custom>
          {({ isConnected, show }) => {
            return (
              <Button onClick={show}>
                {isConnected ? "Connected" : "Connect Wallet"}
              </Button>
            );
          }}
        </ConnectKitButton.Custom>
      </div>
    </div>
  );
}
