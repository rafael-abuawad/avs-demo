import { Link } from "@tanstack/react-router";
import { ConnectKitButton } from "connectkit";
import { Button } from "./ui/button";
import { ThemeModeToggle } from "./theme-mode-toggle";

export function Header() {
  return (
    <header className="py-4 flex gap-2 px-4">
      <nav className="flex flex-row items-center justify-between w-full container mx-auto">
        <div className="font-bold">
          <Link to="/">AVS Demo</Link>
        </div>
        <div className="flex items-center flex-row gap-2">
          <ThemeModeToggle />
          <ConnectKitButton.Custom>
            {({ isConnected, truncatedAddress, show }) => {
              if (isConnected) {
                return <Button onClick={show}>{truncatedAddress}</Button>;
              }
              return <Button onClick={show}>Connect Wallet</Button>;
            }}
          </ConnectKitButton.Custom>
        </div>
      </nav>
    </header>
  );
}
