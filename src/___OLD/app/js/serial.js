const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
//const ByteLength = require('@serialport/parser-byte-length')
const fs = require('fs')

class SerialNode {
  constructor(opts) {
    this.outputElement = null
    this.outputFile = null
    this.port = null
  }

  async listPorts() {
    const portData = await SerialPort.list()
    const portList = portData.filter((port) => {
      return (port.comName.toUpperCase().includes("COM") || port.comName.toUpperCase().includes("USB"))
    }).map((port) => {
      return {value: port.comName, text: `(${port.comName}) - ${port.manufacturer}`}
    })
    return portList
  }

  listenPort(portId, baudRate) {
    function appendToElement(data, element) {
      element.value += data
      element.scrollTop = element.scrollHeight
    }
    function appendToFile(data, filePath) {
      fs.appendFileSync(filePath, data)
    }
    this.port = new SerialPort(portId, {
      baudRate: parseInt(baudRate)
      //dataBits: 8,
      //autoOpen: false
    })
    this.port.on('data', (data) => {
      //console.log(`data: ${data.toString()}`)
      if (this.outputElement)
        appendToElement(data.toString(), this.outputElement)
      if (this.outputFile)
        appendToFile(data.toString(), this.outputFile)
    })
    this.port.on('error', function(err) {
      console.log('Error: ', err.message)
    })
  
    /*
    const lineStream = port.pipe(new Readline({ delimiter: '\r\n' }))
    console.log(lineStream)
    lineStream.on('data', (data) => {
      //console.log(`data: ${data.toString()}`)
      if (this.outputElement)
        appendToElement(data.toString(), this.outputElement)
      if (this.outputFile)
        appendToFile(data.toString(), this.outputFile)
    })
    */
  }

  closePort() {
    this.port.close()
  }

  setOutputElementId(elementId) {
    this.outputElement = (document.getElementById(elementId)? document.getElementById(elementId) : null )
  }

  setOutputFile(filePath) {
    this.outputFile = filePath
  }
}

module.exports = SerialNode
