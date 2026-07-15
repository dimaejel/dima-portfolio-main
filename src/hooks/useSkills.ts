import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { SkillGroupItem } from "@/types";

export function useSkills() {
  const [data, setData] = useState<SkillGroupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .get<SkillGroupItem[]>('/api/skills')
      .then((skills) => {
        if (active) setData(skills);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load skills');
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
