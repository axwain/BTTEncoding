import { buildHuffmanTree, getHuffmanSymbolMap } from './encoder'
import { decode } from './decoder'

const SingleRepeatedElementArray = [...'AAAAAAAA']
const ManyRepeatedElementsArray = [...'AABCCCDDDDD']

describe('decode', () => {
  const NoSymbols = getHuffmanSymbolMap(buildHuffmanTree([]))
  const SingleSymbol = getHuffmanSymbolMap(buildHuffmanTree(SingleRepeatedElementArray))
  const SymbolMap = getHuffmanSymbolMap(buildHuffmanTree(ManyRepeatedElementsArray))

  it('returns an empty array for an empty array', () => {
    expect(decode([], NoSymbols)).toEqual([])
  })

  it('decodes an array from a map with a single code', () => {
    expect(decode([0, 0], SingleSymbol)).toEqual(SingleRepeatedElementArray)
  })

  it('decodes an array from a Huffman Coding symbol map', () => {
    expect(decode([255, 84, 0, 4], SymbolMap)).toEqual(ManyRepeatedElementsArray)
  })
})
