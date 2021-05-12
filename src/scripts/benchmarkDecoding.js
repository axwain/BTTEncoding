import { readFileSync, writeFileSync } from 'fs'

import { max, mean, sampleVariance } from 'simple-statistics'
import colors from 'colors/safe.js'

import { buildHuffmanTree, encode, getHuffmanCodes, getHuffmanSymbolMap } from '../huffman/encoder.js'
import { decode } from '../huffman/decoder.js'
import { ByteArrayToString, Decoders, DecodersKeys } from '../utils/Decoders.js'
import { Encoders, EncodersKeys, Huffman } from '../utils/Encoders.js'
import { getAssetList } from '../utils/getAssetList.js'

function encodeHuffman (buffer) {
  const Tree = buildHuffmanTree(buffer)
  const Codes = getHuffmanCodes(Tree)
  const Data = encode(buffer, Codes)
  return { data: Buffer.from(Data), map: getHuffmanSymbolMap(Tree) }
}

function saveData (resultData, strategies) {
  let text = `File,${strategies.join()}\n`
  for (let fileIndex = 0; fileIndex < resultData.length; fileIndex++) {
    text += `${resultData[fileIndex].join()}\n`
  }

  return text
}

function computeAndSaveResults (resultData, strategies) {
  let text = 'Strategy,mean,max,variance\n'
  for (let strategyIndex = 0; strategyIndex < strategies.length; strategyIndex++) {
    const BytesPerMS = []
    for (let fileIndex = 0; fileIndex < resultData.length; fileIndex++) {
      BytesPerMS.push(resultData[fileIndex][strategyIndex + 1])
    }
    const Mean = mean(BytesPerMS).toFixed(3)
    const Variance = sampleVariance(BytesPerMS).toFixed(3)
    const Max = max(BytesPerMS).toFixed(3)
    text += `${strategies[strategyIndex]},${Mean},${Max},${Variance}\n`
  }

  return text
}

async function getEncodedFiles (path, exclude) {
  try {
    console.info(colors.black.bold('>Getting Asset File List'))
    const Files = await getAssetList(path, exclude)

    const Strategies = []
    const EncodedFiles = []

    console.info(colors.italic('>Building Strategy List...'))
    for (const Key of EncodersKeys) {
      for (let i = 2; i < EncodersKeys.length; i++) {
        if (Key !== 'Base91' || i > 2) {
          Strategies.push({
            name: `${Key} + ${Huffman} + ${EncodersKeys[i]}`,
            encode: (buffer) => {
              const BaseEncoded = Encoders[Key](buffer).data
              const HuffmanEncoded = encodeHuffman(BaseEncoded)
              const Encoded = Encoders[EncodersKeys[i]](HuffmanEncoded.data)

              return { asset: Encoded.data.toString(), map: HuffmanEncoded.map }
            }
          })
        }
      }
    }

    console.info('Encoding Test Files...')
    const StartTime = process.hrtime()
    for await (const File of Files) {
      const FileBuffer = readFileSync(File)
      const EncodeResults = []
      console.info(`${colors.cyan.dim.bold('Encoding file:')} ${File}`)
      for (const Strategy of Strategies) {
        const EncodingStart = process.hrtime()
        process.stdout.write(colors.cyan.italic(`${Strategy.name}`))
        EncodeResults.push(Strategy.encode(FileBuffer))
        process.stdout.write(colors.cyan.dim(`... Done in ${process.hrtime(EncodingStart)}s\n`))
      }
      EncodedFiles.push(EncodeResults)
    }
    process.stdout.write(colors.cyan.dim(`All encoding done in ${process.hrtime(StartTime)}s\n`))

    return [EncodedFiles, Strategies.map(s => s.name), Files]
  } catch (error) {
    console.error(error)
  }
}

async function benchmarkDecoding (path, exclude) {
  try {
    const [EncodedFiles, Strategies, Files] = await getEncodedFiles(path, exclude)

    const DecodingStrategies = []

    for (const Key of DecodersKeys) {
      for (let i = 2; i < DecodersKeys.length; i++) {
        if (Key !== 'Base91' || i > 2) {
          DecodingStrategies.push(function (encodedFile) {
            const FirstDecode = process.hrtime()
            const BaseDecoded = Decoders[DecodersKeys[i]](encodedFile.asset)
            process.stdout.write(colors.green.dim(`\n${process.hrtime(FirstDecode)}s...\n`))
            const HuffmanStart = process.hrtime()
            const HuffmanDecoded = ByteArrayToString(decode(BaseDecoded, encodedFile.map))
            process.stdout.write(colors.green.dim(`${process.hrtime(HuffmanStart)}s...\n`))

            if (Key === 'Base64') {
              return HuffmanDecoded
            } else {
              const FinalStart = process.hrtime()
              const Decoded = Decoders[Key](HuffmanDecoded)
              process.stdout.write(colors.green.dim(`${process.hrtime(FinalStart)}s...\n`))
              return Buffer.from(Decoded).toString('base64')
            }
          })
        }
      }
    }

    const DecodingResults = []
    console.info('Decoding Test Files...')
    const StartTime = process.hrtime()
    const fileIndex = 0
    for await (const File of Files) {
      const DecodingTimes = []
      console.info(`${colors.cyan.bold('Decoding file:')} ${File}`)
      DecodingTimes.push(`${File}`)
      for (let i = 0; i < Strategies.length; i++) {
        const EncodedFile = EncodedFiles[fileIndex][i]
        const Size = EncodedFile.asset.length + JSON.stringify(EncodedFile.map).length
        const DecodingStart = process.hrtime()
        process.stdout.write(colors.cyan.dim.bold(`${Strategies[i]}`))
        DecodingStrategies[i](EncodedFile)
        const DecodingEnd = process.hrtime(DecodingStart)
        process.stdout.write(colors.cyan.dim(`... Done in ${DecodingEnd}s\n`))
        const Time = DecodingEnd[0] * 1000 + DecodingEnd[1] / 1000000
        DecodingTimes.push(Size / Time)
      }
      DecodingResults.push(DecodingTimes)
    }
    process.stdout.write(colors.cyan.dim(`All decoding done in ${process.hrtime(StartTime)}s\n`))

    console.info(colors.cyan.dim('Computing Results...'))
    const Results = computeAndSaveResults(DecodingResults, Strategies)
    const Data = saveData(DecodingResults, Strategies)

    console.info(colors.yellow.dim.bold('Writing Results...'))
    writeFileSync('decodingBenchmarkResults.csv', Results)
    writeFileSync('decodingBenchmarkData.csv', Data)
    console.info(colors.green.dim('Benchmark complete...'))
  } catch (error) {
    console.error(error)
  }
}

benchmarkDecoding('./assets', /\.place*/i)
