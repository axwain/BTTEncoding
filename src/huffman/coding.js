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

export function getHuffmanCodes (tree, code = 0, codes = {}) {
  if (tree === null) {
    return codes
  }

  if (tree.symbol !== null) {
    codes[tree.symbol] = code
  } else {
    getHuffmanCodes(tree.left, code << 1, codes)
    getHuffmanCodes(tree.right, (code << 1) + 1, codes)
  }
  return codes
}

export function encode (array, tree) {
  if (array.length > 1) {
    const Codes = getHuffmanCodes(tree)
    const Keys = Object.keys(Codes)
    const BitLength = {}
    Keys.forEach(value => {
      let Code = Codes[value]
      let length = 0
      do {
        Code = Code >> 1
        length++
      } while (Code > 0)
      BitLength[value] = length
    })

    const Result = []
    let filledBits = 0
    let item = 0
    for (const Element of array) {
      const Code = Codes[Element]
      const Length = BitLength[Element]
      filledBits += Length
      const OverflowBits = filledBits > 8 ? filledBits - 8 : 0
      const PushedCode = (Code >> OverflowBits)
      item = (item << (Length - OverflowBits)) + PushedCode
      if (filledBits >= 8) {
        Result.push(item)
        item = (PushedCode << OverflowBits) ^ Code
        filledBits = OverflowBits
      }
    }

    if (filledBits > 0 && filledBits < 8) {
      const Padding = 8 - filledBits
      item = item << Padding
      Result.push(item)
      Result.push(Padding)
    }
    return Result
  }
  return array
}
