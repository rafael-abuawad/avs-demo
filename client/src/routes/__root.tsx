import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { Web3Provider } from "@/components/web3-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/footer";

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Web3Provider>
        <div className="flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto py-8">
            <Outlet />
            <Footer />
          </main>
        </div>
        <Toaster />
        <TanStackRouterDevtools />
      </Web3Provider>
    </ThemeProvider>
  ),
});
