import { Encode85, ByteToUint } from './encoder'
import { Decode85 } from './decoder'

function stringToByteArray (string) {
  return Uint8Array.from(string, s => s.codePointAt(0))
}

describe('ByteToUint', () => {
  const ExpectedIntFromOneElement = 65 << 24
  const ExpectedIntFromTwoElements = ExpectedIntFromOneElement + (66 << 16)
  const ExpectedIntFromThreeElements = ExpectedIntFromTwoElements + (67 << 8)
  const ExpectedIntFromFourElements = ExpectedIntFromThreeElements + 68
  const ExpectedIntFromManyElements = (69 << 24) + (70 << 16)

  it('converts a single character to an integer', () => {
    const OneElement = stringToByteArray('A')
    expect(ByteToUint(OneElement)).toBe(ExpectedIntFromOneElement)
  })

  it('converts two characters to a single integer', () => {
    const TwoElements = stringToByteArray('AB')
    expect(ByteToUint(TwoElements)).toBe(ExpectedIntFromTwoElements)
  })

  it('converts three characters to a single integer', () => {
    const ThreeElements = stringToByteArray('ABC')
    expect(ByteToUint(ThreeElements)).toBe(ExpectedIntFromThreeElements)
  })

  it('converts four characters to a single integer', () => {
    const FourElements = stringToByteArray('ABCD')
    expect(ByteToUint(FourElements)).toBe(ExpectedIntFromFourElements)
  })

  it('throws an error if the string is empty', () => {
    const Empty = stringToByteArray('')
    expect(() => { ByteToUint(Empty) }).toThrow()
  })

  it('converts long string to a single integer', () => {
    const ManyElements = stringToByteArray('ABCDEF')
    expect(ByteToUint(ManyElements, 4)).toBe(ExpectedIntFromManyElements)
  })

  it('converts to a positive integer', () => {
    const ExpectedInteger = 4278190080
    const ByteArray = Uint8Array.from([255, 0, 0, 0])

    expect(ByteToUint(ByteArray)).toBe(ExpectedInteger)
  })
})

describe('Encoding and Decoding', () => {
  const Texts = ['A']
  for (let i = 1; i < 8; i++) {
    Texts.push(Texts[i - 1] + String.fromCodePoint(65 + i))
  }

  const ByteArrays = Texts.map(t => Uint8Array.from(t, c => c.codePointAt(0)))

  it('encodes and decodes successfully', () => {
    for (const ByteArray of ByteArrays) {
      const EncodedText = Encode85(ByteArray)
      const DecodedText = Decode85(EncodedText)
      expect(DecodedText).toEqual(ByteArray)
    }
  })
})
