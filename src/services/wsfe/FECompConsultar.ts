// services/wsfe/FECompConsultar.ts
import * as soap from "soap";

export class FECompConsultar {
  private wsfeWSDL: string;

  constructor(wsfeWSDL: string) {
    this.wsfeWSDL = wsfeWSDL;
  }

  async consultarComprobante(
    cuit: string,
    token: string,
    sign: string,
    dataRequest: any
  ): Promise<any> {
    const soapClient = await soap.createClientAsync(this.wsfeWSDL);
    const requestBody = {
      Auth: { Token: token, Sign: sign, Cuit: cuit },
      FeCompConsReq: dataRequest,
    };

    try {
      const response = await soapClient.FECompConsultarAsync(requestBody);
      return response[0].FECompConsultarResult;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error en FECompConsultar: ${error.message}`);
      } else {
        throw new Error("Error desconocido en FECompConsultar");
      }
    }
  }
}
