// services/wsfe/FECompUltimoAutorizado.ts
import * as soap from "soap";

export class FEParamGetPtosVenta {
  private wsfeWSDL: string;

  constructor(wsfeWSDL: string) {
    this.wsfeWSDL = wsfeWSDL;
  }
  async getSalesPoints(
    cuit: string,
    token: string,
    sign: string
  ): Promise<any> {
    // Create a SOAP client using wsfeWSDL
    const soapClient = await soap.createClientAsync(this.wsfeWSDL);

    // Build the request body according to the WSFE service specification
    const requestBody = {
      Auth: { Token: token, Sign: sign, Cuit: cuit },
    };

    try {
      // Perform the SOAP call to the WSFE service
      const response = await soapClient.FEParamGetPtosVentaAsync({
        Auth: requestBody.Auth,
      });

      // Check for errors in the response
      const result = response[0].FEParamGetPtosVentaResult;
      if (result.Errors) {
        // Handle the error scenario
        const errors = result.Errors.Err;
        throw new Error(`Error response from AFIP: ${JSON.stringify(errors)}`);
      }

      // If no errors, process the successful response
      const parsedResponse = result.ResultGet;
      return parsedResponse;
    } catch (error) {
      console.error("SOAP Service Error:", error);
      throw new Error(
        `Error al obtener puntos de venta: ${
          error instanceof Error ? error.message : "Unknown Error"
        }`
      );
    }
  }
}
