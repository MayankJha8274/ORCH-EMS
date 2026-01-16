const PriorityQueue = require('../priorityQueue');

class Graph {
  constructor() {
    this.nodes = new Map(); // id -> { id, lat, lng }
    this.adj = new Map(); // id -> [{ to, weight }]
  }

  addNode(id, lat, lng) {
    this.nodes.set(id, { id, lat, lng });
    if (!this.adj.has(id)) this.adj.set(id, []);
  }

  addEdge(a, b, weight) {
    if (!this.adj.has(a)) this.adj.set(a, []);
    this.adj.get(a).push({ to: b, weight });
  }

  getClosestNode(lat, lng) {
    let best = null;
    for (const [id, n] of this.nodes) {
      const d = (n.lat - lat)*(n.lat - lat) + (n.lng - lng)*(n.lng - lng);
      if (!best || d < best.d) best = { id, d };
    }
    return best ? best.id : null;
  }

  // Dijkstra from srcId to destId
  shortestPath(srcId, destId) {
    const dist = new Map();
    const prev = new Map();
    const pq = new PriorityQueue();
    for (const id of this.nodes.keys()) dist.set(id, Infinity);
    dist.set(srcId, 0);
    pq.enqueue(srcId, 0);
    while (!pq.isEmpty()) {
      const cur = pq.dequeue();
      const u = cur.key;
      if (u === destId) break;
      const neighbors = this.adj.get(u) || [];
      for (const { to, weight } of neighbors) {
        const alt = dist.get(u) + weight;
        if (alt < dist.get(to)) {
          dist.set(to, alt);
          prev.set(to, u);
          pq.enqueue(to, -alt); // pq highest priority first, so negative
        }
      }
    }
    if (!dist.has(destId) || dist.get(destId) === Infinity) return null;
    // reconstruct path
    const path = [];
    let u = destId;
    while (u) {
      path.unshift(u);
      u = prev.get(u);
    }
    return { path, travelTimeMinutes: Math.max(1, Math.round(dist.get(destId))) };
  }
}

// Build a small sample graph if none provided. In production replace with real graph.
function buildSampleGraph() {
  const g = new Graph();
  // sample nodes (ids 1..6) in a small area
  g.addNode('n1', 12.9700, 77.5900);
  g.addNode('n2', 12.9750, 77.5850);
  g.addNode('n3', 12.9800, 77.5800);
  g.addNode('n4', 12.9850, 77.5750);
  g.addNode('n5', 12.9900, 77.5700);
  g.addNode('n6', 12.9950, 77.5650);
  // edges with time weights (minutes)
  g.addEdge('n1', 'n2', 2);
  g.addEdge('n2', 'n3', 3);
  g.addEdge('n3', 'n4', 4);
  g.addEdge('n4', 'n5', 5);
  g.addEdge('n5', 'n6', 6);
  // add reverse
  g.addEdge('n2', 'n1', 2);
  g.addEdge('n3', 'n2', 3);
  g.addEdge('n4', 'n3', 4);
  g.addEdge('n5', 'n4', 5);
  g.addEdge('n6', 'n5', 6);
  return g;
}

const GRAPH = buildSampleGraph();

// locate nearest node and run Dijkstra
function dijkstraGetRoute(from, to) {
  const src = GRAPH.getClosestNode(from.lat, from.lng);
  const dst = GRAPH.getClosestNode(to.lat, to.lng);
  if (!src || !dst) return { etaMinutes: 9999, route: [], source: 'dijkstra' };
  const result = GRAPH.shortestPath(src, dst);
  if (!result) return { etaMinutes: 9999, route: [], source: 'dijkstra' };
  // convert node ids to coordinates for route
  const route = result.path.map(id => GRAPH.nodes.get(id));
  return { etaMinutes: result.travelTimeMinutes, route, source: 'dijkstra' };
}

module.exports = { dijkstraGetRoute, Graph };
