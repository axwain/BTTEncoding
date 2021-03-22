import { Encode91 } from './encoder'
import { Decode91 } from './decoder'

describe('Encoding and Decoding', () => {
  const Texts = ['A']
  for (let i = 1; i < 25; i++) {
    Texts.push(Texts[i - 1] + String.fromCodePoint(65 + i))
  }

  const ByteArrays = Texts.map(t => Uint8Array.from(t, c => c.codePointAt(0)))

  it('encodes and decodes successfully', () => {
    for (const ByteArray of ByteArrays) {
      const EncodedText = Encode91(ByteArray)
      const DecodedArray = Decode91(EncodedText)
      expect(DecodedArray.length).toBe(ByteArray.length)
      expect(DecodedArray).toEqual(ByteArray)
    }
  })
})
