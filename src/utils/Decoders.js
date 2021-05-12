import { Decode16 } from '../base16/decoder.js'
import { Decode32 } from '../base32/decoder.js'
import { Decode85 } from '../base85/decoder.js'
import { Decode91 } from '../base91/decoder.js'

function Decode64 (text) {
  return Buffer.from(text, 'base64')
}

function ByteArrayToString (byteArray) {
  return byteArray.reduce(function (accu, val) { return accu + String.fromCharCode(val) }, '')
}

const Decoders = {
  Base16: Decode16,
  Base32: Decode32,
  Base64: Decode64,
  Base85: Decode85,
  Base91: Decode91
}

const DecodersKeys = Object.keys(Decoders)

export { ByteArrayToString, Decoders, DecodersKeys }
