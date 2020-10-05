import PQNode from "Classes/PQNode";

class PriorityQueue<K, V> {
  root: null | PQNode<K, V>;
  lastAdded: null | PQNode<K, V>;
  keyToNode: Map<K, PQNode<K, V>>;

  constructor() {
    // Initialize private properties
    this.root = null;
    this.lastAdded = null;
    this.keyToNode = new Map<K, PQNode<K, V>>(); //vertex to PQNode
  }

  private swap(child: PQNode<K, V>, parent: PQNode<K, V>) {
    let tempKey = child.key;
    let tempPriority = child.priority;
    child.key = parent.key;
    child.priority = parent.priority;
    parent.key = tempKey;
    parent.priority = tempPriority;
    this.keyToNode.set(parent.key, parent);
    this.keyToNode.set(child.key, child);
  }

  // Swaps key and value upward from insertion node
  // O(log n): heap height == log n
  // Only called when 'node' is not root
  private upheap(node: PQNode<K, V>) {
    let currNode = node;
    let parent = currNode.parent;

    while (currNode.priority < parent!.priority) {
      this.swap(currNode, parent!);
      if (parent!.isRoot()) {
        return;
      }
      currNode = parent!;
      parent = parent!.parent;
    }
  }

  // Swaps key and value downward from the root
  // O(log n): heap height == log n
  private downheap(node: PQNode<K, V>) {
    let currNode = node;

    while (currNode.isLeaf() === false) {
      // Choose smaller of children to swap and downheap
      let childNode =
        currNode.right === null ||
        currNode.left!.priority < currNode.right.priority
          ? currNode.left
          : currNode.right;
      if (childNode!.priority >= currNode.priority) {
        return;
      } else {
        this.swap(childNode!, currNode);
        currNode = childNode!;
      }
    }
  }

  // Inserts given node to its insertion node position
  // Finding the insertion node - O(log n)
  private insert(newNode: PQNode<K, V>) {
    // Recursively go up until left child or root is reached
    let currNode = this.lastAdded;

    while (currNode!.isRoot() === false && currNode!.isLeftChild() === false) {
      currNode = currNode!.parent;
    }
    // If left child, find sibling
    if (currNode!.isLeftChild()) {
      let parent = currNode!.parent;
      let sibling = parent!.right;
      // Case 1: If sibling is empty, insert here
      if (sibling === null) {
        parent!.right = newNode;
        newNode.parent = parent;
        this.lastAdded = newNode;
        return;
      } else {
        // Case 2: If sibling exists, start from sibling
        currNode = sibling;
      }
    }
    // Keep going down left until leaf, and insert as left child
    while (currNode!.isLeaf() === false) {
      currNode = currNode!.left;
    }
    currNode!.left = newNode;
    newNode.parent = currNode;
    this.lastAdded = newNode;
  }

  public decreaseKey(key: K, priority: V) {
    let node = this.keyToNode.get(key);
    if (node === undefined) return;

    node.priority = priority;
    if (node.isRoot() === false) {
      this.upheap(node);
    }
  }

  public enqueue(key: K, priority: V) {
    if (key === null || priority === null) {
      return;
    }
    const newNode = new PQNode(key, priority);
    if (this.root === null) {
      this.root = newNode;
      this.lastAdded = newNode;
      this.keyToNode.set(key, newNode);
    } else {
      this.insert(newNode);
      this.keyToNode.set(key, newNode);
      this.upheap(this.lastAdded!);
    }
  }

  // Removes item with the lowest priority (i.e. root)
  public dequeue() {
    if (this.isEmpty()) return null;

    if (this.root === this.lastAdded) {
      let key = this.root!.key;
      this.root = null;
      this.lastAdded = null;
      this.keyToNode.delete(key);
      return key;
    }

    // 1. Swap root priority and value with last element
    this.swap(this.root!, this.lastAdded!);

    // 2. Remove last element
    let key = this.lastAdded!.key;
    this.keyToNode.delete(key);

    if (this.lastAdded!.isLeftChild()) {
      // Prune last added element
      let currNode = this.lastAdded!.parent;
      currNode!.left = null;

      // Update last added element
      while (
        currNode!.isRoot() === false &&
        currNode!.isRightChild() === false
      ) {
        currNode = currNode!.parent;
      }
      if (currNode!.isRightChild()) {
        let sibling = currNode!.parent!.left;
        currNode = sibling;
      }
      while (currNode!.isLeaf() === false) {
        currNode = currNode!.right;
      }
      this.lastAdded = currNode;
    } else {
      this.lastAdded!.parent!.right = null;
      this.lastAdded = this.lastAdded!.parent!.left;
    }

    // 3. Down heap to maintain heap order
    this.downheap(this.root!);
    return key;
  }

  public isEmpty() {
    return this.root === null;
  }
}

export default PriorityQueue;
