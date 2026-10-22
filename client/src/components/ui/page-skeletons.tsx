import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const SHELL = "studio-shell studio-shell-bottom studio-scroll-pad relative overflow-x-clip pt-nav";

function StudioHeaderSkeleton({ withActions = false }: { withActions?: boolean }) {
  return (
    <div className="surface-panel relative mb-6 overflow-hidden rounded-2xl border border-white/10 p-4 sm:p-6 md:mb-10 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-8 w-48 max-w-full rounded-lg sm:h-9 sm:w-64" />
          <Skeleton className="hidden h-4 w-80 max-w-full rounded-md sm:block" />
        </div>
        {withActions ? (
          <div className="flex w-full gap-2 sm:w-auto">
            <Skeleton className="size-11 shrink-0 rounded-xl" />
            <Skeleton className="h-11 min-w-0 flex-1 rounded-xl sm:w-40 sm:flex-none" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function GeneratorPageSkeleton() {
  return (
    <div className={SHELL} aria-busy="true" aria-label="Loading Create">
      <Skeleton className="mb-4 h-7 w-56 max-w-full rounded-lg sm:mb-6 sm:h-8 sm:w-72" />
      <div className="mb-5 grid grid-cols-3 gap-2 sm:mb-10 sm:max-w-3xl sm:gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="surface-panel rounded-[var(--radius-lg)] px-2 py-2 sm:px-4 sm:py-3">
            <Skeleton className="h-4 w-14 rounded-md sm:h-5 sm:w-20" />
            <Skeleton className="mt-1.5 hidden h-3 w-24 rounded-md sm:block" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-start">
        <div className="surface-panel rounded-[var(--radius-lg)] p-4 sm:p-6">
          <Skeleton className="h-5 w-32 rounded-md" />
          <Skeleton className="mt-2 h-3.5 w-48 max-w-full rounded-md" />
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-5">
            <Skeleton className="aspect-square w-full rounded-[var(--radius-lg)]" />
            <Skeleton className="aspect-square w-full rounded-[var(--radius-lg)]" />
          </div>
        </div>
        <div className="surface-panel rounded-[var(--radius-lg)] p-4 sm:p-6">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="mt-2 h-3.5 w-44 max-w-full rounded-md" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-28 rounded-md" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3.5 w-36 rounded-md" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <div className="mt-4 space-y-2.5">
            <Skeleton className="h-3.5 w-24 rounded-md" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-16 rounded-[var(--radius-md)] sm:h-[4.5rem]" />
              <Skeleton className="h-16 rounded-[var(--radius-md)] sm:h-[4.5rem]" />
              <Skeleton className="h-16 rounded-[var(--radius-md)] sm:h-[4.5rem]" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3.5 w-32 rounded-md" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="size-11 rounded-[var(--radius-md)]" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-44 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-11 w-full rounded-xl sm:w-44" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResultWorkspaceSkeleton() {
  return (
    <div
      className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_min(22rem,32vw)] xl:grid-cols-[minmax(0,1fr)_26rem]"
      aria-hidden
    >
      <div className="surface-panel flex w-full items-center justify-center rounded-[var(--radius-xl)] p-3 sm:p-4">
        <Skeleton className="aspect-[9/16] w-full max-w-[min(100%,22rem)] rounded-[var(--radius-lg)]" />
      </div>
      <div className="surface-panel flex w-full flex-col gap-4 rounded-[var(--radius-xl)] p-5 sm:p-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 rounded-md" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-10 rounded-[var(--radius-md)]" />
            <Skeleton className="h-10 rounded-[var(--radius-md)]" />
          </div>
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-28 rounded-md" />
          <div className="flex gap-1.5">
            <Skeleton className="h-11 min-w-0 flex-1 rounded-xl" />
            <Skeleton className="size-11 shrink-0 rounded-xl" />
          </div>
          <div className="flex gap-1.5">
            <Skeleton className="h-11 min-w-0 flex-1 rounded-xl" />
            <Skeleton className="size-11 shrink-0 rounded-xl" />
          </div>
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ResultPageSkeleton({ embedded = false }: { embedded?: boolean }) {
  const body = (
    <>
      <StudioHeaderSkeleton withActions />
      <ResultWorkspaceSkeleton />
    </>
  );
  if (embedded) {
    return (
      <div aria-busy="true" aria-label="Loading result">
        {body}
      </div>
    );
  }
  return (
    <div className={SHELL} aria-busy="true" aria-label="Loading result">
      {body}
    </div>
  );
}

const communityRatios = ["9:16", "9:16", "1:1", "9:16", "16:9", "9:16"] as const;

function communityFrameClass(ratio: (typeof communityRatios)[number]) {
  if (ratio === "16:9") return "aspect-video w-full";
  if (ratio === "1:1") return "aspect-square w-full";
  return "mx-auto aspect-[9/16] w-full max-w-[min(100%,18rem)]";
}

function CommunityTileSkeleton({ ratio }: { ratio: (typeof communityRatios)[number] }) {
  const portrait = ratio === "9:16";
  return (
    <article className="surface-panel flex w-full min-w-0 flex-col overflow-hidden rounded-[1.1rem] border border-white/8">
      <div
        className={cn(
          "relative flex items-center justify-center bg-[var(--studio-media-bg,#070b12)]",
          portrait ? "px-3 py-3" : "",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-white/[0.1]",
            communityFrameClass(ratio),
            portrait && "rounded-lg ring-1 ring-white/15",
          )}
        >
          <Skeleton className="absolute inset-0 rounded-none bg-white/[0.16]" />
          <Skeleton className="absolute left-2 top-2 z-[1] h-5 w-12 rounded-full bg-white/20" />
          {!portrait ? (
            <div className="absolute right-1.5 top-1.5 z-[1] flex gap-1">
              <Skeleton className="size-6 rounded-full bg-white/20" />
              <Skeleton className="size-6 rounded-full bg-white/20" />
            </div>
          ) : null}
        </div>
        {portrait ? (
          <div className="absolute right-1.5 top-2 z-[1] flex flex-col gap-1">
            <Skeleton className="size-6 rounded-full bg-white/20" />
            <Skeleton className="size-6 rounded-full bg-white/20" />
          </div>
        ) : null}
      </div>
      <div className="flex items-start gap-2 px-3.5 py-3">
        <Skeleton className="mt-0.5 size-6 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-3.5 w-24 rounded-md" />
          <Skeleton className="mt-1.5 h-3 w-20 rounded-md" />
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-3 w-8 rounded-md" />
          </div>
        </div>
      </div>
    </article>
  );
}

export function CommunityPageSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="studio-shell studio-shell-bottom relative pt-nav" aria-busy="true" aria-label="Loading community">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-7 w-36 rounded-lg" />
          <Skeleton className="h-4 w-72 max-w-full rounded-md" />
        </div>
        <Skeleton className="h-9 w-[8.5rem] shrink-0 rounded-xl" />
      </div>
      <CommunityFeedSkeleton count={count} />
    </div>
  );
}

export function CommunityFeedSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 items-start gap-4 sm:grid-cols-[repeat(auto-fill,minmax(16.5rem,1fr))] sm:gap-5"
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <CommunityTileSkeleton key={i} ratio={communityRatios[i % communityRatios.length]} />
      ))}
    </div>
  );
}

export function MyGenerationsPageSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={SHELL} aria-busy="true" aria-label="Loading generations">
      <StudioHeaderSkeleton withActions />
      <MyGenerationsGridSkeleton count={count} />
    </div>
  );
}

export function MyGenerationsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface-panel flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border">
          <Skeleton className="aspect-[4/5] w-full rounded-none" />
          <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-2/3 rounded-md" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <Skeleton className="h-3 w-1/3 rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-11 rounded-xl" />
                <Skeleton className="h-11 rounded-xl" />
              </div>
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PlansPageSkeleton() {
  return (
    <div className="bg-background" aria-busy="true" aria-label="Loading plans">
      <section className="hero-dark-band relative overflow-hidden pb-10 pt-nav md:pb-14">
        <div className="container-marketing space-y-3">
          <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
          <Skeleton className="h-9 w-72 max-w-full rounded-lg bg-white/10 sm:h-10 sm:w-[28rem]" />
          <Skeleton className="h-4 w-80 max-w-full rounded-md bg-white/10" />
        </div>
      </section>
      <div className="container-marketing pb-16 pt-10 md:pt-12">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-[var(--radius-xl)] border-2 border-brand bg-card p-6">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="mt-4 h-8 w-24 rounded-lg" />
            <Skeleton className="mt-2 h-4 w-52 max-w-full rounded-md" />
            <div className="mt-6 space-y-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <Skeleton className="mt-8 h-12 w-full rounded-xl" />
          </div>
          <div className="rounded-[var(--radius-xl)] border border-border bg-muted/20 p-6">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="mt-4 h-8 w-36 rounded-lg" />
            <Skeleton className="mt-2 h-16 w-full rounded-md" />
            <Skeleton className="mt-8 h-12 w-full rounded-xl" />
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-3xl space-y-3">
          <Skeleton className="mx-auto h-8 w-20 rounded-lg" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-[var(--radius-lg)]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomeSectionsSkeleton() {
  return (
    <div className="bg-background" aria-busy="true" aria-label="Loading home sections">
      <section className="border-t border-border py-[var(--space-section)]">
        <div className="container-marketing grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-3">
            <Skeleton className="h-3 w-28 rounded-full" />
            <Skeleton className="h-9 w-full max-w-md rounded-lg" />
            <Skeleton className="h-4 w-full max-w-lg rounded-md" />
            <Skeleton className="h-4 w-5/6 max-w-md rounded-md" />
            <div className="mt-6 space-y-2">
              <Skeleton className="h-12 w-full max-w-md rounded-xl" />
              <Skeleton className="h-12 w-full max-w-md rounded-xl" />
              <Skeleton className="h-12 w-full max-w-md rounded-xl" />
            </div>
            <Skeleton className="mt-6 h-11 w-36 rounded-xl" />
          </div>
          <Skeleton className="aspect-[4/3] w-full rounded-[var(--radius-xl)]" />
        </div>
      </section>
      <section className="border-y border-border bg-muted/35 py-[var(--space-section)]">
        <div className="container-marketing grid items-center gap-10 lg:grid-cols-2">
          <Skeleton className="order-2 aspect-video w-full rounded-[var(--radius-xl)] lg:order-1" />
          <div className="order-1 space-y-3 lg:order-2">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-8 w-64 max-w-full rounded-lg" />
            <Skeleton className="h-4 w-full max-w-md rounded-md" />
            <Skeleton className="h-4 w-5/6 max-w-sm rounded-md" />
          </div>
        </div>
      </section>
      <section className="py-[var(--space-section)]">
        <div className="container-marketing">
          <div className="mb-8 space-y-3">
            <Skeleton className="h-3 w-16 rounded-full" />
            <Skeleton className="h-8 w-80 max-w-full rounded-lg" />
          </div>
          <div className="grid gap-4 md:grid-cols-6">
            <Skeleton className="h-64 rounded-[var(--radius-xl)] md:col-span-4 md:h-80" />
            <div className="grid gap-4 md:col-span-2">
              <Skeleton className="h-36 rounded-[var(--radius-xl)]" />
              <Skeleton className="h-36 rounded-[var(--radius-xl)]" />
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-border bg-muted/30 py-[var(--space-section)]">
        <div className="container-marketing mx-auto max-w-3xl space-y-4 text-center">
          <Skeleton className="mx-auto h-3 w-16 rounded-full" />
          <Skeleton className="mx-auto h-8 w-56 rounded-lg" />
          <div className="mx-auto grid max-w-md gap-3 sm:grid-cols-2">
            <Skeleton className="h-20 rounded-[var(--radius-lg)]" />
            <Skeleton className="h-20 rounded-[var(--radius-lg)]" />
          </div>
        </div>
      </section>
      <section className="py-[var(--space-section)]">
        <div className="container-marketing mx-auto max-w-3xl space-y-3">
          <Skeleton className="h-8 w-64 max-w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-[var(--radius-lg)]" />
          <Skeleton className="h-16 w-full rounded-[var(--radius-lg)]" />
          <Skeleton className="h-16 w-full rounded-[var(--radius-lg)]" />
        </div>
      </section>
    </div>
  );
}

export function LoadingPageSkeleton() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 pt-nav" aria-busy="true" aria-label="Loading">
      <Skeleton className="size-16 rounded-2xl" />
      <Skeleton className="h-5 w-32 rounded-md" />
      <Skeleton className="h-4 w-52 rounded-md" />
    </div>
  );
}

export function NotFoundPageSkeleton() {
  return (
    <div className="container-marketing flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 pt-nav" aria-busy="true">
      <Skeleton className="h-3 w-10 rounded-md" />
      <Skeleton className="mt-3 h-8 w-48 rounded-lg" />
      <Skeleton className="mt-3 h-4 w-72 max-w-full rounded-md" />
      <Skeleton className="mt-8 h-11 w-36 rounded-xl" />
    </div>
  );
}

export function PageRouteSkeleton({ pathname }: { pathname: string }) {
  if (pathname.startsWith("/generate")) return <GeneratorPageSkeleton />;
  if (pathname.startsWith("/result")) return <ResultPageSkeleton />;
  if (pathname.startsWith("/my-generations")) return <MyGenerationsPageSkeleton />;
  if (pathname.startsWith("/community")) return <CommunityPageSkeleton />;
  if (pathname.startsWith("/plans")) return <PlansPageSkeleton />;
  if (pathname.startsWith("/loading")) return <LoadingPageSkeleton />;
  if (pathname.startsWith("/dev")) return <MyGenerationsPageSkeleton />;
  return <NotFoundPageSkeleton />;
}
