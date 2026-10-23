/// <reference types="vite/client" />

declare module "@hugeicons/core-free-icons/*" {
  const icon: import("@hugeicons/react").IconSvgElement;
  export default icon;
}

/** Relative deep imports used by src/icons.ts (package exports block the public specifier). */
declare module "../node_modules/@hugeicons/core-free-icons/dist/esm/*.js" {
  const icon: import("@hugeicons/react").IconSvgElement;
  export default icon;
}
