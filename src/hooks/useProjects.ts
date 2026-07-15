import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { ProjectItem } from "@/types";

export function useProjects() {
  const [data, setData] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .get<ProjectItem[]>('/api/projects')
      .then((projects) => {
        if (active) setData(projects);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load projects');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, isLoading, error };
}
