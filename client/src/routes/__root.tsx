import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { Web3Provider } from "../components/web3-provider";
import { NoWallet } from "@/components/no-wallet";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Web3Provider>
          <>
            <Header />
            <NoWallet>
              <Outlet />
            </NoWallet>
            <Toaster />
          </>
        </Web3Provider>
      </ThemeProvider>
      <TanStackRouterDevtools />
    </>
  ),
});
