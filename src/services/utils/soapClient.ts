import * as soap from "soap";

export async function createSoapClient(wsdlPath: string, options = {}) {
  return soap.createClientAsync(wsdlPath, options);
}
