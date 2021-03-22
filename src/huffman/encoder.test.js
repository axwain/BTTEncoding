import { buildHuffmanTree, encode, frequencyCount, getHuffmanCodes } from './encoder'

const OneElementArray = ['A']
const SingleRepeatedElementArray = [...'AAAAAAAA']
const TwoRepeatedElementsArray = [...'AAABB']
const ManyRepeatedElementsArray = [...'AABCCCDDDDD']

describe('frequencyCount', () => {
  it('returns an empty object from an empty array', () => {
    expect(frequencyCount([])).toEqual({})
  })

  it('returns frequency of one for a single element array', () => {
    expect(frequencyCount(OneElementArray)).toEqual({ A: 1 })
  })

  it('returns the frequency of a repeated single element in an array', () => {
    expect(frequencyCount(SingleRepeatedElementArray)).toEqual({ A: SingleRepeatedElementArray.length })
  })

  it('returns an object map of the frequency of elements in an array', () => {
    const ExpectedFrequencies = { A: 2, B: 1, C: 3, D: 5 }
    expect(frequencyCount(ManyRepeatedElementsArray)).toEqual(ExpectedFrequencies)
  })
})

describe('buildHuffmanTree', () => {
  it('returns an empty node from an empty array', () => {
    const Root = buildHuffmanTree([])
    expect(Root.data).toEqual(null)
    expect(Root.symbol).toEqual(null)
    expect(Root.left).toEqual(null)
    expect(Root.right).toEqual(null)
  })

  it('returns a leaf node with the frequency of a repeated element in an array', () => {
    const Root = buildHuffmanTree(SingleRepeatedElementArray)
    expect(Root.data).toEqual(SingleRepeatedElementArray.length)
    expect(Root.symbol).toEqual('A')
    expect(Root.left).toEqual(null)
    expect(Root.right).toEqual(null)
  })

  it('returns a node with the sum of frequencies of the two repeated elements in an array', () => {
    const Root = buildHuffmanTree(TwoRepeatedElementsArray)

    expect(Root.data).toEqual(TwoRepeatedElementsArray.length)
    expect(Root.symbol).toEqual(null)
    expect(Root.left.data).toEqual(2)
    expect(Root.left.symbol).toEqual('B')
    expect(Root.right.data).toEqual(3)
    expect(Root.right.symbol).toEqual('A')
  })

  it('returns the root node of a huffman tree from an array with repeated elements', () => {
    const Result = buildHuffmanTree(ManyRepeatedElementsArray)

    expect(Result.data).toEqual(11)
    expect(Result.symbol).toEqual(null)
    expect(Result.left.data).toEqual(5)
    expect(Result.left.symbol).toEqual('D')
    expect(Result.right.data).toEqual(6)
    expect(Result.right.symbol).toEqual(null)
    expect(Result.right.left.data).toEqual(3)
    expect(Result.right.left.symbol).toEqual('C')
    expect(Result.right.right.data).toEqual(3)
  })
})

describe('getHuffmanCodes', () => {
  it('returns an empty object on an empty tree', () => {
    const EmptyTree = buildHuffmanTree([])
    expect(getHuffmanCodes(EmptyTree)).toEqual({})
  })

  it('returns 0 as the Huffman Code of a single element array', () => {
    const Root = buildHuffmanTree(OneElementArray)
    expect(getHuffmanCodes(Root)).toEqual({ A: 0 })
  })

  it('returns 0 as the Huffman Code of a single repeated element array', () => {
    const Root = buildHuffmanTree(SingleRepeatedElementArray)
    expect(getHuffmanCodes(Root)).toEqual({ A: 0 })
  })

  it('return the Huffman Codes of an array with many repeated elements', () => {
    const Root = buildHuffmanTree(ManyRepeatedElementsArray)
    const ExpectedCodes = { A: 7, B: 6, C: 2, D: 0 }

    expect(getHuffmanCodes(Root)).toEqual(ExpectedCodes)
  })
})

describe('encode', () => {
  it('returns an empty array for an empty array', () => {
    const Codes = getHuffmanCodes(buildHuffmanTree([]))
    expect(encode([], Codes)).toEqual([])
  })

  it('returns the same array for a single element array', () => {
    const Codes = getHuffmanCodes(buildHuffmanTree(OneElementArray))
    expect(encode(OneElementArray, Codes)).toEqual(OneElementArray)
  })

  it('returns an array with a 0 and the number of padding bits for a single repeated element array', () => {
    const PaddingBits = 8 - SingleRepeatedElementArray.length
    const Codes = getHuffmanCodes(buildHuffmanTree(SingleRepeatedElementArray))
    expect(encode(SingleRepeatedElementArray, Codes)).toEqual([0, PaddingBits])
  })

  it('encodes an array with the number of padding bits as its last element', () => {
    const ExpectedArray = [255, 84, 0, 4]
    const Codes = getHuffmanCodes(buildHuffmanTree(ManyRepeatedElementsArray))
    expect(encode(ManyRepeatedElementsArray, Codes)).toEqual(ExpectedArray)
  })
})
