import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Props = { children: ReactNode };
type State = { error: Error | null };

export default class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Route crashed", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="container-marketing flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 pt-nav text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Page error</p>
        <h1 className="studio-page-title mt-2 text-2xl font-semibold">This page failed to load</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Reload the page, or go back home. If it keeps happening, hard-refresh the tab.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button framer={false} variant="gradient" className="min-h-11" onClick={() => this.setState({ error: null })}>
            Try again
          </Button>
          <Button asChild framer={false} variant="outline" className="min-h-11">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }
}
