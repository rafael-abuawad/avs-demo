import { Link } from "@tanstack/react-router";
import { ConnectKitButton } from "connectkit";
import { Button } from "./ui/button";
import { ThemeModeToggle } from "./theme-mode-toggle";

export function Header() {
  return (
    <header className="py-4 flex gap-2">
      <nav className="flex flex-row items-center justify-between w-full container mx-auto px-4">
        <div className="flex flex-row items-center gap-2">
          <div className="font-bold hover:underline">
            <Link to="/">AVS Demo</Link>
          </div>
          <div className="hover:underline">
            <Link to="/entries">Entries</Link>
          </div>
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
