const fetch = require('node-fetch');

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || '';

async function mapboxGetRoute(from, to) {
  if (!MAPBOX_TOKEN) {
    throw new Error('MAPBOX_TOKEN not configured');
  }
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${coords}?access_token=${MAPBOX_TOKEN}&overview=full&geometries=geojson&annotations=duration`;
  const res = await fetch(url, { timeout: 8000 });
  if (!res.ok) throw new Error(`Mapbox error ${res.status}`);
  const body = await res.json();
  if (!body.routes || !body.routes.length) throw new Error('No routes from Mapbox');
  const route = body.routes[0];
  const etaSeconds = route.duration || 0;
  //Mapbox gives seconds, you convert to minutes.
  const etaMinutes = Math.max(1, Math.round(etaSeconds / 60));
  return { etaMinutes, route: route.geometry, source: 'mapbox', raw: route };
}

module.exports = { mapboxGetRoute };
