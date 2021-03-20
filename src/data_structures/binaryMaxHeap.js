function swap (array, i, j) {
  const Temp = array[i]
  array[i] = array[j]
  array[j] = Temp
}

export class BinaryMaxHeap {
  constructor () {
    this._array = []
  }

  get size () {
    return this._array.length
  }

  parentOf (key) {
    return Math.floor((key - 1) / 2)
  }

  leftOf (key) {
    return 2 * key + 1
  }

  rightOf (key) {
    return 2 * key + 2
  }

  insert (value) {
    const Key = this._array.length
    this._array.push(value)
    this._keepHeapProperty(Key)
  }

  increaseKey (key, value) {
    if (value > this._array[key]) {
      this._array[key] = value
      this._keepHeapProperty(key)
    }
  }

  peekMax () {
    return this._array[0]
  }

  extractMax () {
    if (this.size > 0) {
      const Result = this.peekMax()
      const Value = this._array.pop()
      if (this.size > 0) {
        this._array[0] = Value
      }
      if (this.size > 0) {
        this._maxHeapify(0)
      }
      return Result
    }

    return null
  }

  delete (key) {
    this.increaseKey(key, Number.MAX_SAFE_INTEGER)
    this.extractMax()
  }

  decreaseKey (key, value) {
    if (value < this._array[key]) {
      this._array[key] = value
      this._maxHeapify(key)
    }
  }

  _keepHeapProperty (key) {
    let i = key
    while (i !== 0 && this._array[i] > this._array[this.parentOf(i)]) {
      swap(this._array, i, this.parentOf(i))
      i = this.parentOf(i)
    }
  }

  _maxHeapify (key) {
    const Left = this.leftOf(key)
    const Right = this.rightOf(key)

    let largest = key
    if (Left < this.size && this._array[Left] > this._array[largest]) {
      largest = Left
    }

    if (Right < this.size && this._array[Right] > this._array[largest]) {
      largest = Right
    }

    if (largest !== key) {
      swap(this._array, key, largest)
      this._maxHeapify(largest)
    }
  }
}
