const PriorityQueue = require('../src/services/priorityQueue');

const pq = new PriorityQueue();

console.log('Enqueue items (key, priority)');
pq.enqueue('e1', 5, { note: 'medium' });
pq.enqueue('e2', 10, { note: 'critical' });
pq.enqueue('e3', 3, { note: 'low' });
pq.enqueue('e4', 10, { note: 'critical but later' });

console.log('Size:', pq.size());
console.log('Peek:', pq.peek());

while (!pq.isEmpty()) {
  const top = pq.dequeue();
  console.log('Dequeued:', top.key, 'priority:', top.priority, 'data:', top.data);
}
