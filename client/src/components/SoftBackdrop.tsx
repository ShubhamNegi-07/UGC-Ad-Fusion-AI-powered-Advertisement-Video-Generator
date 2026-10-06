export default function SoftBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#09090b]">
      <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_-20%,rgb(255_255_255/0.06),transparent_55%)]" />
      <div className="absolute left-[-12%] top-[18%] h-[28rem] w-[28rem] rounded-full bg-zinc-500/[0.07] blur-[140px]" />
      <div className="absolute right-[-8%] bottom-[-10%] h-[26rem] w-[26rem] rounded-full bg-zinc-400/[0.05] blur-[140px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_12%,transparent_70%)]" />
    </div>
  );
}
