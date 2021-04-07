import { readFileSync, writeFileSync } from 'fs'

import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { max, mean, sampleVariance } from 'simple-statistics'

import { buildHuffmanTree, encode, getHuffmanCodes, getHuffmanSymbolMap } from '../huffman/encoder.js'
import { Encoders, EncodersKeys, Huffman } from '../utils/Encoders.js'
import { getAssetList } from '../utils/getAssetList.js'

const jsonParser = bodyParser.json()

function EncodeHuffman (buffer) {
  const Tree = buildHuffmanTree(buffer)
  const Codes = getHuffmanCodes(Tree)
  const Data = encode(buffer, Codes)
  return { data: Buffer.from(Data), map: getHuffmanSymbolMap(Tree) }
}

function SaveData (resultData, files, strategies) {
  let text = 'File,Strategy\n'
  let baseTime = 'File\n'
  for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
    for (let strategyIndex = 0; strategyIndex < strategies.length; strategyIndex++) {
      text += `${files[fileIndex]},${strategies[strategyIndex].name},`
      text += `${resultData.data[strategyIndex][fileIndex].join()}\n`
    }
    baseTime += `${files[fileIndex]},${resultData.base[fileIndex].join()}\n`
  }

  writeFileSync(`decodingBenchmarkDataFor${resultData.name}.csv`, text)
  writeFileSync(`decodingBenchmarkBaseTimesFor${resultData.name}.csv`, baseTime)
}

function ComputeAndSaveResults (resultData, totalFiles, strategies) {
  let text = 'Strategy,mean,max,variance\n'
  const BaseTimes = []
  for (let fileIndex = 0; fileIndex < totalFiles; fileIndex++) {
    BaseTimes.push(mean(resultData.base[fileIndex]))
  }
  for (let strategyIndex = 0; strategyIndex < strategies.length; strategyIndex++) {
    const Times = []
    for (let fileIndex = 0; fileIndex < totalFiles; fileIndex++) {
      Times.push(resultData.data[strategyIndex][fileIndex] / BaseTimes[fileIndex])
    }
    const Mean = mean(Times).toFixed(3)
    const Variance = sampleVariance(Times).toFixed(3)
    const Max = max(Times).toFixed(3)
    text += `${strategies[strategyIndex].name},${Mean},${Max},${Variance}\n`
  }

  writeFileSync(`decodingBenchmarkResultsFor${resultData.name}.csv`, text)
}

async function setupServer (path, exclude) {
  try {
    console.info('>Getting AssetList...')
    const Files = await getAssetList(path, exclude)

    const Strategies = []
    const EncodedFiles = []
    const Base64Files = []

    console.info('>Building Strategy List...')
    for (const Key of EncodersKeys) {
      for (let i = 2; i < EncodersKeys.length; i++) {
        if (Key !== 'Base91' || i > 2) {
          Strategies.push({
            name: `${Key} + ${Huffman} + ${EncodersKeys[i]}`,
            encode: (buffer) => {
              const BaseEncoded = Encoders[Key](buffer).data
              const HuffmanEncoded = EncodeHuffman(BaseEncoded)
              const Encoded = Encoders[EncodersKeys[i]](HuffmanEncoded.data)

              return { asset: Encoded.data.toString(), map: HuffmanEncoded.map }
            }
          })
        }
      }
    }

    console.info('Encoding Test Files...')
    for await (const File of Files) {
      const FileBuffer = readFileSync(File)
      const EncodeResults = []
      for (const Strategy of Strategies) {
        EncodeResults.push(Strategy.encode(FileBuffer))
      }
      EncodedFiles.push(EncodeResults)
      Base64Files.push(FileBuffer.toString('base64'))
    }

    const App = express()

    App.use(cors())

    App.use(express.static('./dist'))

    App.get('/getFiles', function (req, res) {
      console.info('Sending File List')
      res.send(Files)
    })

    App.get('/getStrategies', function (req, res) {
      console.info('Sending Strategies List')
      res.send(Strategies.map(s => s.name))
    })

    App.get('/getBase64File/:id', function (req, res) {
      res.send(Base64Files[req.params.id])
    })

    App.get('/getEncodedFile/:fileId/:strategyId', function (req, res) {
      res.send(EncodedFiles[req.params.fileId][req.params.strategyId])
    })

    App.post(/saveResults/, jsonParser, function (req, res) {
      console.info('Saving Data...')
      SaveData(req.body, Files, Strategies)
      console.info('Computing and Saving results...')
      ComputeAndSaveResults(req.body, Files.length, Strategies)
      console.info('Done...')
      res.send('Ok')
    })

    App.listen(8080, '0.0.0.0', () => {
      console.info('Server initiated on port 8080')
    })
  } catch (error) {
    console.error(error)
  }
}

setupServer('./assets', /\.place*/i)
