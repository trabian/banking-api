declare module "json-server" {
  import { Application, Router, RequestHandler } from "express";

  interface JSONRouter extends Router {
    db: any;
  }

  interface JSONServer {
    create: () => Application;
    router: (name: string) => JSONRouter;
    defaults: () => RequestHandler[];
  }

  const jsonServer: JSONServer;
  export default jsonServer;
}

declare module "@trabian/banking-mock-data-generator" {
  export function createMockUser(options: any): any;
}
