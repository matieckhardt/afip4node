// services/wsfe/FEParamGetCotizacion.ts
import * as soap from "soap";

export class FEParamGetCotizacion {
  private wsfeWSDL: string;

  constructor(wsfeWSDL: string) {
    this.wsfeWSDL = wsfeWSDL;
  }

  async obtenerCotizacion(
    cuit: string,
    token: string,
    sign: string,
    monId: string
  ): Promise<any> {
    const soapClient = await soap.createClientAsync(this.wsfeWSDL);
    const requestBody = {
      Auth: { Token: token, Sign: sign, Cuit: cuit },
      MonId: monId,
    };

    try {
      const response = await soapClient.FEParamGetCotizacionAsync(requestBody);
      return response[0].FEParamGetCotizacionResult;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error en FEParamGetCotizacion: ${error.message}`);
      } else {
        throw new Error("Error desconocido en FEParamGetCotizacion");
      }
    }
  }
}
