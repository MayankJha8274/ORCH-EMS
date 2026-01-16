const mapbox = require('./mapboxAdapter');
const dijkstra = require('./dijkstraAdapter');

async function getETA(from, to, opts = {}) {
  const timeoutMs = opts.timeoutMs || 3500;
  // call mapbox with timeout
  const mapboxPromise = mapbox.getRoute(from, to);
  const timeoutPromise = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), timeoutMs));
  try {
    const res = await Promise.race([mapboxPromise, timeoutPromise]);
    if (res && res.etaMinutes != null) return res;
  } catch (err) {
    // ignore and fallback
  }
  // fallback to dijkstra
  try {
    const dres = dijkstra.dijkstraGetRoute(from, to);
    return dres;
  } catch (err) {
    return { etaMinutes: 9999, route: [], source: 'none' };
  }
}

module.exports = { getETA };
