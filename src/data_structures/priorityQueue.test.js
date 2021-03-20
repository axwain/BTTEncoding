import {
  maxComparator,
  maxPriorityComparator,
  minComparator,
  minPriorityComparator,
  PriorityElement,
  PriorityQueue
} from './priorityQueue'

const Elements = [5, 10, 7, 2, 15]
const PriorityElements = Elements.map(e => { return new PriorityElement(e) })

function buildQueue (size, comparator = maxComparator, elements = Elements) {
  const Queue = new PriorityQueue(comparator)
  for (let i = 0; i < Math.min(size, elements.length); i++) {
    Queue.insert(elements[i])
  }
  return Queue
}

describe('PriorityQueue', () => {
  const EmptyQueue = new PriorityQueue()
  const OneQueue = buildQueue(1)
  const TwoQueue = buildQueue(2)
  const ThreeQueue = buildQueue(3)

  it('has a size of zero for an empty queue', () => {
    expect(EmptyQueue.size).toBe(0)
  })

  it('has a size of one after inserting one element', () => {
    expect(OneQueue.size).toBe(1)
  })

  it('returns null when peeking an empty queue', () => {
    expect(EmptyQueue.peek()).toBe(null)
  })

  it('returns the max element when peeking a single element queue', () => {
    expect(OneQueue.peek()).toBe(5)
  })

  it('returns the max element when peeking a queue', () => {
    expect(TwoQueue.peek()).toBe(10)
    expect(ThreeQueue.peek()).toBe(10)
  })

  it('throws an error when extracting max from an empty queue', () => {
    expect(() => { EmptyQueue.extractTop() }).toThrow()
  })

  it('extracts the max element of a single element queue', () => {
    const Queue = buildQueue(1)
    expect(Queue.extractTop()).toBe(5)
    expect(Queue.size).toBe(0)
  })

  it('extracts the max element from a queue', () => {
    const Queue = buildQueue(Elements.length)
    expect(Queue.extractTop()).toBe(15)
    expect(Queue.extractTop()).toBe(10)
    expect(Queue.size).toBe(3)
  })

  it('extracts the min element from a min priority queue', () => {
    const Queue = buildQueue(Elements.length, minComparator)
    expect(Queue.extractTop()).toBe(2)
    expect(Queue.extractTop()).toBe(5)
    expect(Queue.size).toBe(3)
  })

  it('extracts the max element of an object with priority', () => {
    const Queue = buildQueue(PriorityElements.length, maxPriorityComparator, PriorityElements)
    expect(Queue.extractTop().priority).toBe(15)
    expect(Queue.extractTop().priority).toBe(10)
    expect(Queue.size).toBe(3)
  })

  it('extracts the min element of an object with priority', () => {
    const Queue = buildQueue(PriorityElements.length, minPriorityComparator, PriorityElements)
    expect(Queue.extractTop().priority).toBe(2)
    expect(Queue.extractTop().priority).toBe(5)
    expect(Queue.size).toBe(3)
  })
})
