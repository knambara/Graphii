class PQNode<K, V> {
  key: K;
  priority: V;
  left: PQNode<K, V> | null;
  right: PQNode<K, V> | null;
  parent: PQNode<K, V> | null;

  constructor(item: K, value: V) {
    this.key = item;
    this.priority = value;
    this.left = null;
    this.right = null;
    this.parent = null;
  }

  isLeaf() {
    return this.left === null && this.right === null;
  }

  isRoot() {
    return this.parent === null;
  }

  isLeftChild() {
    if (this.isRoot()) {
      return false;
    }
    return this.parent!.left === this;
  }

  isRightChild() {
    if (this.isRoot()) {
      return false;
    }
    return this.parent!.right === this;
  }
}

export default PQNode;
