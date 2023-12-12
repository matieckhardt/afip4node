import { AfipAuth } from "../AfipAuthWSFE";
import * as soap from "soap";
import fs from "fs";
import path from "path";
import { GetIdPersonaListByDocumento } from "./getIdPersonaListByDocumento";
import { GetPersona } from "./getPersona";
export class Wsa13Service {
  private afipAuth: AfipAuth;
  private wsA13WSDL: string;

  // Instancias de los servicios
  private getIdPersonaService: GetIdPersonaListByDocumento;
  private getPersonaService: GetPersona;

  constructor(afipAuth: AfipAuth) {
    this.afipAuth = afipAuth;
    this.wsA13WSDL = path.resolve(
      __dirname,
      "../../wsdl/ws_sr_padron_a13-production.wsdl"
    );

    this.getIdPersonaService = new GetIdPersonaListByDocumento(this.wsA13WSDL);
    this.getPersonaService = new GetPersona(this.wsA13WSDL);
  }

  async getDNI(
    cuit: string,
    token: string,
    sign: string,
    documento: string
  ): Promise<any> {
    return this.getIdPersonaService.getIdPersonaListByDocumento(
      cuit,
      token,
      sign,
      documento
    );
  }

  async getCUIT(
    cuit: string,
    token: string,
    sign: string,
    documento: string
  ): Promise<any> {
    return this.getPersonaService.getPersona(cuit, token, sign, documento);
  }
}
