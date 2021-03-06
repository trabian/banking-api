declare module "json-server" {
  import { Application, Router, RequestHandler } from "express";

  interface JSONRouter extends Router {
    db: any;
  }

  export interface JSONServer {
    create: () => Application;
    router: (db: string | object) => JSONRouter;
    defaults: () => RequestHandler[];
  }

  const jsonServer: JSONServer;
  export default jsonServer;
}

declare module "@trabian/banking-mock-data-generator" {
  export function createMockUser(options: any): any;
}
