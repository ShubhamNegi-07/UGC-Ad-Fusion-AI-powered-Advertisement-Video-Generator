/** WCAG 2.x relative luminance contrast ratio (no deps). */

function parseHex(hex) {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = Number.parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function lin(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance({ r, g, b }) {
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function ratio(fg, bg) {
  const L1 = luminance(parseHex(fg));
  const L2 = luminance(parseHex(bg));
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

const studio = {
  background: "#0f0e0c",
  card: "#1a1917",
  foreground: "#f5f2eb",
  mutedForeground: "#9c958c",
  brand: "#0f766e",
  brandForeground: "#ffffff",
  placeholder: "#6b6560",
};

const pairs = [
  ["foreground on background", studio.foreground, studio.background],
  ["foreground on card", studio.foreground, studio.card],
  ["muted on background", studio.mutedForeground, studio.background],
  ["muted on card", studio.mutedForeground, studio.card],
  ["brand-foreground on brand", studio.brandForeground, studio.brand],
  ["placeholder on card", studio.placeholder, studio.card],
  ["placeholder on background", studio.placeholder, studio.background],
];

console.log("WCAG contrast ratios (computed):\n");
for (const [label, fg, bg] of pairs) {
  const r = ratio(fg, bg);
  const pass = r >= 4.5 ? "PASS AA normal" : r >= 3 ? "PASS AA large only" : "FAIL";
  console.log(`${label}: ${r.toFixed(2)}:1 — ${pass} (${fg} on ${bg})`);
}

console.log(
  "\nNote: white on #0F766E uses brand button pair above. Earlier ~4.8 vs ~5.47 can differ if fg was off-white (#f5f2eb) vs pure #FFFFFF, or bg teal rounded differently.",
);
