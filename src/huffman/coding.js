import { Node } from '../data_structures/binaryTree'
import { PriorityQueue } from '../data_structures/priorityQueue'

class HuffmanNode extends Node {
  constructor (frequency, symbol) {
    super(frequency)
    this.symbol = symbol
  }
}

export function frequencyCount (iterable) {
  const Frequencies = {}
  if (iterable.length > 0) {
    iterable.reduce((accumulator, value) => {
      if (accumulator[value]) {
        accumulator[value]++
      } else {
        accumulator[value] = 1
      }
      return accumulator
    }, Frequencies)
  }
  return Frequencies
}

export function buildHuffmanTree (iterable) {
  const Frequencies = frequencyCount(iterable)
  const Elements = Object.keys(Frequencies)
  const Queue = new PriorityQueue((a, b) => a.data < b.data)

  Elements.map(e => Queue.insert(new HuffmanNode(Frequencies[e], e)))
  if (Elements.length > 0) {
    while (Queue.size > 1) {
      const Left = Queue.extractTop()
      const Right = Queue.extractTop()
      const TopNode = new HuffmanNode(Left.data + Right.data, null)
      TopNode.left = Left
      TopNode.right = Right
      Queue.insert(TopNode)
    }
    return Queue.extractTop()
  }
  return new HuffmanNode(null, null)
}
