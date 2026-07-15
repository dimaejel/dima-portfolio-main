import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { ExperienceItem } from "@/types";

export function useExperience() {
  const [data, setData] = useState<ExperienceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .get<ExperienceItem[]>('/api/experience')
      .then((experience) => {
        if (active) setData(experience);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load experience');
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
