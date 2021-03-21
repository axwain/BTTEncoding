import { buildHuffmanTree, frequencyCount } from './coding'

const SingleArray = ['A']
const RepeatedElementArray = [...'AAAAA']
const TestStringArray = [...'AABCCCDDDDD']

describe('frequencyCount', () => {
  it('returns an empty object from an empty array', () => {
    expect(frequencyCount([])).toEqual({})
  })

  it('returns frequency of one for a single element array', () => {
    expect(frequencyCount(SingleArray)).toEqual({ A: 1 })
  })

  it('returns the frequency of a repeated single element in an array', () => {
    expect(frequencyCount(RepeatedElementArray)).toEqual({ A: RepeatedElementArray.length })
  })

  it('returns an object map of the frequency of elements in an array', () => {
    const ExpectedFrequencies = { A: 2, B: 1, C: 3, D: 5 }
    expect(frequencyCount(TestStringArray)).toEqual(ExpectedFrequencies)
  })
})

describe('buildHuffmanTree', () => {
  it('returns an empty node from an empty array', () => {
    const Root = buildHuffmanTree([])
    expect(Root.data).toEqual(null)
    expect(Root.symbol).toEqual(null)
  })

  it('returns a leaf node with the frequency of a repeated element in an array', () => {
    const Root = buildHuffmanTree(RepeatedElementArray)
    expect(Root.data).toEqual(RepeatedElementArray.length)
    expect(Root.symbol).toEqual('A')
    expect(Root.left).toEqual(null)
    expect(Root.right).toEqual(null)
  })

  it('returns a node with the sum of frequencies of the two repeated elements in an array', () => {
    const TwoRepeatedElements = [...'AAABB']
    const Root = buildHuffmanTree(TwoRepeatedElements)

    expect(Root.data).toEqual(TwoRepeatedElements.length)
    expect(Root.symbol).toEqual(null)
    expect(Root.left.data).toEqual(2)
    expect(Root.left.symbol).toEqual('B')
    expect(Root.right.data).toEqual(3)
    expect(Root.right.symbol).toEqual('A')
  })

  it('returns the root node of a huffman tree from an array with repeated elements', () => {
    const Result = buildHuffmanTree(TestStringArray)

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
