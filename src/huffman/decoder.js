export function decode (array, symbols) {
  const Result = []
  if (array.length > 1) {
    let code = 0
    const FindSymbols = function (item, maxBits) {
      for (let j = 0; j < maxBits; j++) {
        code += (item & 128) >> 7
        item = item << 1
        if (symbols[code]) {
          Result.push(symbols[code])
          code = 0
        } else {
          code = code << 1
        }
      }
    }

    for (let i = 0; i < array.length - 2; i++) {
      FindSymbols(array[i], 8)
    }

    const Padding = array[array.length - 1]
    FindSymbols(array[array.length - 1], 8 - Padding)
  }
  return Result
}
