export function maxComparator (a, b) {
  return a > b
}

export function maxPriorityComparator (a, b) {
  return a.priority > b.priority
}

export function minComparator (a, b) {
  return a < b
}

export function minPriorityComparator (a, b) {
  return a.priority < b.priority
}

export class PriorityElement {
  constructor (priority) {
    this._priority = priority
  }

  get priority () {
    return this._priority
  }
}

export class PriorityQueue {
  constructor (comparator = maxComparator) {
    this._array = []
    this._comparator = comparator
  }

  get size () {
    return this._array.length
  }

  extractTop () {
    if (this.size > 0) {
      this._swap(0, this.size - 1)
      const Result = this._array.pop()
      this._heapify(0)
      return Result
    }

    throw new Error('Can\'t extract max value from an empty queue')
  }

  insert (element) {
    this._array.push(element)
    this._keepHeapProperty(this.size - 1)
  }

  peek () {
    return this.size > 0 ? this._array[0] : null
  }

  _compare (a, b) {
    return this._comparator(this._array[a], this._array[b])
  }

  _keepHeapProperty (key) {
    let i = key
    while (i !== 0 && this._compare(i, this._getParent(i))) {
      this._swap(i, this._getParent(i))
      i = this._getParent(i)
    }
  }

  _getParent (key) {
    return Math.floor((key - 1) / 2)
  }

  _heapify (index) {
    let largestIndex = index
    const LeftChild = 2 * index + 1
    const RightChild = 2 * index + 2

    if (LeftChild < this.size && this._compare(LeftChild, largestIndex)) {
      largestIndex = LeftChild
    }

    if (RightChild < this.size && this._compare(RightChild, largestIndex)) {
      largestIndex = RightChild
    }

    if (largestIndex !== index) {
      this._swap(index, largestIndex)
      this._heapify(largestIndex)
    }
  }

  _swap (aIndex, bIndex) {
    const Temp = this._array[aIndex]
    this._array[aIndex] = this._array[bIndex]
    this._array[bIndex] = Temp
  }
}
