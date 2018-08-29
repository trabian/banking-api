import { Application } from "express";
import jsonServer from "json-server";

import createUser from "./create-user";

interface ServerOptions {
  database: string | object;
}

export const createServer = ({ database }: ServerOptions): Application => {
  const server = jsonServer.create();
  const router = jsonServer.router(database);
  const middlewares = jsonServer.defaults();

  server.get("/create-user", (_req: any, res: any) => {
    const user = createUser(router.db);
    res.json({ user });
  });

  server.use(middlewares);
  server.use(router);

  return server;
};
