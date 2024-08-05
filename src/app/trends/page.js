'use client'; // Menandai file ini sebagai komponen klien

import { useEffect, useState } from 'react';

export default function TrendsPage() {
  const [queries, setQueries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQueries() {
      try {
        const response = await fetch('/api/trends');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setQueries(data);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchQueries();
  }, []);

  if (error) {
    return <pre>{JSON.stringify({ error }, null, 2)}</pre>;
  }

  return <pre>{JSON.stringify(queries, null, 2)}</pre>;
}
