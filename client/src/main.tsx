import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppWithClerk from "@/components/AppWithClerk";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
const root = createRoot(document.getElementById("root") as HTMLElement);

if (!PUBLISHABLE_KEY) {
  root.render(
    <div
      role="alert"
      className="grid min-h-screen place-items-center px-6"
      style={{
        backgroundColor: "#07070a",
        color: "#f5f2eb",
        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      <div
        className="max-w-lg rounded-2xl p-8"
        style={{
          backgroundColor: "#1a1917",
          border: "1px solid #2e2c28",
          boxShadow: "0 4px 24px rgb(0 0 0 / 0.45)",
        }}
      >
        <p
          className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "#2dd4bf" }}
        >
          Configuration required
        </p>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#f5f2eb" }}>
          Clerk publishable key missing
        </h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "#9c958c" }}>
          Set{" "}
          <code
            className="rounded px-1.5 py-0.5 font-mono text-xs"
            style={{ backgroundColor: "#242220", color: "#e7e5e4" }}
          >
            VITE_CLERK_PUBLISHABLE_KEY
          </code>{" "}
          in{" "}
          <code
            className="rounded px-1.5 py-0.5 font-mono text-xs"
            style={{ backgroundColor: "#242220", color: "#e7e5e4" }}
          >
            client/.env
          </code>
          , then restart the dev server or rebuild.
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
