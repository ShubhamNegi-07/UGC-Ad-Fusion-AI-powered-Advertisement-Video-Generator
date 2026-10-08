import type { Project } from "@/Types";

const PROJECT_PREFIX = "ugc.cache.project.";
const PROJECTS_LIST_KEY = "ugc.cache.projects.list";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function readCachedProject(projectId: string): Project | null {
  if (typeof sessionStorage === "undefined") return null;
  return safeParse<Project>(sessionStorage.getItem(`${PROJECT_PREFIX}${projectId}`));
}

export function writeCachedProject(project: Project): void {
  if (typeof sessionStorage === "undefined" || !project?.id) return;
  try {
    sessionStorage.setItem(`${PROJECT_PREFIX}${project.id}`, JSON.stringify(project));
  } catch {
    /* quota or private mode */
  }
}

export function readCachedProjectsList(): Project[] | null {
  if (typeof sessionStorage === "undefined") return null;
  const list = safeParse<Project[]>(sessionStorage.getItem(PROJECTS_LIST_KEY));
  return Array.isArray(list) ? list : null;
}

export function writeCachedProjectsList(projects: Project[]): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(PROJECTS_LIST_KEY, JSON.stringify(projects));
  } catch {
    /* ignore */
  }
}

export function readCachedCommunityProjects(): Project[] | null {
  if (typeof sessionStorage === "undefined") return null;
  const list = safeParse<Project[]>(sessionStorage.getItem("ugc.cache.community"));
  return Array.isArray(list) ? list : null;
}

export function writeCachedCommunityProjects(projects: Project[]): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem("ugc.cache.community", JSON.stringify(projects));
  } catch {
    /* ignore */
  }
}
