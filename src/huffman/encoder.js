import { Node } from '../data_structures/binaryTree.js'
import { PriorityQueue } from '../data_structures/priorityQueue.js'

class HuffmanNode extends Node {
  constructor (frequency, symbol) {
    super(frequency)
    this.symbol = symbol
  }
}

export function frequencyCount (byteArray) {
  const Frequencies = {}
  if (byteArray.length > 0) {
    for (let i = 0; i < byteArray.length; i++) {
      if (Frequencies[byteArray[i]]) {
        Frequencies[byteArray[i]]++
      } else {
        Frequencies[byteArray[i]] = 1
      }
    }
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

export function getHuffmanSymbolMap (tree) {
  const Codes = getHuffmanCodes(tree)
  const Symbols = {}
  Object.keys(Codes).forEach(symbol => { Symbols[Codes[symbol]] = symbol })
  return Symbols
}

export function encode (array, codes) {
  if (array.length > 1) {
    const Result = []
    const BitLength = getBitLength(codes)
    let filledBits = 0
    let item = 0
    for (const Element of array) {
      const Code = codes[Element]
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

    if (filledBits > 0) {
      const Padding = 8 - filledBits
      item = item << Padding
      Result.push(item)
      Result.push(Padding)
    } else {
      Result.push(0)
    }
    return Result
  }
  return array
}

function getBitLength (codes) {
  const BitLength = {}
  Object.keys(codes).forEach(value => {
    let Code = codes[value]
    let length = 0
    do {
      Code = Code >> 1
      length++
    } while (Code > 0)
    BitLength[value] = length
  })

  return BitLength
}
