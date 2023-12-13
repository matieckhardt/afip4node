import * as soap from "soap";

export class GetIdPersonaListByDocumento {
  private wsA13WSDL: string;

  constructor(wsA13WSDL: string) {
    this.wsA13WSDL = wsA13WSDL;
  }

  async getIdPersonaListByDocumento(
    cuit: string,
    token: string,
    sign: string,
    documento: string
  ): Promise<any> {
    const soapClient = await soap.createClientAsync(this.wsA13WSDL);

    const requestBody = {
      token: token,
      sign: sign,
      cuitRepresentada: cuit,
      documento: documento,
    };

    try {
      const response = await soapClient.getIdPersonaListByDocumentoAsync(
        requestBody
      );
      //      console.log(response[0].idPersonaListReturn.idPersona);
      return response[0].idPersonaListReturn.idPersona;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al obtener ID de Persona: ${error.message}`);
      } else {
        throw new Error(`Error al obtener ID de Persona`);
      }
    }
  }
}
