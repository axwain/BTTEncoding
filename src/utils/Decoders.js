import { Decode16 } from '../base16/decoder.js'
import { Decode32 } from '../base32/decoder.js'
import { Decode85 } from '../base85/decoder.js'
import { Decode91 } from '../base91/decoder.js'

function Decode64 (text) {
  return window.atob(text)
}

function ByteArrayToString (byteArray) {
  return byteArray.reduce(function (accu, val) { return accu + String.fromCharCode(val) }, '')
}

function decodeFunc (decoder) {
  return function (array, map) {
    return decoder(array, map)
  }
}

const Decoders = {
  Base16: decodeFunc(Decode16),
  Base32: decodeFunc(Decode32),
  Base64: decodeFunc(Decode64),
  Base85: decodeFunc(Decode85),
  Base91: decodeFunc(Decode91)
}

const DecodersKeys = Object.keys(Decoders)

export { ByteArrayToString, Decoders, DecodersKeys }
