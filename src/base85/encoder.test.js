import { Decode, Encode, StringToInt } from './encoder'

describe('StringToInt', () => {
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
    expect(StringToInt(OneCharacter)).toBe(ExpectedIntFromOneChar)
  })

  it('converts two characters to a single integer', () => {
    expect(StringToInt(TwoCharacter)).toBe(ExpectedIntFromTwoChars)
  })

  it('converts three characters to a single integer', () => {
    expect(StringToInt(ThreeCharacter)).toBe(ExpectedIntFromThreeChars)
  })

  it('converts four characters to a single integer', () => {
    expect(StringToInt(FourCharacter)).toBe(ExpectedIntFromFourChars)
  })

  it('throws an error if the string is empty', () => {
    expect(() => { StringToInt(EmptyString) }).toThrow()
  })

  it('converts long string to a single integer', () => {
    expect(StringToInt(LongString, 4)).toBe(ExpectedIntFromLongString)
  })
})

describe('Encoding and Decoding', () => {
  const Texts = [
    'A',
    'AB',
    'ABC',
    'ABCD',
    'ABCDE',
    'ABCDEF',
    'ABCDEFG',
    'ABCDEFGH'
  ]

  it('encodes and decodes successfully', () => {
    for (const Text of Texts) {
      const EncodedText = Encode(Text)
      const DecodedText = Decode(EncodedText)
      expect(DecodedText).toBe(Text)
    }
  })
})
