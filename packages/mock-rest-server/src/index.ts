import jsonServer from "json-server";

import createUser from "./create-user";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.get("/create-user", (_req: any, res: any) => {
  const user = createUser(router.db);
  res.json({ user });
});

server.use(middlewares);
server.use(router);

const port = process.env.PORT || 3002;

server.listen(port, () => {
  console.log("JSON Server is running ");
});
