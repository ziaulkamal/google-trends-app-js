// src/app/api/trends/sendTrendToLaravel.js
export async function sendTrendToLaravel(trend, domain) {
  try {
    const response = await fetch('http://autocreatecontent.test/api/job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyword: trend,
        url: domain,
        status: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send data to Laravel: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error sending trend to Laravel: ${error.message}`);
    throw error;
  }
}
