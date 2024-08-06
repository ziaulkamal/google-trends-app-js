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
        await postQueries(data); // Kirim data setelah diambil
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    async function postQueries(data) {
      const domain = window.location.origin;

      const postRequests = data.map(async (query) => {
        try {
          const response = await fetch('http://autocreatecontent.test/api/job', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              keyword: query,
              url: domain,
              status: false,
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to send data for query "${query}": ${response.statusText}`);
          }
        } catch (error) {
          console.error(`Error sending query "${query}": ${error.message}`);
        }
      });

      // Tunggu semua POST requests selesai
      await Promise.all(postRequests);
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
