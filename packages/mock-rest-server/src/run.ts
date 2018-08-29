import { createServer } from "./server";

const server = createServer({ database: "db.json" });

const port = process.env.PORT || 3002;

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
