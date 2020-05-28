const fs = require('fs');
// const path = require('path')

function convertLayout(filePath, outputFilePath) {
  const records = extractRecords(filePath);
  const jsonRecords = recordsToJson(records);
  createOutputFile(outputFilePath, jsonRecords);
  // console.dir(jsonRecords, { depth: null })

  function extractRecords(filePath) {
    try {
      const fileData = fs.readFileSync(filePath);
      const fileLines = fileData.toString().split('\r\n');
      const records = [];
      // 62 linhas = 1 registro
      const recordLength = 62;
      let sliceStart = 0;
      // -2 linhas final arquivo, (<ETX>, 3, 0x03) e em branco
      const totalRecords = parseInt((fileLines.length - 2) / recordLength);
      // separar registros
      for (let i = 0; i < totalRecords; i++) {
        records.push(
          fileLines.slice(sliceStart, sliceStart + recordLength - 1),
        );
        sliceStart += recordLength;
      }
      return records;
    } catch (e) {
      console.log(e);
    }
  }

  function recordsToJson(records) {
    const selectedLines = [
      10,
      11,
      12,
      13,
      18,
      19,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
    ];
    const jsonRecords = [];
    for (const record of records) {
      const jsonRecord = record
        .filter((item, i) => {
          return selectedLines.includes(i);
        })
        .map(item => {
          const itemSplit = item.split('\t');
          const key = itemSplit[0] ? itemSplit[0].trim() : '';
          const value1 = itemSplit[1] ? itemSplit[1].trim() : '';
          const value2 = itemSplit[2] ? itemSplit[2].trim() : '';
          if (itemSplit.length >= 3) {
            return { key, data: { value: value2, flag: value1 } };
          }
          return { key, data: { value: value1 } };
        });
      jsonRecords.push(jsonRecord);
    }
    return jsonRecords;
  }

  function writeFileHeader(outputFilePath) {
    try {
      const outputHeader = [
        'ID da amostra',
        'Data',
        'Tempo',
        'ID Paciente',
        'WBC',
        'WBC flags',
        'RBC',
        'RBC flags',
        'HGB',
        'HGB flags',
        'HCT',
        'HCT flags',
        'MCV',
        'MCV flags',
        'MCH',
        'MCH flags',
        'MCHC',
        'MCHC flags',
        'PLT',
        'PLT flags',
        'PCT',
        'PCT flags',
        'MPV',
        'MPV flags',
        'PDWs',
        'PDWs flags',
        'PDWc',
        'PDWc flags',
        'RDWs',
        'RDWs flags',
        'RDWc',
        'RDWc flags',
        'LYM',
        'LYM flags',
        'MON',
        'MON flags',
        'GRA',
        'GRA flags',
        'LYM%',
        'LYM% flags',
        'MON%',
        'MON% flags',
        'GRA%',
        'GRA% flags',
        'P-LCC',
        'P-LCC flags',
        'P-LCR',
        'P-LCR flags',
        'Tipo',
        'Atenção',
        'RBC probe min',
        'RBC probe max',
        'WBC probe min',
        'WBC probe max',
        'Lisante',
      ];
      fs.writeFileSync(outputFilePath, `${outputHeader.join('\t')}\t\n`);
    } catch (e) {
      console.log(e);
    }
  }

  function createRecordLine(jsonRecord) {
    const fieldSeparator = '\t';
    const line = `${
      jsonRecord[0].data.value +
      fieldSeparator + // ID da amostra
      formatDate(jsonRecord[4].data.value) +
      fieldSeparator + // Data
      formatTime(jsonRecord[5].data.value) +
      fieldSeparator + // Tempo
      jsonRecord[1].data.value +
      fieldSeparator + // ID Paciente
      jsonRecord[6].data.value +
      fieldSeparator +
      jsonRecord[6].data.flag +
      fieldSeparator + // WBC WBC flags
      jsonRecord[13].data.value +
      fieldSeparator +
      jsonRecord[13].data.flag +
      fieldSeparator + // RBC RBC flags
      jsonRecord[14].data.value +
      fieldSeparator +
      jsonRecord[14].data.flag +
      fieldSeparator + // HGB HGB flags
      jsonRecord[15].data.value +
      fieldSeparator +
      jsonRecord[15].data.flag +
      fieldSeparator + // HCT HCT flags
      jsonRecord[16].data.value +
      fieldSeparator +
      jsonRecord[16].data.flag +
      fieldSeparator + // MCV MCV flags
      jsonRecord[17].data.value +
      fieldSeparator +
      jsonRecord[17].data.flag +
      fieldSeparator + // MCH MCH flags
      jsonRecord[18].data.value +
      fieldSeparator +
      jsonRecord[18].data.flag +
      fieldSeparator + // MCHC MCHC flags
      jsonRecord[21].data.value +
      fieldSeparator +
      jsonRecord[21].data.flag +
      fieldSeparator + // PLT PLT flags
      jsonRecord[22].data.value +
      fieldSeparator +
      jsonRecord[22].data.flag +
      fieldSeparator + // PCT PCT flags
      jsonRecord[23].data.value +
      fieldSeparator +
      jsonRecord[23].data.flag +
      fieldSeparator + // MPV MPV flags
      jsonRecord[25].data.value +
      fieldSeparator +
      jsonRecord[25].data.flag +
      fieldSeparator + // PDWs PDWs flags
      jsonRecord[24].data.value +
      fieldSeparator +
      jsonRecord[24].data.flag +
      fieldSeparator + // PDWc PDWc flags
      jsonRecord[20].data.value +
      fieldSeparator +
      jsonRecord[20].data.flag +
      fieldSeparator + // RDWs RDWs flags
      jsonRecord[19].data.value +
      fieldSeparator +
      jsonRecord[19].data.flag +
      fieldSeparator + // RDWc RDWc flags
      jsonRecord[7].data.value +
      fieldSeparator +
      jsonRecord[7].data.flag +
      fieldSeparator + // LYM LYM flags
      jsonRecord[8].data.value +
      fieldSeparator +
      jsonRecord[8].data.flag +
      fieldSeparator + // MON MON flags
      jsonRecord[9].data.value +
      fieldSeparator +
      jsonRecord[9].data.flag +
      fieldSeparator + // GRA GRA flags
      jsonRecord[10].data.value +
      fieldSeparator +
      jsonRecord[10].data.flag +
      fieldSeparator + // LYM% LYM% flags
      jsonRecord[11].data.value +
      fieldSeparator +
      jsonRecord[11].data.flag +
      fieldSeparator + // MON% MON% flags
      jsonRecord[12].data.value +
      fieldSeparator +
      jsonRecord[12].data.flag +
      fieldSeparator + // GRA% GRA% flags
      jsonRecord[26].data.value +
      fieldSeparator +
      jsonRecord[26].data.flag +
      fieldSeparator + // P-LCC P-LCC flags
      jsonRecord[27].data.value +
      fieldSeparator +
      jsonRecord[27].data.flag +
      fieldSeparator + // P-LCR P-LCR flags
      decodeType(jsonRecord[3].data.value) +
      fieldSeparator + // Tipo
      jsonRecord[28].data.value +
      fieldSeparator // Atenção
    }${
      fieldSeparator // RBC probe min
    }${
      fieldSeparator // RBC probe max
    }${
      fieldSeparator // WBC probe min
    }${
      fieldSeparator // WBC probe max
    }${
      fieldSeparator // Lisante
    }\t\n`;

    for (key in jsonRecord) {
      console.log(key);
      console.log(jsonRecord[key]);
      jsonRecord[key].data.value;
    }

    // console.log(line)
    /*
    const line = jsonRecord.reduce(function(result, element, index) {
      return result + element.data.value + (element.data.flag? '\t' + element.data.flag: '') + '\t'
    }, '')
    return line + '\n'
    */
    return line;
  }
  function formatDate(date) {
    return date
      ? `${date.substring(6, 8)}/${date.substring(4, 6)}/${date.substring(
          0,
          4,
        )}`
      : date;
  }
  function formatTime(time) {
    return time ? `${time.substring(0, 2)}:${time.substring(2, 4)}` : time;
  }
  function decodeType(typeOption) {
    return typeOption
      ? { Dog: 'Cão', Cat: 'Gato', Human: 'Humano' }[typeOption]
      : typeOption;
  }

  function createOutputFile(outputFilePath, jsonRecords) {
    try {
      writeFileHeader(outputFilePath);
      for (const jsonRecord of jsonRecords) {
        fs.appendFileSync(outputFilePath, createRecordLine(jsonRecord));
      }
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = convertLayout;

const filePath =
  'C:\\Users\\diego.rodrigues.DKT-ADG-004\\Desktop\\serial-node\\tmp\\dados.txt';
const filePath2 =
  'C:\\Users\\diego.rodrigues.DKT-ADG-004\\Desktop\\serial-node\\tmp\\dados2.txt';
convertLayout(filePath, filePath2);
