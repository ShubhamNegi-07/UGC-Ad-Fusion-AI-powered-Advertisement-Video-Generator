import { useMemo } from "react";
import type { Project } from "@/Types";

function aspectWeight(ratio: string): number {
  if (ratio === "9:16") return 1.65;
  if (ratio === "1:1") return 1;
  return 0.58;
}

/** Shortest-column masonry split (Framer-style wall). */
export function useMasonryColumns(projects: Project[], columnCount: number) {
  return useMemo(() => {
    const count = Math.max(1, Math.min(columnCount, projects.length || 1));
    const columns: Project[][] = Array.from({ length: count }, () => []);
    const heights = Array<number>(count).fill(0);

    for (const project of projects) {
      const w = aspectWeight(project.aspectRatio);
      let minIdx = 0;
      for (let i = 1; i < count; i++) {
        if (heights[i] < heights[minIdx]) minIdx = i;
      }
      columns[minIdx].push(project);
      heights[minIdx] += w + 0.12;
    }

    return columns;
  }, [projects, columnCount]);
}
