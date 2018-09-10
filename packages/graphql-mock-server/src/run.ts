import path from "path";

import { createServer } from "./server";

const run = async () => {
  const server = await createServer({
    dbFile: path.join(__dirname, "..", "db.json")
  });

  server.listen().then(({ url }: { url: string }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

run();
