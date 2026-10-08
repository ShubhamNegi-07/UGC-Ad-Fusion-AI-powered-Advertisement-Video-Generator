import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppWithClerk from "@/components/AppWithClerk";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
const root = createRoot(document.getElementById("root") as HTMLElement);

if (!PUBLISHABLE_KEY) {
  root.render(
    <div className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
      <div className="surface-panel max-w-lg rounded-[var(--radius-lg)] p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Clerk key missing</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Add <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">VITE_CLERK_PUBLISHABLE_KEY</code> to{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">client/.env</code>, then restart the Vite server.
        </p>
      </div>
    </div>,
  );
} else {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <AppWithClerk />
      </BrowserRouter>
    </StrictMode>,
  );
}
