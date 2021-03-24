import { Encode16 } from '../base16/encoder.js'
import { Encode32 } from '../base32/encoder.js'
import { Encode85 } from '../base85/encoder.js'
import { Encode91 } from '../base91/encoder.js'

function Encode64 (buffer) {
  return buffer.toString('base64')
}

function EncodeFunc (encoder) {
  return (buffer) => {
    const Data = encoder(buffer)
    return { data: Buffer.from(Data), size: Data.length }
  }
}

const Encoders = {
  Base16: EncodeFunc(Encode16),
  Base32: EncodeFunc(Encode32),
  Base64: EncodeFunc(Encode64),
  Base85: EncodeFunc(Encode85),
  Base91: EncodeFunc(Encode91)
}

const EncodersKeys = Object.keys(Encoders)

const Huffman = 'Huffman'

export { Encoders, EncodersKeys, Huffman }
