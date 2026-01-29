import { useEffect, useState } from "react";
import { getSections } from "@/lib/authClient";

export function useSections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSections()
      .then((data) => setSections(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { sections, loading, error };
}
