// Simple binary heap based Priority Queue
// Items stored as { key, priority, data, seq }
class PriorityQueue {
  constructor() {
    this._heap = [];
    this._seq = 0; // tie-breaker for stable ordering
  }

  _parent(i) { return Math.floor((i - 1) / 2); }
  _left(i) { return 2 * i + 1; }
  _right(i) { return 2 * i + 2; }

  _swap(i, j) {
    const t = this._heap[i];
    this._heap[i] = this._heap[j];
    this._heap[j] = t;
  }

  _compare(a, b) {
    // higher priority value should come out first
    if (a.priority !== b.priority) return a.priority > b.priority;
    return a.seq < b.seq; // earlier inserted wins
  }

  _siftUp(i) {
    while (i > 0) {
      const p = this._parent(i);
      if (this._compare(this._heap[i], this._heap[p])) {
        this._swap(i, p);
        i = p;
      } else break;
    }
  }

  _siftDown(i) {
    while (true) {
      const l = this._left(i);
      const r = this._right(i);
      let largest = i;
      if (l < this._heap.length && this._compare(this._heap[l], this._heap[largest])) largest = l;
      if (r < this._heap.length && this._compare(this._heap[r], this._heap[largest])) largest = r;
      if (largest !== i) {
        this._swap(i, largest);
        i = largest;
      } else break;
    }
  }

  enqueue(key, priority = 0, data = null) {
    const node = { key, priority, data, seq: this._seq++ };
    this._heap.push(node);
    this._siftUp(this._heap.length - 1);
    return node;
  }

  peek() {
    return this._heap.length ? this._heap[0] : null;
  }

  dequeue() {
    if (!this._heap.length) return null;
    const top = this._heap[0];
    const last = this._heap.pop();
    if (this._heap.length) {
      this._heap[0] = last;
      this._siftDown(0);
    }
    return top;
  }

  size() { return this._heap.length; }

  isEmpty() { return this._heap.length === 0; }

  // Remove an item by key (first match). Returns removed item or null.
  removeByKey(key) {
    const idx = this._heap.findIndex(n => n.key === key);
    if (idx === -1) return null;
    const removed = this._heap[idx];
    const last = this._heap.pop();
    if (idx < this._heap.length) {
      this._heap[idx] = last;
      this._siftUp(idx);
      this._siftDown(idx);
    }
    return removed;
  }

  // Update priority of an existing key (first match). Returns true if updated.
  updatePriority(key, newPriority) {
    const idx = this._heap.findIndex(n => n.key === key);
    if (idx === -1) return false;
    this._heap[idx].priority = newPriority;
    this._siftUp(idx);
    this._siftDown(idx);
    return true;
  }

  toArray() {
    return this._heap.slice();
  }
}

module.exports = PriorityQueue;
