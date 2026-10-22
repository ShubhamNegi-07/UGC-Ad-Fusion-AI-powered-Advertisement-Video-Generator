function apiBase() {
  return String(import.meta.env.VITE_BASEURL || "http://localhost:5000").replace(/\/$/, "");
}

export function fileSlug(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "ad"
  );
}

async function fetchDownload(url: string) {
  try {
    const direct = await fetch(url);
    if (direct.ok) return direct;
  } catch {
    // Cross-origin hosts often block browser fetch; use the app proxy next.
  }

  const proxy = await fetch(`${apiBase()}/api/project/download?url=${encodeURIComponent(url)}`);
  if (!proxy.ok) {
    throw new Error("Could not download this file");
  }
  return proxy;
}

export async function downloadMediaFile(url: string | undefined, filename: string) {
  if (!url) {
    throw new Error("Nothing to download");
  }

  const response = await fetchDownload(url);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
}
