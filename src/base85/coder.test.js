import { Encode85, ByteToInt } from './encoder'
import { Decode85 } from './decoder'

describe('byteToInt', () => {
  const OneCharacter = 'A'
  const TwoCharacter = 'AB'
  const ThreeCharacter = 'ABC'
  const FourCharacter = 'ABCD'
  const EmptyString = ''
  const LongString = 'ABCDEF'

  const ExpectedIntFromOneChar = 65 << 24
  const ExpectedIntFromTwoChars = ExpectedIntFromOneChar + (66 << 16)
  const ExpectedIntFromThreeChars = ExpectedIntFromTwoChars + (67 << 8)
  const ExpectedIntFromFourChars = ExpectedIntFromThreeChars + 68
  const ExpectedIntFromLongString = (69 << 24) + (70 << 16)

  it('converts a single character to an integer', () => {
    expect(ByteToInt(OneCharacter)).toBe(ExpectedIntFromOneChar)
  })

  it('converts two characters to a single integer', () => {
    expect(ByteToInt(TwoCharacter)).toBe(ExpectedIntFromTwoChars)
  })

  it('converts three characters to a single integer', () => {
    expect(ByteToInt(ThreeCharacter)).toBe(ExpectedIntFromThreeChars)
  })

  it('converts four characters to a single integer', () => {
    expect(ByteToInt(FourCharacter)).toBe(ExpectedIntFromFourChars)
  })

  it('throws an error if the string is empty', () => {
    expect(() => { ByteToInt(EmptyString) }).toThrow()
  })

  it('converts long string to a single integer', () => {
    expect(ByteToInt(LongString, 4)).toBe(ExpectedIntFromLongString)
  })
})

describe('Encoding and Decoding', () => {
  const Texts = ['A']
  for (let i = 1; i < 8; i++) {
    Texts.push(Texts[i - 1] + String.fromCodePoint(65 + i))
  }

  const ExpectedArrays = Texts.map(t => Uint8Array.from(t, c => c.codePointAt(0)))

  it('encodes and decodes successfully', () => {
    for (let i = 0; i < Texts.length; i++) {
      const EncodedText = Encode85(Texts[i])
      const DecodedText = Decode85(EncodedText)
      expect(DecodedText).toEqual(ExpectedArrays[i])
    }
  })
})