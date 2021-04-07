import axios from 'axios'

import { decode } from '../huffman/decoder.js'
import { ByteArrayToString, Decoders, DecodersKeys } from '../utils/Decoders.js'

const URL = 'http://192.168.1.1:8080/'

async function RequestTest (decodingStrategy, fileIndex, strategyIndex) {
  const StartTime = Date.now()
  const Data = (await axios.get(URL + 'getEncodedFile/' + fileIndex + '/' + strategyIndex)).data
  decodingStrategy(Data.asset, Data.map)
  return Date.now() - StartTime
}

window.onload = function () {
  const DecodingStrategies = []

  for (const Key of DecodersKeys) {
    for (let i = 2; i < DecodersKeys.length; i++) {
      if (Key !== 'Base91' || i > 2) {
        DecodingStrategies.push(function (text, map) {
          const BaseDecoded = Decoders[DecodersKeys[i]](text)
          const HuffmanDecoded = ByteArrayToString(decode(BaseDecoded, map))

          if (Key === 'Base64') {
            return HuffmanDecoded
          } else {
            const Decoded = Decoders[Key](HuffmanDecoded)
            return window.btoa(Decoded)
          }
        })
      }
    }
  }

  const TitleInput = document.getElementById('title')
  const CyclesInput = document.getElementById('cycles')
  const ProgressBar = document.getElementById('progress')
  const StartButton = document.getElementById('start')
  let files = []
  let strategies = []
  let progress = 0

  function updateProgress (MaxProgress) {
    return function () {
      progress++
      ProgressBar.value = Math.floor(progress * 100 / MaxProgress)
    }
  }

  async function getFilesAndStrategies () {
    files = (await axios.get(URL + 'getFiles')).data
    strategies = (await axios.get(URL + 'getStrategies')).data

    StartButton.disabled = false
    StartButton.onclick = async function () {
      TitleInput.disabled = true
      CyclesInput.disabled = true
      StartButton.disabled = true
      const Cycles = CyclesInput.value
      const MaxProgress = (files.length + files.length * strategies.length) * Cycles
      const update = updateProgress(MaxProgress)

      const BaseTimes = []
      for (let i = 0; i < files.length; i++) {
        const FileTimes = []
        for (let j = 0; j < Cycles; j++) {
          const StartTime = Date.now()
          await axios.get(URL + 'getBase64File/' + i)
          FileTimes.push(Date.now() - StartTime)
          update()
        }
        BaseTimes.push(FileTimes)
      }

      const StrategyTimes = []
      for (let k = 0; k < strategies.length; k++) {
        const FileResults = []
        for (let i = 0; i < files.length; i++) {
          const FileTimes = []
          for (let j = 0; j < Cycles; j++) {
            const Time = await RequestTest(DecodingStrategies[k], i, k)
            FileTimes.push(Time)
            update()
          }
          FileResults.push(FileTimes)
        }
        StrategyTimes.push(FileResults)
      }

      axios.post(URL + 'saveResults', { name: TitleInput.value, base: BaseTimes, data: StrategyTimes }).then(function () {
        TitleInput.disabled = false
        CyclesInput.disabled = false
        StartButton.disabled = false
        ProgressBar.value = 0
        progress = 0
      })
    }
  }

  getFilesAndStrategies()
}
