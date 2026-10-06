import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import "./index.css";
import App from "./App";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
const root = createRoot(document.getElementById("root") as HTMLElement);

if (!PUBLISHABLE_KEY) {
  root.render(
    <div className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
      <div className="glass max-w-lg rounded-2xl p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Clerk key missing</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Add <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">VITE_CLERK_PUBLISHABLE_KEY</code> to{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">client/.env</code>, then restart the Vite server.
          The API also needs <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">CLERK_PUBLISHABLE_KEY</code> and{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">CLERK_SECRET_KEY</code> in{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">server/.env</code>.
        </p>
      </div>
    </div>,
  );
} else {
  root.render(
    <StrictMode>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#fafafa",
            colorBackground: "#0c0c0e",
            colorText: "#fafafa",
            colorTextOnPrimaryBackground: "#09090b",
            colorInputBackground: "#18181b",
            colorInputText: "#fafafa",
            borderRadius: "0.75rem",
            fontFamily: '"Geist", ui-sans-serif, system-ui, sans-serif',
          },
          elements: {
            card: "shadow-2xl border border-white/10",
            userButtonPopoverCard: "border border-white/10 shadow-2xl",
          },
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    </StrictMode>,
  );
}
