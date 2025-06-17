import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";

export function NoWallet() {
  const { isConnected } = useAccount();

  if (isConnected) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md">
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-sm text-muted-foreground">
          To add an entry, please connect your wallet.
        </p>
        <ConnectKitButton.Custom>
          {({ show }) => {
            return <Button onClick={show}>Connect Wallet</Button>;
          }}
        </ConnectKitButton.Custom>
      </div>
    </div>
  );
}
