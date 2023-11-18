// services/wsfe/FECompUltimoAutorizado.ts
import * as soap from "soap";

export class FEParamGetTiposIva {
  private wsfeWSDL: string;

  constructor(wsfeWSDL: string) {
    this.wsfeWSDL = wsfeWSDL;
  }
  async getTiposIva(cuit: string, token: string, sign: string): Promise<any> {
    // Crear un cliente SOAP utilizando wsfeWSDL
    const soapClient = await soap.createClientAsync(this.wsfeWSDL);

    // Construir el cuerpo de la solicitud según la especificación del servicio WSFE
    const requestBody = {
      Auth: { Token: token, Sign: sign, Cuit: cuit },
    };

    try {
      // Realizar la llamada SOAP al servicio WSFE
      const response = await soapClient.FEParamGetTiposIvaAsync({
        Auth: requestBody.Auth,
      });

      // Analizar y devolver la respuesta
      // La estructura de la respuesta dependerá de cómo AFIP estructura sus respuestas SOAP
      const parsedResponse = response[0].FEParamGetTiposIvaResult.ResultGet;
      return parsedResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al obtener puntos de venta: ${error.message}`);
      } else {
        throw new Error(`Error al obtener puntos de venta`);
      }
    }
  }
}
