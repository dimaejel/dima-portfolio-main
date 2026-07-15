import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { CertificateItem } from "@/types";

export function useCertificates() {
  const [data, setData] = useState<CertificateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .get<CertificateItem[]>('/api/certificates')
      .then((certificates) => {
        if (active) setData(certificates);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load certificates');
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
