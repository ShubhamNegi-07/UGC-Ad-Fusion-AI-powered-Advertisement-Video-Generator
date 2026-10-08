export default function SoftBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background">
      <div className="backdrop-layer backdrop-marketing absolute inset-0" />
      <div className="backdrop-layer backdrop-studio absolute inset-0" />
    </div>
  );
}
