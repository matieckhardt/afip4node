import * as soap from "soap";

export class GetPersona {
  private wsA5WSDL: string;

  constructor(wsA5WSDL: string) {
    this.wsA5WSDL = wsA5WSDL;
  }

  async getPersona(
    cuit: string,
    token: string,
    sign: string,
    documento: string
  ): Promise<any> {
    const soapClient = await soap.createClientAsync(this.wsA5WSDL);

    const requestBody = {
      token: token,
      sign: sign,
      cuitRepresentada: cuit,
      idPersona: documento,
    };
    try {
      const response = await soapClient.getPersonaAsync(requestBody);
      // console.log(response[0].personaReturn.persona);
      return response[0].personaReturn;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        throw new Error(`Error al obtener datos de la Persona: ${error}`);
      } else {
        throw new Error(`Error al obtener datos de la Persona`);
      }
    }
  }
}
