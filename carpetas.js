const fs = require("fs");
const path = require("path");
const BASE_PATH = "./src/services";

const createDirectory = (directoryPath) => {
  fs.mkdirSync(directoryPath, { recursive: true });
};

const createFile = (filePath) => {
  fs.writeFileSync(filePath, "");
};

const createDirectories = () => {
  createDirectory(path.join(BASE_PATH, "wsfe"));
  createDirectory(path.join(BASE_PATH, "utils"));
};

const createFiles = () => {
  createFile(path.join(BASE_PATH, "utils", "soapClient.ts"));
  createFile(path.join(BASE_PATH, "utils", "auth.ts"));
  createFile(path.join(BASE_PATH, "utils", "logger.ts"));
  createFile(path.join(BASE_PATH, "utils", "errorHandler.ts"));
  createFile(path.join(BASE_PATH, "utils", "inputValidator.ts"));
  createFile(path.join(BASE_PATH, "utils", "responseFormatter.ts"));

  const operations = [
    "FECAEConsultar",
    "FECAEAInformar",
    "FECAEASinMovimientoConsultar",
    "FECAEASinMovimientoInformar",
    "FECAEASolicitar",
    "FECAESolicitar",
    "FECompConsultar",
    "FECompTotXRequest",
    "FECompUltimoAutorizado",
    "FEDummy",
    "FEParamGetCotizacion",
    "FEParamGetPtosVenta",
    "FEParamGetTiposCbte",
    "FEParamGetTiposConcepto",
    "FEParamGetTiposDoc",
    "FEParamGetTiposIva",
    "FEParamGetTiposMonedas",
    "FEParamGetTiposOpcionales",
    "FEParamGetTiposPaises",
    "FEParamGetTiposTributos",
  ];

  operations.forEach((operation) => {
    createFile(path.join(BASE_PATH, "wsfe", `${operation}.ts`));
  });

  createFile(path.join(BASE_PATH, "wsfe", "index.ts"));
};

createDirectories();
createFiles();

console.log("Directory structure and files created successfully.");
