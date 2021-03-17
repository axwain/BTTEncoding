import { Decode, Encode } from './encoder'

describe('Encoding and Decoding', () => {
  const Texts = ['A']
  for (let i = 1; i < 25; i++) {
    Texts.push(Texts[i - 1] + String.fromCodePoint(66 + i))
  }

  it('encodes and decodes successfully', () => {
    for (const Text of Texts) {
      const EncodedText = Encode(Text)
      const DecodedText = Decode(EncodedText)
      expect(DecodedText.length).toBe(Text.length)
      expect(DecodedText).toBe(Text)
    }
  })
})
