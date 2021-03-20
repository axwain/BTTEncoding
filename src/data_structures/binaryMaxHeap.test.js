import { BinaryMaxHeap } from './binaryMaxHeap'

test('BinaryMaxHeap', () => {
  const Heap = new BinaryMaxHeap()

  Heap.insert(45)
  Heap.insert(15)
  Heap.delete(1)
  Heap.insert(2)
  Heap.insert(5)
  Heap.insert(4)
  Heap.insert(3)

  expect(Heap.size).toBe(5)
  expect(Heap.extractMax(45)).toBe(45)
  expect(Heap.size).toBe(4)
  expect(Heap.peekMax()).toBe(5)

  Heap.increaseKey(2, 10)
  expect(Heap.peekMax()).toBe(10)

  Heap.decreaseKey(0, 3)
  expect(Heap.peekMax()).toBe(5)

  Heap.increaseKey(0, 4)
  expect(Heap.peekMax()).toBe(5)

  Heap.decreaseKey(0, 10)
  expect(Heap.peekMax()).toBe(5)

  expect(Heap.extractMax()).toBe(5)
  expect(Heap.size).toBe(3)
  expect(Heap.extractMax()).toBe(4)
  expect(Heap.size).toBe(2)
  expect(Heap.extractMax()).toBe(3)
  expect(Heap.size).toBe(1)
  expect(Heap.extractMax()).toBe(2)
  expect(Heap.size).toBe(0)
  expect(Heap.extractMax()).toBe(null)
})
