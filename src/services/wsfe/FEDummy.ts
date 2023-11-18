import * as soap from "soap";

export class FEDummyService {
  private wsfeWSDL: string;

  constructor(wsfeWSDL: string) {
    this.wsfeWSDL = wsfeWSDL;
  }

  async checkServerStatus(): Promise<any> {
    try {
      const soapClient = await soap.createClientAsync(this.wsfeWSDL);
      const result = await soapClient.FEDummyAsync({});
      const { AppServer, DbServer, AuthServer } = result[0].FEDummyResult;

      return {
        AppServer,
        DbServer,
        AuthServer,
        status:
          AppServer === "OK" && DbServer === "OK" && AuthServer === "OK"
            ? "Online"
            : "Offline",
      };
    } catch (error) {
      console.error("Error calling FEDummy:", error);
      throw new Error("Error al verificar el estado del servidor AFIP");
    }
  }
}
