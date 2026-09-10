/**
 * Vercel Serverless Function: /api/reviews
 * Proxies Google Places API (New) to keep the API key server-side.
 * The key is stored in Vercel Environment Variables as GOOGLE_MAPS_API_KEY.
 * This file is safe to commit — it never contains the key itself.
 */

const PLACE_ID = 'ChIJN3x2cVdNDDkRepIFXERsB0Q';
const FIELDS   = 'id,displayName,rating,userRatingCount,reviews,googleMapsLinks';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?key=${key}`;
    const response = await fetch(url, {
      headers: {
        'X-Goog-FieldMask': FIELDS,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Places API error:', response.status, errBody);
      return res.status(502).json({ error: 'Failed to fetch from Google Places API.' });
    }

    const data = await response.json();

    const result = {
      rating:          data.rating          || null,
      userRatingCount: data.userRatingCount  || null,
      placeUrl:        data.googleMapsLinks?.placeUri || 'https://maps.app.goo.gl/WtvUxrdgJvaw3oHG8',
      reviews: (data.reviews || []).map(r => ({
        author_name:               r.authorAttribution?.displayName || 'Google User',
        author_url:                r.authorAttribution?.uri         || '#',
        rating:                    r.rating || 5,
        text:                      r.text   || '',
        relative_time_description: r.relativePublishTimeDescription || ''
      }))
    };

    // Cache 1 hour on Vercel CDN edge
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    res.setHeader('Access-Control-Allow-Origin', 'https://everest-electricals.vercel.app');
    return res.status(200).json(result);

  } catch (err) {
    console.error('Server error fetching reviews:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
