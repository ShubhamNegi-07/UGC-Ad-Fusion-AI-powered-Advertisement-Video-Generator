import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-marketing flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 pt-nav text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">404</p>
      <h1 className="studio-page-title mt-2 text-2xl font-semibold">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        This URL does not match any page in the app. Check the address or head back to Home.
      </p>
      <Button asChild variant="gradient" className="mt-8 min-h-11">
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  );
}
