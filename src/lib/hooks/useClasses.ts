import { useEffect, useState } from "react";
import { getClasses } from "@/lib/authClient";

export function useClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getClasses()
      .then((res) => setClasses(res.classes))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { classes, loading, error };
}
