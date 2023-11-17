
const fs = require('fs');
const path = require('path');

const BASE_PATH = './src';
const wsfePath = path.join(BASE_PATH, 'wsfe');
const utilsPath = path.join(BASE_PATH, 'utils');

// Functions to create directories and files
const makeDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const makeFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.closeSync(fs.openSync(filePath, 'w'));
  }
};

// Create wsfe and utils directories
makeDir(wsfePath);
makeDir(utilsPath);

// Create utility files
const utilFiles = ['soapClient.ts', 'auth.ts', 'logger.ts', 'errorHandler.ts', 'inputValidator.ts', 'responseFormatter.ts'];
utilFiles.forEach(file => makeFile(path.join(utilsPath, file)));

// Operations to be performed in WSFE
const operations = [
  'FECAEConsultar',
  'FECAEAInformar',
  'FECAEASinMovimientoConsultar',
  'FECAEASinMovimientoInformar',
  'FECAEASolicitar',
  'FECAESolicitar',
  'FECompConsultar',
  'FECompTotXRequest',
  'FECompUltimoAutorizado',
  'FEDummy',
  'FEParamGetCotizacion',
  'FEParamGetPtosVenta',
  'FEParamGetTiposCbte',
  'FEParamGetTiposConcepto',
  'FEParamGetTiposDoc',
  'FEParamGetTiposIva',
  'FEParamGetTiposMonedas',
  'FEParamGetTiposOpcionales',
  'FEParamGetTiposPaises',
  'FEParamGetTiposTributos'
];

// Create operation files in wsfe directory
operations.forEach(op => makeFile(path.join(wsfePath, \`\${op}.ts\`)));

// Create an index.ts file in wsfe directory
makeFile(path.join(wsfePath, 'index.ts'));

console.log('Structure of directories and files created successfully.');
