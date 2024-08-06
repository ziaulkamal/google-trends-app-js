'use client'; // Menandai file ini sebagai komponen klien

import { useEffect, useState } from 'react';

export default function TrendsPage() {
  const [queries, setQueries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQueries() {
      try {
        const response = await fetch('/api/trends');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setQueries(data);
        await getQueries(data); // Kirim data dengan GET setelah diambil
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    async function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getQueries(data) {
      const domain = window.location.origin;
      const searchApiUrl = process.env.NEXT_PUBLIC_SEARCH_API_URL; // Ambil URL dari environment variable

      const getRequests = data.map(async (query) => {
        try {
          await sleep(3000);
          const response = await fetch(`${searchApiUrl}?query=${encodeURIComponent(query)}`, {
            method: 'GET',
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch data for query "${query}": ${response.statusText}`);
          }
        } catch (error) {
          console.error(`Error fetching query "${query}": ${error.message}`);
        }
      });

      // Tunggu semua GET requests selesai
      await Promise.all(getRequests);
    }

    fetchQueries();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <pre>{JSON.stringify({ error }, null, 2)}</pre>;
  }

  return <pre>{JSON.stringify(queries, null, 2)}</pre>;
}
