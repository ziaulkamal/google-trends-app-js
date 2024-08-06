// src/app/api/trends/route.js
import GoogleTrendsAPI from 'google-trends-api';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Ambil data tren
    const results = await GoogleTrendsAPI.dailyTrends({
      trendDate: new Date(),
      geo: 'US',
    });

    // Parsing hasil
    const data = JSON.parse(results);
    const trends = data.default.trendingSearchesDays.flatMap(day => day.trendingSearches.map(search => search.title.query));

    // Ganti spasi dengan tanda minus
    const modifiedTrends = trends.map(query => query.replace(/\s+/g, '-'));

    // Simpan ke file JSON di direktori public
    const filePath = path.join(process.cwd(), 'public', 'trends.json');
    fs.writeFileSync(filePath, JSON.stringify(modifiedTrends, null, 2));

    // Redirect ke file JSON
    return new Response(null, {
      status: 302,
      headers: { Location: '/trends.json' },
    });
  } catch (error) {
    console.error('Failed to fetch trends', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch trends' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
