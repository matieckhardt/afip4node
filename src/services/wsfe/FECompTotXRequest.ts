// services/wsfe/FECompTotXRequest.ts
import * as soap from "soap";

export class FECompTotXRequest {
  private wsfeWSDL: string;

  constructor(wsfeWSDL: string) {
    this.wsfeWSDL = wsfeWSDL;
  }

  async obtenerTotalXRequest(
    cuit: string,
    token: string,
    sign: string
  ): Promise<any> {
    const soapClient = await soap.createClientAsync(this.wsfeWSDL);
    const requestBody = {
      Auth: { Token: token, Sign: sign, Cuit: cuit },
    };

    try {
      const response = await soapClient.FECompTotXRequestAsync(requestBody);
      return response[0].FECompTotXRequestResult;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error en FECompTotXRequest: ${error.message}`);
      } else {
        throw new Error("Error desconocido en FECompTotXRequest");
      }
    }
  }
}
